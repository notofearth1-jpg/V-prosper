import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import {
  IQuestionAnswer,
  trainerHealthValidationSchema,
  fetchTrainerHealthApi,
  submitTrainerHelathDetails,
  initialHealthValues,
} from "./TrainerHealthController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import ICTextInput from "../../../core-component/ICTextInput";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerHealth: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [healthQuestion, setHealthQuestion] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const userId = localStorageUtils.getUserId();

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        if (updatedDetails && updatedDetails.health_questionnaire) {
          const answers = updatedDetails.health_questionnaire.map(
            (item: IQuestionAnswer) => item.answer
          );
          setUserAnswers(answers);
        }
      }
    };

    fetchData();
  }, []);

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
    initialValues: initialHealthValues(healthQuestion, userAnswers),
    validationSchema: trainerHealthValidationSchema(t),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const healthPayload = [
        {
          health_questionnaire: values.health_questionnaire.map((item) => ({
            question_id: item.question_id,
            answer: item.answer,
          })),
        },
      ];

      await submitTrainerHelathDetails(
        healthPayload[0],
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 8)
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
      updateQueryStringParameter("qa", 7);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    fetchTrainerHealthApi(setHealthQuestion, setLoading, t);
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
          <div className="">
            <div className="">
              <div className="Health">
                <div className="flex items-center justify-between">
                  <ICProgressLine percent={84} strokeWidth={2} />
                  <div className="ml-2">
                    <BackToOverviewButton onClick={backOverview} />
                  </div>
                </div>
                <div className=" top">
                  <p className="trainer-font">{t("health_details")}</p>
                </div>
                {healthQuestion.map((data, index) => (
                  <div key={index} className="top">
                    <ICTextInput
                      label={data.display_value}
                      placeholder={t("type_here")}
                      value={
                        formik.values.health_questionnaire[index]?.answer || ""
                      }
                      onChange={(e) =>
                        formik.setFieldValue(`health_questionnaire[${index}]`, {
                          question_id: data.data_value,
                          answer: e.target.value,
                        })
                      }
                      errorMessage={
                        formik.touched.health_questionnaire &&
                        formik.errors.health_questionnaire &&
                        (formik.errors.health_questionnaire[index] as any)
                          ?.answer
                          ? (formik.errors.health_questionnaire[index] as any)
                              .answer
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="buttons p-3 mt-4 flex flex-col sm:flex-row items-center justify-center">
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
              className={`uppercase sm:ml-10 ${
                !formik.isValid
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerHealth;
