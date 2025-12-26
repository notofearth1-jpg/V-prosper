import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { Line } from "rc-progress";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";

import { ITrainerSpace } from "../../../services/trainer/TrainerService";
import {
  initialValuesSpace,
  submitTrainerSpaceDetails,
} from "./TrainerSpaceController";
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

const TrainerSpace: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const userId = localStorageUtils.getUserId();
  const [trainerDetails, setTrainerDetails] = useState<ITrainerSpace>();
  const [selectedOwnSpaceOption, setSelectedOwnSpaceOption] =
    useState<boolean>(true);
  const [selectedOwnSpaceRentOption, setSelectedOwnSpaceRentOption] =
    useState<boolean>(true);

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesSpace(trainerDetails),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      let overview_section_status;

      if (
        trainerDetails?.overview_section_status &&
        Array.isArray(trainerDetails.overview_section_status.completed) &&
        trainerDetails.overview_section_status.completed.length === 4 &&
        trainerDetails.overview_section_status.completed.every(
          (value, index) => value === index + 1
        ) &&
        Array.isArray(trainerDetails.overview_section_status.in_progress)
      ) {
        overview_section_status = {
          completed: trainerDetails.overview_section_status.completed,
          in_progress: trainerDetails.overview_section_status.in_progress,
        };
      } else {
        overview_section_status = {
          completed: [1, 2],
          in_progress: [3],
        };
      }

      await submitTrainerSpaceDetails(
        { ...values, overview_section_status },
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("ud", 1)
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
        setSelectedOwnSpaceRentOption(
          updatedDetails.has_space_for_rent === undefined
            ? true
            : updatedDetails.has_space_for_rent
        );
        setSelectedOwnSpaceOption(
          updatedDetails.has_own_session_space === undefined
            ? true
            : updatedDetails.has_own_session_space
        );
      }
    };
    fetchData();
  }, []);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  const handleSelectOptionForOwnSpace = (option: boolean) => {
    setSelectedOwnSpaceOption(option);
    formik.setFieldValue("has_own_session_space", option);
  };
  const handleSelectOptionForOwnSpaceRent = (option: boolean) => {
    setSelectedOwnSpaceRentOption(option);
    formik.setFieldValue("has_space_for_rent", option);
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
              <ICProgressLine percent={100} strokeWidth={2} />
              <div className="ml-2">
                <BackToOverviewButton onClick={backOverview} />
              </div>
            </div>
            <div className="top">
              <p className="trainer-font">{t("do_you_own")}</p>
            </div>
            <div className="top">
              <ICRadioGroup
                selectedValue={selectedOwnSpaceOption}
                options={GENERIC_QUESTION_RADIO_BUTTON_OPTION}
                onSelectionChange={(option) =>
                  handleSelectOptionForOwnSpace(option.value)
                }
              />
            </div>

            <div className="top">
              <p className="trainer-font">{t("do_you_rent")}</p>
            </div>

            <div className="top">
              <ICRadioGroup
                selectedValue={selectedOwnSpaceRentOption}
                options={GENERIC_QUESTION_RADIO_BUTTON_OPTION}
                onSelectionChange={(option) =>
                  handleSelectOptionForOwnSpaceRent(option.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="buttons p-3 flex flex-col sm:flex-row items-center justify-center">
          <ICButton
            type="button"
            className={`uppercase  sm:mr-1 sm:mb-0 mb-2`}
            onClick={privious}
          >
            {t("previous")}
          </ICButton>

          <ICButton
            type="button"
            children={t("next")}
            loading={formik.isSubmitting}
            className={`uppercase sm:ml-10`}
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerSpace;
