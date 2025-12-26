import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import useTranslationHook from "../../../hooks/UseTranslationHook";
import ICOtpInput from "../../../core-component/ICOtpInput";
import { initialValuesOtp, submitOtpApi } from "./OtpController";
import { loginApi, resendOTP } from "../login/LoginControllers";
import Timer from "../../../core-component/ICTimer";
import { editIcon } from "../../../assets/icons/SvgIconList";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";

const VerifyOTP = () => {
  const { t } = useTranslationHook();
  const navigation = useNavigate();
  const location = useLocation();
  const mobileNo = location?.state?.username;

  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (otp: string) => {
    setOtpValue(otp);
  };

  const formik = useFormik({
    initialValues: initialValuesOtp,
    onSubmit: async (values) => {
      submitOtpApi(
        { ...values, otp: otpValue, username: mobileNo },
        navigation,
        setLoading,
        t
      );
      setOtpValue("");
      localStorageUtils.removeAll();
    },
  });

  function ResendOTP() {
    resendOTP({ username: mobileNo }, setLoading);
    setOtpValue("");
  }

  const handleBackToLogin = () => {
    localStorageUtils.setUserName(mobileNo);
    navigation(-1);
  };

  return (
    <div className="relative w-full h-screen">
      <div className="grid grid-rows-3 xl:grid-rows-1 xl:grid-cols-2 h-full">
        <div className="relative row-span-1 z-10 flex items-center justify-center md:items-start md:justify-start">
          <div className="h-[111px] w-[111px] md:ml-12 md:mt-12">
            <ICImage
              src={require("../../../assets/image/VP.png")}
              className=" object-cover md:hidden"
            />
          </div>
        </div>
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={require("../../../assets/image/sign-in-screens.mp4")}
          playsInline
        />

        <div className="px-10 md:px-20 py-12 flex justify-end row-span-2 items-center">
          <div className="auth-screen-spacing relative z-10 login-content md:max-w-[560px] h-fit max-h-[400px] overflow-y-auto md:max-h-full w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="h-[111px] w-[111px] hidden md:block">
                <ICImage
                  src={require("../../../assets/image/VP.png")}
                  className=" object-cover"
                />
              </div>
              <div className="text-center  md:mt-[50px] mt-0">
                <p className="login-text">{t("otp_verification")}</p>
                <p className="otp-text">{t("otp_on_your_mobile_number")}</p>
              </div>
              <form
                className="flex-col flex w-full md:mt-[50px] mt-0"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex mt-3 items-center justify-center text-center">
                  <p className="mx-5">+91 {mobileNo}</p>
                  <p className="cursor w-6 h-6" onClick={handleBackToLogin}>
                    {editIcon}
                  </p>
                </div>
                <div className="relative top flex items-center justify-center">
                  <ICOtpInput
                    value={otpValue}
                    onChange={handleOtpChange}
                    numInputs={4}
                  />
                </div>
                <div className="w-full md:mt-[50px] top">
                  <div className="mb-3 flex justify-center">
                    <Timer
                      initialTime="0:30"
                      maxResends={3}
                      onResend={ResendOTP}
                    />
                  </div>
                  <div className="text-center lg:text-left top">
                    <button
                      type="submit"
                      children={t("verify_and_continue")}
                      className={`!w-full  ${
                        otpValue.length !== 4
                          ? "cursor-not-allowed comman-disablebtn-login auth-padding text-white"
                          : "auth-btn"
                      }`}
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      disabled={otpValue.length !== 4}
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
