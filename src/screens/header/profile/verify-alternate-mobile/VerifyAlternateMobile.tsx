import { useState } from "react";
import { verifyAlterativeOtp } from "./VerifyAlternateMobileController";
import UseTranslationHook from "../../../../hooks/UseTranslationHook";
import ICOtpInput from "../../../../core-component/ICOtpInput";
import ICButton from "../../../../core-component/ICButton";
import { editIcon } from "../../../../assets/icons/SvgIconList";
import { sweetAlertSuccess } from "../../../../utils/AppFunctions";
import Timer from "../../../../core-component/ICTimer";
import { IAlternateMobileNumber } from "../alternate-mobile/AlternateMobileController";

interface IAltMobileVerifyProps {
  alternateMobileNumber: string;
  relationId: number;
  selectedRelation: string;
  onEditClick: () => void;
  onClose: () => void;
  onResendOtp: (values: IAlternateMobileNumber) => Promise<void>;
}

const AltMobileVerify: React.FC<IAltMobileVerifyProps> = ({
  alternateMobileNumber,
  relationId,
  selectedRelation,
  onEditClick,
  onClose,
  onResendOtp,
}) => {
  const { t } = UseTranslationHook();
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (otp: string) => {
    setOtpValue(otp);
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    const payload = {
      otp: otpValue,
      alternate_phone: alternateMobileNumber,
      relation_id: relationId,
    };

    const alterativeOtpVerify = await verifyAlterativeOtp(payload, t);
    if (alterativeOtpVerify) {
      onClose();
      sweetAlertSuccess(t("otp_verify_successfully"));
    }
    setLoading(false);
  };

  const ResendOTP = async () => {
    const payload = {
      alternate_phone: alternateMobileNumber,
      relation_id: relationId,
    };
    await onResendOtp(payload);
  };

  return (
    <>
      <div className="text-center mt-5">
        <p className="!font-bold comman-black-big !text-3xl">
          {t("alternate_otp_verification")}
        </p>
        <p className="comman-grey">{t("opt_mobile_number")}</p>
      </div>
      <div className="flex mt-3 items-center justify-center text-center comman-black-text">
        <p>{selectedRelation} :</p>
        <p className="mx-3">+91 {alternateMobileNumber}</p>
        <p className="cursor w-6 h-6" onClick={onEditClick}>
          {editIcon}
        </p>
      </div>

      <form className="mt-5">
        <div className="relative mb-6 flex items-center justify-center">
          <ICOtpInput
            value={otpValue}
            onChange={handleOtpChange}
            numInputs={4}
          />
        </div>
        <div className="flex justify-center">
          <Timer initialTime="0:30" maxResends={3} onResend={ResendOTP} />
        </div>
        <div className="mt-8 flex items-center justify-between"></div>
        <div className="text-center lg:text-left">
          <ICButton
            type="button"
            children={t("verify_and_continue")}
            className={`uppercase !w-full ${
              otpValue.length !== 4
                ? "cursor-not-allowed comman-disablebtn"
                : "comman-btn"
            }`}
            disabled={otpValue.length !== 4}
            onClick={handleOtpVerify}
            loading={loading}
          />
        </div>
      </form>
    </>
  );
};

export default AltMobileVerify;
