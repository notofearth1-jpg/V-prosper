import { TUseTranslationTfn } from "../../../../data/AppType";
import { VERIFY_ALTERNATE_OTP } from "../../../../services/auth/AuthServices";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../../utils/AppConstants";
import { sweetAlertError, toastError } from "../../../../utils/AppFunctions";

export interface IAlterativeOtpForm {
  username: string;
  otp: string;
}

export interface IVerifyAlterativeOtp {
  otp: string;
  alternate_phone: string;
  relation_id: number;
}

export const initialValuesAlterativeOtp = {
  username: "",
  otp: "",
};

export const verifyAlterativeOtp = async (
  value: IVerifyAlterativeOtp,
  t: TUseTranslationTfn
) => {
  try {
    const payload = {
      otp: value.otp,
      alternate_phone: value.alternate_phone.toString(),
      relation_id: value.relation_id,
    };

    const verifyAlterativeOtp = await VERIFY_ALTERNATE_OTP(payload);

    if (
      verifyAlterativeOtp &&
      verifyAlterativeOtp.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      return true;
    } else {
      sweetAlertError(verifyAlterativeOtp.message || t("invalid_otp"));
      return false;
    }
  } catch (error: any) {
    toastError(error?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  }
};
