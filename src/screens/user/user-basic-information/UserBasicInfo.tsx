import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { Line } from "rc-progress";
import Loader from "../../../components/common/Loader";
import { TReactSetState } from "../../../data/AppType";
import ICDropDown from "../../../core-component/ICDropDown";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import ICTextInput from "../../../core-component/ICTextInput";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";
import {
  submitBasicInfo,
  validationSchemaUserBasicInformation,
} from "./UserBasicInformationController";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserBasicInformation: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();

  const validationSchema = validationSchemaUserBasicInformation(t);

  const initialValues = {
    full_name: localStorageUtils.getUserFullName() || "",
    email: localStorageUtils.getEmail() || "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitBasicInfo(values, setCurrentIndex);
      formik.setSubmitting(false);
    },
  });

  return (
    <>
      <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
        <div className="col-span-12 sm:col-span-9 mt-5">
          <div className="alternate mobile number">
            <ICProgressLine percent={0} strokeWidth={2} />
            <div className=" top">
              <p className="alt-mobile ">{t("basic_Information")}</p>
            </div>
            <div className="relative top">
              <div className="top">
                <ICTextInput
                  placeholder={t("full_name")}
                  name="full_name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus
                  errorMessage={
                    formik.touched?.full_name
                      ? formik.errors.full_name
                      : undefined
                  }
                />
              </div>
              <div className="top">
                <ICTextInput
                  placeholder={t("email")}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched?.email ? formik.errors.email : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
          <ICButton
            type="button"
            children={t("next")}
            loading={formik.isSubmitting}
            className={`uppercase !mb-2 sm:!ml-10 !w-full ${
              !formik.isValid
                ? "cursor-not-allowed comman-disablebtn"
                : "comman-btn"
            }`}
            onClick={() => formik.handleSubmit()}
            disabled={!formik.isValid || formik.isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

export default UserBasicInformation;
