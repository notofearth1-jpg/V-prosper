import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";

import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import { fetchUserGender } from "../../user/user-gender/UserGenderController";
import {
  initialGenderValues,
  submitTrainerGenderDetails,
  trainerGenderValidationSchema,
} from "./TrainerGenderController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import ICRadioGroup from "../../../core-component/ICRadioGroup";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerGender: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [gender, setGender] = useState<IDDL[]>([]);
  const [selectedGender, setSelectedGender] = useState(0);
  const [loading, setLoading] = useState(true);
  const userId = localStorageUtils.getUserId();

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
    initialValues: initialGenderValues(selectedGender),
    validationSchema: trainerGenderValidationSchema(t),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitTrainerGenderDetails(
        values,
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 5)
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
      updateQueryStringParameter("qa", 4);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      fetchUserGender(setGender, setLoading, t);
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setSelectedGender(updatedDetails.gender);
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
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`${
            isFullHeight ? "h-[96vh]" : "h-auto"
          } xl:w-1/2 flex flex-col justify-between`}
        >
          <div className="grid grid-cols-1">
            <div className="flex justify-center">
              <div className="gender">
                <div className="flex items-center justify-between">
                  <ICProgressLine percent={42} strokeWidth={2} />
                  <div className="ml-2">
                    <BackToOverviewButton onClick={backOverview} />
                  </div>
                </div>
                <div className="top">
                  <p className="trainer-font">{t("what_your_gender")}</p>
                </div>
                <div className="top">
                  <ICRadioGroup
                    selectedValue={selectedGender}
                    options={gender.map((item) => ({
                      label: item.display_value,
                      value: item.data_value,
                    }))}
                    onSelectionChange={(option) =>
                      setSelectedGender(option.value)
                    }
                  />

                  {formik.errors.gender && formik.touched.gender && (
                    <div className="text-skin-trainer-validation">
                      {formik.errors.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="buttons flex p-3 flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase !w-full  sm:mr-1 sm:mb-0 mb-2`}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase !w-full sm:ml-10 `}
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerGender;
