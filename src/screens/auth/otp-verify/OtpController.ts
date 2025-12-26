import { NavigateFunction } from "react-router-dom";
import {
  decryptData,
  toastError,
  toastSuccess,
} from "../../../utils/AppFunctions";
import {
  TOnChangeInput,
  TReactSetState,
  TUseTranslationTfn,
} from "../../../data/AppType";
import { VERIFY_OTP } from "../../../services/auth/AuthServices";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { logApplicationError } from "../../../core-component/error-boundary/ErrorBoundaryController";
import { publicRoute } from "../../../routes/RoutePublic";
import { userRoute } from "../../../routes/RouteUser";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { USER_ROLE, USER_STATUS } from "../../../utils/AppEnumerations";
import { getProfileMenuItems } from "../../header/profile/PmiController";

export interface IOtpVerifyViewProps {
  handleSubmit: (status: boolean) => void;
}

export interface IOtpForm {
  username: string;
  otp: string;
}

export const initialValuesOtp = {
  username: "",
  otp: "",
};

export const handleInputChange = (
  event: TOnChangeInput,
  index: number,
  inputRefs: React.RefObject<HTMLInputElement>[],
  setError: TReactSetState<string>,
  handleSubmit: (status: boolean) => void,
  t: TUseTranslationTfn
) => {
  const input = event.target;
  const value = input.value;

  if (value.length >= 1) {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  }

  const otpValues = inputRefs.map((inputRef) => inputRef.current?.value || "");

  if (otpValues.join("").length === 6) {
    setError("");

    if (otpValues.join("") == "123456") {
      handleSubmit(true);
      toastSuccess(t("successfully_opt"));
    } else {
      toastError(t("invalid_otp"));
    }
  }
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>,
  index: number,
  inputRefs: React.RefObject<HTMLInputElement>[],
  t: TUseTranslationTfn
) => {
  if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
    inputRefs[index - 1].current?.focus();
  }
};

export const startTimer = (
  setCount: TReactSetState<number>,
  setIntervalNumber: TReactSetState<NodeJS.Timeout | undefined>
) => {
  const interval = setInterval(() => {
    setCount((prevCount) => prevCount - 1);
  }, 1000);
  setIntervalNumber(interval);
};

export const restCountDown = (
  setIsButtonVisible: TReactSetState<boolean>,
  setCount: TReactSetState<number>,
  setIntervalNumber: TReactSetState<NodeJS.Timeout | undefined>
) => {
  setIsButtonVisible(false);
  const intervals = setInterval(() => {
    setCount((prevCount) => prevCount - 1);
  }, 1000);
  setIntervalNumber(intervals);
};

export const handleVerifyController = (
  otpValues: string[],
  setError: TReactSetState<string>,
  navigate: NavigateFunction,
  handleSubmit: (status: boolean) => void,
  t: TUseTranslationTfn
) => {
  if (otpValues.join("").length === 6) {
    setError("");
  } else if (otpValues.join("").length === 0) {
    setError(t("otp_is_required"));
  } else if (otpValues.join("").length < 6) {
    setError(t("input_otp_digits"));
  }

  if (otpValues.join("") == "123456") {
    toastSuccess(t("successfully_opt"));
    handleSubmit(true);
  } else {
    toastError(t("invalid_otp"));
  }
};

export const submitOtpApi = async (
  values: IOtpForm,
  navigation: NavigateFunction,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  setLoading(true);
  try {
    const { username, otp } = values;
    const payload = {
      username: JSON.stringify(username),
      otp: otp,
    };

    const resultOtp = await VERIFY_OTP(payload);

    if (resultOtp && resultOtp.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const resultData = JSON.parse(decryptData(resultOtp.data));

      if (resultData.status === USER_STATUS.ProfileCompleted) {
        await localStorageUtils.setUserProfileStatus(resultData?.status);

        if (resultData.user_profile.role_id === USER_ROLE.Customer) {
          navigation(userRoute.home);
        } else if (resultData.user_profile.role_id === USER_ROLE.Trainer) {
          navigation(routeTrainer.trainerHome);
        } else {
          await localStorageUtils.setUserProfileStatus(resultData?.status);
          navigation("/" + publicRoute.userVerification);
        }
      } else {
        await localStorageUtils.setUserProfileStatus(resultData?.status);
        navigation("/" + publicRoute.userVerification);
      }

      await localStorageUtils.setAccessToken(resultData.token);
      await localStorageUtils.setRefreshToken(resultData.refresh_token);
      await localStorageUtils.setUserId(resultData.user_id);
      await localStorageUtils.setRole(resultData.user_profile?.role_id);
      localStorageUtils.setProfileUrl(resultData.user_profile.profile_url);
      localStorageUtils.setAlternateProfileUrl(
        resultData?.alternate_user_profile?.profile_url
      );
      localStorageUtils.setAlternateProfileName(
        resultData?.alternate_user_profile?.profile_name
      );
      localStorageUtils.setMultipleProfile(resultData?.has_multiple_profiles);

      setTimeout(() => {
        getProfileMenuItems();
      }, 500);
    } else {
      toastError(resultOtp.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    logApplicationError(error);
    toastError(error?.resultOtp?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
