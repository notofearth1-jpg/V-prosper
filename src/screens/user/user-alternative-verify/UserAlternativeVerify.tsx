import { useState } from "react";
import ICOtpInput from "../../../core-component/ICOtpInput";
import { toastError } from "../../../utils/AppFunctions";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import { editIcon } from "../../../assets/icons/SvgIconList";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_FLOW_STATUS } from "../../../utils/AppEnumerations";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICButton from "../../../core-component/ICButton";
import { submitAlterativeOtp } from "./UserAlternativeVerifyController";
import ICImage from "../../../core-component/ICImage";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserAltMobileVerify: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [otpValue, setOtpValue] = useState("");
  const mobileNo = localStorageUtils.getAlternatePhone();

  const handleOtpChange = (otp: string) => {
    setOtpValue(otp);
  };

  const handleOtpVerify = () => {
    submitAlterativeOtp(otpValue, setCurrentIndex, t);
  };
  const handleLinkClick = (index: number) => {
    setCurrentIndex(index);
  };
  return (
    <section className="h-screen">
      <div className="h-full">
        <div className="flex md:h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <ICImage
              src={require("../../../assets/image/vp-otp-verification.png")}
              className="w-full"
            />
          </div>

          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <div className="text-center mt-5">
              <p className="!font-bold comman-black-big !text-3xl">
                {t("otp_verification")}
              </p>
              <p className="comman-grey">{t("opt_mobile_number")}</p>
            </div>
            <div className="flex mt-3 items-center justify-center text-center comman-black-text">
              <p className="mx-5">+91 {mobileNo}</p>
              {/* <p
                className="cursor w-6 h-6"
                onClick={() =>
                  handleLinkClick(USER_FLOW_STATUS.AlternateMobile)
                }
              >
                {editIcon}
              </p> */}
            </div>
            <form className="mt-5">
              <div className="relative mb-6 flex items-center justify-center">
                <ICOtpInput
                  value={otpValue}
                  onChange={handleOtpChange}
                  numInputs={4}
                />
              </div>
              <div className="mb-6 flex items-center justify-between"></div>
              <div className="text-center lg:text-left">
                <ICButton
                  type="button"
                  children={t("verify_and_continue")}
                  className={`uppercase !w-full ${
                    otpValue.length !== 4
                      ? "cursor-not-allowed comman-disablebtn"
                      : "comman-btn"
                  }`}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={handleOtpVerify}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserAltMobileVerify;
