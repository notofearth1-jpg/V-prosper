import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import Loader from "../../../components/common/Loader";
import {
  checkLocalStorage,
  fetchUserLanguages,
  languageValidationSchema,
  submitUserLanguages,
} from "./UserLanguageController";
import Select, { GroupBase } from "react-select";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ICDropDownMultiSelect from "../../../core-component/ICDropDownMultiSelect";
import ICButton from "../../../core-component/ICButton";
import { SweetAlertError } from "../../../components/common/sweetAlertError";
import ICProgressLine from "../../../core-component/ICProgressLine";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}
interface ITransformedOption {
  value: number;
}
interface IFormValues {
  type: string;
  value: ITransformedOption[];
}

const UserLanguage: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [languages, setLanguages] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);

  const initialValuesLanguages = {
    type: "languages",
    value: [],
  };

  const formik = useFormik<IFormValues>({
    initialValues: initialValuesLanguages,
    validationSchema: languageValidationSchema(t),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const payload = {
        type: values.type,
        value: values.value.map((option) => option.value),
      };

      await submitUserLanguages([payload], navigate, setCurrentIndex, t);
      formik.setSubmitting(false);
    },
  });

  const handleSelectChange = (selectedOptions: any) => {
    formik.setFieldValue("value", selectedOptions);
  };

  const transformLanguagesToOptions = (languages: IDDL[]): any[] => {
    return languages.map((language) => ({
      value: language.data_value,
      label: language.display_value,
    }));
  };

  const groupedOptions: GroupBase<ITransformedOption>[] = [
    {
      label: "Languages",
      options: transformLanguagesToOptions(languages),
    },
  ];

  const previous = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    fetchUserLanguages(setLanguages, setLoading, t);
  }, []);

  const localStorageComplete = checkLocalStorage();
  // const verifyStatus = localStorageUtils.getIsAlternateMobileVerify();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
          <div className="">
            <div className="mt-5">
              <div className="birth-date">
                <ICProgressLine percent={100} strokeWidth={2} />
                <div className="top">
                  <p className="alt-mobile">{t("language_prefer")}</p>
                </div>
                <div className="top">
                  <ICDropDownMultiSelect
                    isMulti
                    options={groupedOptions as GroupBase<never>[]}
                    onChange={handleSelectChange}
                    value={formik.values.value}
                    isSearchable
                    menuIsOpen
                    // Add below option to open dropdown top and bottom by screen remaining spacing
                    // menuPlacement="auto"
                    // maxMenuHeight={300}
                    placeholder="Select languages..."
                  />

                  {formik.errors.value ? (
                    <SweetAlertError message={formik.errors.value as any} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase sm:mr-1 sm:mb-0 mb-5`}
              onClick={previous}
            />
            {localStorageComplete && (
              <ICButton
                type="button"
                children={t("submit")}
                loading={formik.isSubmitting}
                className={`uppercase sm:ml-10 ${
                  !formik.isValid
                    ? "cursor-not-allowed comman-disablebtn"
                    : "comman-btn"
                }`}
                onClick={() => formik.handleSubmit()}
                disabled={!formik.isValid || formik.isSubmitting}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserLanguage;
