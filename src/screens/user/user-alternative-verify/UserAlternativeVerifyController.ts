import { NavigateFunction } from "react-router-dom";
import { VERIFY_OTP } from "../../../services/auth/AuthServices";
import { toastError, toastSuccess } from "../../../utils/AppFunctions";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  DEFAULT_STATUS_CODE_UNKNOWN_ERROR,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export interface IAlterativeOtpForm {
  username: string;
  otp: string;
}

export const initialValuesAlterativeOtp = {
  username: "",
  otp: "",
};

export const submitAlterativeOtp = async (
  value: string,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn
) => {
  try {
    const payload = {
      otp: value,
    };

    const resultOtp = await VERIFY_OTP(payload);

    if (resultOtp && resultOtp.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      toastSuccess(t("otp_verify_successfully"));
      localStorageUtils.setIsAlternateMobileVerify("true");
    } else {
      toastError(resultOtp.message || t("invalid_otp"));
    }
  } catch (error: any) {
    toastError(error?.resultOtp.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
