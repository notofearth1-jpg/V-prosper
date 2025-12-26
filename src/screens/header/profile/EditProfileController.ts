import {
  decryptData,
  sweetAlertError,
  sweetAlertSuccess,
} from "./../../../utils/AppFunctions";
import { NavigateFunction } from "react-router-dom";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  prepareMessageFromParams,
  toastError,
} from "../../../utils/AppFunctions";
import * as Yup from "yup";
import {
  ADD_USER_INFORMATION,
  DELETE_USER,
  GET_ALL_USER_INFO,
  GET_TRAINER_DETAILS_BY_ID,
  GET_USER_THEME,
  SWITCH_PROFILE,
  UPDATE_INFO,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { userRoute } from "../../../routes/RouteUser";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { getProfileMenuItems } from "./PmiController";

export interface ITrainerApplication {
  application_status: number;
  id: number;
  application_content: { framework_consent: boolean };
}

export interface IEditUser {
  full_name: string;
  email: string;
  blood_group: string;
  gender_title: string;
  gender_id: number;
  dob: string;
  languages: number[];
  app_user: {
    username: string;
    pp: {
      media_url: string;
    };
  };
  app_media: [
    {
      media_url: string;
    }
  ];
  alternate_phone: string;
  relation_id: number;
  relation_title: string;
}

export interface IUserField {
  type: string;
  value: string | number | number[];
}

export interface IThemeConfiguration {
  main_bg_color: string;
  link_color: string;
  placeholder_color: string;
  description_font_color: string;
  icon_solid_color: string;
  title_color: string;
  box_bg_color: string;
  [key: string]: string;
}

export interface IGroupConfiguration {
  group_id: number;
  group_title: string;
  preferred_theme: string;
  theme_configuration: IThemeConfiguration;
}

export const editValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    full_name: Yup.string().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("full_name")],
      ])
    ),
    email: Yup.string()
      .email(t("invalid_email_format"))
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("email")],
        ])
      ),
    // blood_group: Yup.string().required(
    //   prepareMessageFromParams(t("error_message_required"), [
    //     ["fieldName", t("blood_group")],
    //   ])
    // ),
    languages: Yup.array()
      .of(Yup.string())
      .min(
        1,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("languages")],
          ["min", "1"],
        ])
      ),
  });

export const getUserData = async (
  userData: TReactSetState<IEditUser | undefined>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const useInfoList = await GET_ALL_USER_INFO();

    if (useInfoList && useInfoList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      userData(JSON.parse(decryptData(useInfoList.data)));
    } else {
      toastError(useInfoList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.useInfoList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const submitEditUser = async (
  userData: IUserField[],
  navigation: NavigateFunction,
  t: TUseTranslationTfn
) => {
  try {
    const resultUpdateInfo = await UPDATE_INFO(userData);
    if (
      resultUpdateInfo &&
      resultUpdateInfo.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      navigation(userRoute.home);
    } else {
      toastError(resultUpdateInfo.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultUpdateInfo?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const fetchTrainerStatusDetails = async (
  setTrainerDetails: TReactSetState<ITrainerApplication | undefined>,
  userId: number,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const trainerDetails = await GET_TRAINER_DETAILS_BY_ID(userId);
    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setTrainerDetails(JSON.parse(decryptData(trainerDetails.data)));
    } else {
      toastError(trainerDetails.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    if (error.response && error.response.status) {
      toastError(`${error.response.status} - ${error.response.data.message}`);
    }
  } finally {
    setLoading(false);
  }
};

export const SwitchProfile = async (
  navigation: NavigateFunction,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const resultSwitchProfile = await SWITCH_PROFILE();

    if (
      resultSwitchProfile &&
      resultSwitchProfile.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (resultSwitchProfile.data.role === "Customer") {
        navigation(userRoute.home);
      } else {
        navigation(routeTrainer.trainerHome);
      }
      localStorageUtils.setAccessToken(resultSwitchProfile?.data.token);
      localStorageUtils.setProfileUrl(
        resultSwitchProfile.data.user_profile?.profile_url
      );
      localStorageUtils.setAlternateProfileUrl(
        resultSwitchProfile?.data?.alternate_user_profile.profile_url
      );
      localStorageUtils.setAlternateProfileName(
        resultSwitchProfile?.data?.alternate_user_profile.profile_name
      );
      localStorageUtils.setUserId(resultSwitchProfile?.data?.user_id);
      localStorageUtils.setRole(
        resultSwitchProfile?.data?.user_profile?.role_id
      );
      localStorageUtils.removeTheme();
      setTimeout(() => {
        getProfileMenuItems();
      }, 500);
    } else {
      toastError(resultSwitchProfile.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultSwitchProfile?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const fetchUserTheme = async (
  setServicesList: TReactSetState<IGroupConfiguration[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const themeList = await GET_USER_THEME();
    if (themeList && themeList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesList(themeList.data);
      localStorageUtils.setTheme(JSON.stringify(themeList.data));
    } else {
      toastError(themeList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const deleteUser = async (
  setLoading: TReactSetState<boolean>,
  navigation: NavigateFunction
) => {
  try {
    setLoading(true);
    const deleteUser = await DELETE_USER();
    if (deleteUser && deleteUser.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(deleteUser.message);
      localStorage.clear();
      navigation("/");
    } else {
      sweetAlertError(deleteUser.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
