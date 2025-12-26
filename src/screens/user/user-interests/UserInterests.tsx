import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import Loader from "../../../components/common/Loader";
import {
  fetchUserInterestDdl,
  submitUserInterests,
} from "./UserInterestController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ICMultiCheckbox from "../../../core-component/ICMultiCheckbox";
import ICButton from "../../../core-component/ICButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface UserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserInterests: React.FC<UserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [Interests, setInterests] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isPrevious, setIsPrevious] = useState(false);

  const initialValuesHealth = {
    type: "category",
    value: [],
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesHealth,

    onSubmit: async (values) => {
      !isPrevious ? formik.setSubmitting(true) : formik.setSubmitting(false);
      await submitUserInterests(
        [{ ...values, value: selectedInterests }],
        navigate,
        setCurrentIndex,
        t,
        isPrevious
      );
      formik.setSubmitting(false);
    },
  });

  const handleCheckboxChange = (value: number) => {
    if (selectedInterests.includes(value)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== value));
    } else {
      setSelectedInterests([...selectedInterests, value]);
    }
  };

  const previous = () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  useEffect(() => {
    fetchUserInterestDdl(setInterests, setLoading, t);
  }, []);

  useEffect(() => {
    const interestsValues = Interests.map((item) => item.data_value);

    const storedValuesString = localStorageUtils.getUserInterest();
    const interestsLocalValues = storedValuesString
      ? JSON.parse(storedValuesString)
      : [];

    const commonInterestsValues = interestsValues.filter((value) =>
      interestsLocalValues.includes(value)
    );

    formik.setFieldValue("value", commonInterestsValues);
    setSelectedInterests(commonInterestsValues);
  }, [Interests]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
          <div className="">
            <div className=" mt-5">
              <div className="Interests">
                <ICProgressLine percent={80} strokeWidth={2} />
                <div className=" top">
                  <p className="alt-mobile">{t("your_wellness_interests")}</p>
                </div>
                <div className="mt-6">
                  <ICMultiCheckbox<number>
                    options={Interests.map((item) => ({
                      label: item.display_value,
                      value: item.data_value,
                    }))}
                    onSelectionChange={(option) => {
                      handleCheckboxChange(option.value);
                      selectedInterests.includes(option.value);
                    }}
                    selectedValues={selectedInterests}
                  />
                </div>
                {selectedInterests.length === 0 && (
                  <div className="text-skin-error-message top">
                    {t("select_at_least_one_interest")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase sm:mr-1 mb-5 ${
                selectedInterests.length === 0
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              disabled={selectedInterests.length === 0 || formik.isSubmitting}
              onClick={previous}
            />

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase mb-5 sm:ml-10  ${
                selectedInterests.length === 0
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={selectedInterests.length === 0 || formik.isSubmitting}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserInterests;
