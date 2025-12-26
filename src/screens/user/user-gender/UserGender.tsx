import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import {
  genderValidationSchema,
  fetchUserGender,
  submitUserGender,
} from "./UserGenderController";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ICRadioGroup from "../../../core-component/ICRadioGroup";
import ICButton from "../../../core-component/ICButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICProgressLine from "../../../core-component/ICProgressLine";
import { infoIcon } from "../../../assets/icons/SvgIconList";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserGender: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [gender, setGender] = useState<IDDL[]>([]);
  const [selectedGender, setSelectedGender] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrevious, setIsPrevious] = useState(false);

  const initialValuesGender = {
    type: "gender",
    value: selectedGender,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesGender,
    validationSchema: genderValidationSchema(t),

    onSubmit: async (values) => {
      !isPrevious ? formik.setSubmitting(true) : formik.setSubmitting(false);

      await submitUserGender(
        { ...values, value: selectedGender },
        navigate,
        setCurrentIndex,
        t,
        isPrevious
      );
      formik.setSubmitting(false);
    },
  });

  const previous = () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  useEffect(() => {
    fetchUserGender(setGender, setLoading, t);
    const storedType = localStorageUtils.getUserType();
    const storedValue = localStorageUtils.getUserValue();
    if (storedType && storedValue) {
      const parsedValue = parseInt(storedValue, 10);
      setSelectedGender(parsedValue);
      formik.setValues({ type: storedType, value: parsedValue });
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
          <div>
            <div className="flex justify-center mt-5">
              <div className="gender">
                <ICProgressLine percent={37.5} strokeWidth={2} />
                <div className="top">
                  <p className="alt-mobile">{t("what_your_gender")}</p>
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
                  {formik.errors.value && formik.touched.value && (
                    <div className="text-skin-error-message">
                      {formik.errors.value}
                    </div>
                  )}
                </div>
                <div className="top grid grid-cols-12  text-justify space-x-1.5">
                  <div className="h-4 w-4 mt-0.5 col-span-1">{infoIcon}</div>
                  <div className="comman-grey col-span-11">
                    {t("gender_note")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase mb-5 
               !w-full `}
              onClick={previous}
            />

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase mb-5 sm:!ml-10 !w-full ${
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
    </>
  );
};

export default UserGender;
