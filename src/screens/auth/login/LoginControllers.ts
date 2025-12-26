import * as Yup from "yup";
import {
  IS_ALLOW_APPLE_SIGN_IN,
  IS_ALLOW_FACEBOOK_SIGN_IN,
  IS_ALLOW_GOOGLE_SIGN_IN,
  LOGIN,
} from "../../../services/Endpoints";
import {
  prepareMessageFromParams,
  toastError,
  toastSuccess,
} from "../../../utils/AppFunctions";
import { NavigateFunction } from "react-router-dom";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { logApplicationError } from "../../../core-component/error-boundary/ErrorBoundaryController";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { fireBaseAuth } from "../../../utils/firebaseNotification";
import { RESEND_OTP } from "../../../services/auth/AuthServices";
export interface ILoginForm {
  username?: number;
}

export interface ISocialSignIn {
  facebookIs?: string;
  googleIs?: string;
  appleIs?: string;
}
export const validationSchemaLogin = (t: TUseTranslationTfn) =>
  Yup.object({
    username: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("mobile_number")],
        ])
      )
      .length(
        10,
        prepareMessageFromParams(t("error_message_max_digits"), [
          ["fieldName", t("mobile_number")],
          ["max", "10"],
        ])
      ),
  });

export const initialValuesLogin = {
  username: undefined,
};

export const signInWithGoogle = async (navigation: NavigateFunction) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(fireBaseAuth, provider);
    const accessToken = (await result.user.getIdTokenResult()).token;
    // navigation(userRoute.home);
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(fireBaseAuth, provider);
    const accessToken = (await result.user.getIdTokenResult()).token;
  } catch (error) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const signInWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  try {
    const result = await signInWithPopup(fireBaseAuth, provider);
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const checkGoogleSignIn = async (
  setIsSocialSignIn: TReactSetState<ISocialSignIn | undefined>
) => {
  try {
    const allowGoogle = await IS_ALLOW_GOOGLE_SIGN_IN();
    if (allowGoogle && allowGoogle.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const { config_value, user_friendly_name } = allowGoogle.data;

      if (config_value)
        setIsSocialSignIn((prev) => ({ ...prev, googleIs: config_value }));
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const checkFacebookSignIn = async (
  setIsSocialSignIn: TReactSetState<ISocialSignIn | undefined>
) => {
  try {
    const allowFacebook = await IS_ALLOW_FACEBOOK_SIGN_IN();
    if (allowFacebook && allowFacebook.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const { config_value } = allowFacebook.data;
      if (config_value)
        setIsSocialSignIn((prev) => ({
          ...prev,
          facebookIs: config_value,
        }));
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const checkAppleSignIn = async (
  setIsSocialSignIn: TReactSetState<ISocialSignIn | undefined>
) => {
  try {
    const allowApple = await IS_ALLOW_APPLE_SIGN_IN();
    if (allowApple && allowApple.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const { config_value } = allowApple.data;
      if (config_value)
        setIsSocialSignIn((prev) => ({
          ...prev,
          appleIs: config_value,
        }));
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const loginApi = async (
  values: ILoginForm,
  navigation: NavigateFunction,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const { username } = values;
    const payload = { username: JSON.stringify(username) };
    const resultLogin = await LOGIN(payload);

    if (resultLogin && resultLogin.code === DEFAULT_STATUS_CODE_SUCCESS) {
      toastSuccess(resultLogin.message);
      navigation("/verifyOTP", { state: { username } });
    } else {
      toastError(resultLogin.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    logApplicationError(error);
    toastError(error?.resultLogin.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const resendOTP = async (
  values: ILoginForm,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const { username } = values;
    const payload = { username: JSON.stringify(username) };
    const resultLogin = await RESEND_OTP(payload);

    if (resultLogin && resultLogin.code === DEFAULT_STATUS_CODE_SUCCESS) {
      toastSuccess(resultLogin.message);
    } else {
      toastError(resultLogin.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    logApplicationError(error);
    toastError(error?.resultLogin.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
