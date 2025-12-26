import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import { ITrainerEvents } from "../../../services/trainer/TrainerService";
import {
  initialValuesMarketingPartner,
  submitTrainerEventDetails,
} from "./TarinerEventController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import ICRadioGroup from "../../../core-component/ICRadioGroup";
import { GENERIC_QUESTION_RADIO_BUTTON_OPTION } from "../../../utils/AppConstants";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerEvents: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(true);
  const [selectedMarketing, setSelectedMarketing] = useState<boolean>(true);
  const userId = localStorageUtils.getUserId();
  const [trainerDetails, setTrainerDetails] = useState<ITrainerEvents>();

  const location = useLocation();

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(location.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };
  const handleSelectOptionForMarketingEvent = (option: boolean) => {
    setSelectedMarketing(option);
    formik.setFieldValue("is_marketing_partner", option);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesMarketingPartner(trainerDetails),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitTrainerEventDetails(
        values,
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 7)
      );
      formik.setSubmitting(false);
    },
  });

  const privious = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("qa", 6);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setTrainerDetails(updatedDetails);
        setSelectedMarketing(
          updatedDetails.is_marketing_partner === undefined
            ? true
            : updatedDetails.is_marketing_partner
        );
      }
    };
    fetchData();
  }, []);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);
  return (
    <div className="flex justify-center">
      <div
        ref={mainBgRef}
        className={`${
          isFullHeight ? "h-[96vh]" : "h-auto"
        } xl:w-1/2 flex flex-col justify-between`}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="gender">
            <div className="flex items-center justify-between">
              <ICProgressLine percent={70} strokeWidth={2} />
              <div className="ml-2">
                <BackToOverviewButton onClick={backOverview} />
              </div>
            </div>
            <div className="top">
              <p className="trainer-font">{t("would_you_like")}</p>
            </div>
            <div className="top">
              <ICRadioGroup
                selectedValue={selectedMarketing}
                options={GENERIC_QUESTION_RADIO_BUTTON_OPTION}
                onSelectionChange={(option) =>
                  handleSelectOptionForMarketingEvent(option.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="buttons p-3 flex flex-col sm:flex-row items-center justify-center">
          <ICButton
            type="button"
            className={`uppercase sm:mr-1 sm:mb-0 mb-2`}
            onClick={privious}
          >
            {t("previous")}
          </ICButton>

          <ICButton
            type="button"
            children={t("next")}
            loading={formik.isSubmitting}
            className={`uppercase  sm:ml-10`}
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerEvents;
