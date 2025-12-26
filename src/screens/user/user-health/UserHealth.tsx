import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import Loader from "../../../components/common/Loader";
import {
  IUserHealth,
  fetchUserHealth,
  getUserBloodGroup,
  healthValidationSchema,
  submitUserHealth,
} from "./UserHealthController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ICTextInput from "../../../core-component/ICTextInput";
import ICButton from "../../../core-component/ICButton";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICProgressLine from "../../../core-component/ICProgressLine";
import ICDropDown from "../../../core-component/ICDropDown";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserHealth: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [healthQuestion, setHealthQuestion] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);
  const [isPrevious, setIsPrevious] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<IDDL[]>([]);
  const [selectedBloodGroupId, setSelectedBloodGroupId] = useState<
    number | null
  >(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(
    null
  );

  useEffect(() => {
    const answers = localStorage.getItem("answer1");
    if (answers) {
      setUserAnswers(JSON.parse(answers));
    }
  }, []);
  const initialValuesHealth = {
    type: "health_questionnaire",
    value: healthQuestion.map((question, index) => ({
      question_id: question.data_value,
      answer: userAnswers[index] || "",
    })),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesHealth,
    validationSchema: healthValidationSchema(t),

    onSubmit: async (values) => {
      !isPrevious ? formik.setSubmitting(true) : formik.setSubmitting(false);

      const healthPayload = [
        {
          type: values.type,
          value: values.value.map((item) => ({
            question_id: item.question_id,
            answer: item.answer,
          })),
        },
        {
          type: "blood_group",
          value: selectedBloodGroup,
        },
      ];

      await submitUserHealth(
        healthPayload as IUserHealth[],
        setCurrentIndex,
        isPrevious
      );
      formik.setSubmitting(false);
      if (selectedBloodGroupId) {
        localStorageUtils.setBloodGroup(selectedBloodGroupId.toString());
      }
    },
  });

  const previous = () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  useEffect(() => {
    fetchUserHealth(setHealthQuestion, setLoading, t);
    getUserBloodGroup(setBloodGroup, setLoading);
  }, []);

  const handleOptionClick = (option: string, selected_id: number) => {
    setSelectedBloodGroupId(selected_id);
    setSelectedBloodGroup(option);
  };

  useEffect(() => {
    const storedBloodGroupId = localStorageUtils.getBloodGroup();
    if (storedBloodGroupId) {
      const selectedRelation = bloodGroup.find(
        (data) => data.data_value === parseInt(storedBloodGroupId, 10)
      );
      if (selectedRelation) {
        setSelectedBloodGroup(selectedRelation.display_value);
        setSelectedBloodGroupId(selectedRelation.data_value);
      }
    }
  }, [bloodGroup]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`flex flex-col h-screen justify-between max-w-[500px] w-full overflow-hidden`}
        >
          <div className="flex-1 overflow-y-scroll">
            <div className="mt-5">
              <div className="Health">
                <ICProgressLine percent={62.5} strokeWidth={2} />
                <div className="top">
                  <p className="alt-mobile">{t("health_details")}</p>
                </div>
                <div className="top">
                  <ICDropDown
                    label={t("select_blood_group")}
                    selected={
                      selectedBloodGroupId ? selectedBloodGroupId : undefined
                    }
                    className={"w-full"}
                    options={bloodGroup.map((data, index) => ({
                      label: data.display_value,
                      value: data.data_value,
                    }))}
                    onSelect={(option) =>
                      handleOptionClick(option.label, option.value)
                    }
                  />
                  {!selectedBloodGroup && (
                    <div className="text-skin-error">
                      {t("select_blood_group_error")}
                    </div>
                  )}
                </div>
                {healthQuestion &&
                  healthQuestion.length > 0 &&
                  healthQuestion.map((data, index) => (
                    <>
                      <div key={index} className="top">
                        <ICTextInput
                          label={`${index + 1}. ${data.display_value}`}
                          placeholder={t("type_here")}
                          name="value.postcode"
                          value={formik.values.value[index]?.answer || ""}
                          onChange={(e) =>
                            formik.setFieldValue(`value[${index}]`, {
                              question_id: data.data_value,
                              answer: e.target.value,
                            })
                          }
                          errorMessage={
                            formik.touched.value &&
                            formik.errors.value &&
                            (formik.errors.value[index] as any)?.answer
                              ? (formik.errors.value[index] as any).answer
                              : undefined
                          }
                        />
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center md:mb-10">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase sm:mr-1 sm:mb-0 mb-5  ${
                !formik.isValid || !selectedBloodGroup
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              disabled={
                !formik.isValid || formik.isSubmitting || !selectedBloodGroup
              }
              onClick={previous}
            />

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase sm:ml-10 ${
                !formik.isValid || !selectedBloodGroup
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={
                !formik.isValid || formik.isSubmitting || !selectedBloodGroup
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserHealth;
