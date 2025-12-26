import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  ISocialSignIn,
  checkAppleSignIn,
  checkFacebookSignIn,
  checkGoogleSignIn,
  initialValuesLogin,
  loginApi,
  signInWithApple,
  signInWithFacebook,
  signInWithGoogle,
  validationSchemaLogin,
} from "./LoginControllers";
import useTranslationHook from "../../../hooks/UseTranslationHook";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import {
  appleIcon,
  facebookIcon,
  googleIcon,
} from "../../../assets/icons/SvgIconList";
import ICTextInput from "../../../core-component/ICTextInput";
import ICDropDown from "../../../core-component/ICDropDown";
import { commonRoute } from "../../../routes/RouteCommon";
import ICImage from "../../../core-component/ICImage";
import { generateKeys, handleNumericInput } from "../../../utils/AppFunctions";
import ICCommonModal from "../../../components/common/ICCommonModel";
import {
  fetchContentManagementApi,
  IAppContent,
} from "../../about/AboutController";
import { APP_CONTENT_TYPE } from "../../../utils/AppEnumerations";
import CustomEditor from "../../product-services/Web/CustomEditor";
import { submitCrypto } from "../AuthController";
import { PUBLIC_KEY } from "../../../config/AppConfig";

const LoginView = () => {
  const { t } = useTranslationHook();
  const navigation = useNavigate();
  const [mobileNo, setMobileNo] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [showTermsAndCondition, setShowTermsAndCondition] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(1);
  const [isSocialSignIn, setIsSocialSignIn] = useState<ISocialSignIn>();
  const [terms, setTerms] = useState<IAppContent>();
  const [privacy, setPrivacy] = useState<IAppContent>();
  const location = useLocation();
  const [cryptoInitialized, setCryptoInitialized] = useState(false);
  const cryptoCipherKey = localStorageUtils.getCryptoKey();

  useEffect(() => {
    const initializeCrypto = async () => {
      if (!cryptoCipherKey) {
        const cryptoKey = generateKeys(PUBLIC_KEY);
        localStorageUtils.setCryptoKey(JSON.stringify(cryptoKey));
        await submitCrypto(cryptoKey);

        const storedKey = localStorageUtils.getCryptoKey();
        if (storedKey) {
          setCryptoInitialized(true);
        }
      } else {
        setCryptoInitialized(true);
      }
    };

    initializeCrypto();
  }, [cryptoCipherKey]);

  useEffect(() => {
    if (cryptoInitialized) {
      const fetchStoredUserName = async () => {
        const storedUserName = await Number(localStorageUtils.getUserName());
        if (storedUserName !== 0) {
          setMobileNo(storedUserName);
        }
      };

      fetchStoredUserName();
      fetchContentManagementApi(setPrivacy, APP_CONTENT_TYPE.PrivacyPolicy);
      fetchContentManagementApi(setTerms, APP_CONTENT_TYPE.TermsOfService);
    }
  }, [cryptoInitialized]);

  useEffect(() => {
    if (cryptoInitialized) {
      localStorage.clear();
      sessionStorage.clear();
      const fetchData = () => {
        checkGoogleSignIn(setIsSocialSignIn);
        checkFacebookSignIn(setIsSocialSignIn);
        checkAppleSignIn(setIsSocialSignIn);
      };

      fetchData();
    }
  }, [cryptoInitialized]);

  useEffect(() => {
    if (cryptoInitialized) {
      const handlePopState = (event: PopStateEvent) => {
        window.history.pushState(null, "", location.pathname);
        event.preventDefault();
      };

      window.history.pushState(null, "", location.pathname);

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [cryptoInitialized, location]);

  // Validation schema and formik setup
  const validationSchema = validationSchemaLogin(t);
  const formikInitialValues = {
    ...initialValuesLogin,
    username: mobileNo,
  };

  const formik = useFormik({
    initialValues: formikInitialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      loginApi(values, navigation, setLoading);
    },
  });

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
                  className="object-cover"
                />
              </div>
              <div className="text-center md:mt-[50px] mt-0">
                <p className="comman-text login-text">{t("hello_there")}</p>
                <p className="comman-text login-text">{t("get_start")}</p>
              </div>
              <form
                className="flex-col flex w-full mt-[50px]"
                onSubmit={formik.handleSubmit}
              >
                <div>
                  <div className="relative">
                    <div className="flex justify-center space-x-3">
                      <ICDropDown
                        label={t("country")}
                        borderNone
                        borderColor
                        selected={selectedCountry ? selectedCountry : undefined}
                        options={[
                          {
                            label: "+91",
                            value: 1,
                          },
                        ]}
                        textSpacing="mobile-number-spacing"
                        className={`${
                          selectedCountry ? "!w-[60px]" : "!w-[80px]"
                        } !mt-[5.5px]  `}
                        onSelect={(option) => setSelectedCountry(option.value)}
                      />

                      <ICTextInput
                        type="text"
                        inputMode="numeric"
                        textClass="mobile-number-spacing"
                        autoFocus
                        placeholder={t("mobile_number")}
                        name="username"
                        value={formik.values.username}
                        onChange={(event) => {
                          handleNumericInput(event);
                          formik.setFieldValue(
                            "username",
                            event.target.value
                              ? Number(event.target.value)
                              : undefined
                          );
                        }}
                        onBlur={formik.handleBlur}
                        errorMessage={
                          formik.touched?.username
                            ? formik.errors.username
                            : undefined
                        }
                        borderNone
                        borderColor
                        customErrorText
                      />
                    </div>
                  </div>
                  {isSocialSignIn?.appleIs === "1" ||
                  isSocialSignIn?.facebookIs === "1" ||
                  isSocialSignIn?.googleIs === "1" ? (
                    <div className="mb-4">
                      <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[#030303] after:mt-0.5 after:flex-1 after:border-t after:border-[#030303]">
                        <p className="mx-4 mb-0 text-center font-semibold text-white">
                          {t("Or")}
                        </p>
                      </div>

                      <div className="flex space-x-5 justify-center">
                        {isSocialSignIn?.googleIs === "1" && (
                          <div
                            className="cursor-pointer "
                            onClick={() => signInWithGoogle(navigation)}
                          >
                            <div className="h-8 w-8 border border-1 rounded-2xl p-1">
                              {googleIcon}
                            </div>
                          </div>
                        )}
                        {isSocialSignIn?.facebookIs === "1" && (
                          <div
                            className="cursor-pointer"
                            onClick={signInWithFacebook}
                          >
                            <div className="h-7 w-7">{facebookIcon}</div>
                          </div>
                        )}
                        {isSocialSignIn?.appleIs === "1" && (
                          <div
                            className="cursor-pointer"
                            onClick={signInWithApple}
                          >
                            <div className="h-8 w-8 border border-1 rounded-2xl p-1">
                              {appleIcon}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span></span>
                  )}
                </div>
              </form>
            </div>
            <div className="w-full md:mt-[50px] mt-10">
              <div className="text-center lg:text-left flex justify-center">
                <button
                  children={t("log_in")}
                  className={`w-full ${loading ? "cursor-not-allowed " : ""} ${
                    formik.values.username === undefined
                      ? "comman-disablebtn-login cursor-not-allowed auth-padding text-white"
                      : ""
                  } ${
                    !formik.isValid
                      ? "cursor-not-allowed comman-disablebtn-login auth-padding"
                      : "auth-btn"
                  }`}
                  disabled={!formik.isValid || loading}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                />
              </div>
              <div className="text-center top">
                <div className="flex flex-col comman-black-text">
                  <div className="text-nowrap w-full text-center">
                    {t("agree_info")}&nbsp;
                  </div>
                  <div className="flex justify-center items-end cursor mt-1">
                    <div
                      onClick={() => {
                        setShowTermsAndCondition(true);
                        setShowPrivacyPolicy(false);
                      }}
                      className="text-blue-600 cursor !text-[11px] pt-[0.5px] text-nowrap text-center"
                    >
                      {t("terms_and_condition")},
                    </div>
                    <div
                      onClick={() => {
                        setShowTermsAndCondition(false);
                        setShowPrivacyPolicy(true);
                      }}
                      className="cursor text-blue-600 cursor !text-[13px] pt-[0.5px] text-nowrap "
                    >
                      &nbsp;{t("privacy_policy")}
                    </div>
                  </div>
                </div>
              </div>

              {showTermsAndCondition && (
                <ICCommonModal
                  title={t(terms?.type ? terms?.type : "")}
                  content={
                    <div className="comman-grey flex-1 overflow-y-scroll remove-scrollbar-width">
                      <p>
                        <CustomEditor serviceDesc={terms?.value} />
                      </p>
                    </div>
                  }
                  isModalShow={showTermsAndCondition}
                  setIsModalShow={setShowTermsAndCondition}
                />
              )}
              {showPrivacyPolicy && (
                <ICCommonModal
                  title={t(privacy?.type ? privacy?.type : "")}
                  content={
                    <div className="comman-grey flex-1 overflow-y-scroll remove-scrollbar-width">
                      <p>
                        <CustomEditor serviceDesc={privacy?.value} />
                      </p>
                    </div>
                  }
                  isModalShow={showPrivacyPolicy}
                  setIsModalShow={setShowPrivacyPolicy}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
