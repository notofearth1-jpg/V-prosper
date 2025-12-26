import { NavigateFunction } from "react-router-dom";
import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { decryptData, toastError } from "../../utils/AppFunctions";

import {
  GET_TRAINER_INFO,
  UPDATE_TRAINER_INFO,
} from "../../services/Endpoints";
import { ITrainerField } from "../../services/user/UserServices";
import { routeTrainer } from "../../routes/RouteTrainer";

export interface IEditTrainer {
  full_name: string;
  email: string;
  blood_group: string;
  gender_title: string;
  gender_id: number;
  languages: number[];
  app_user: {
    username: string;
    pp: {
      media_url: string;
    };
  };

  alternate_phone: number;
  has_own_session_space: string;
  has_space_for_rent: string;
  is_marketing_partner: string;
  headline: string;
  bio: string;
}

export const getInitialValuesTrainer = (userData: IEditTrainer | undefined) => {
  return {
    full_name: userData?.full_name || "",
    email: userData?.email || "",
    blood_group: userData?.blood_group || "",
    gender_title: userData?.gender_title || "",
    gender_id: userData?.gender_id || "",
    languages: userData?.languages || [],
    app_media: {
      media_url: userData?.app_user?.pp?.media_url || "",
    },
    has_own_session_space: userData?.has_own_session_space || "",
    has_space_for_rent: userData?.has_space_for_rent || "",
    is_marketing_partner: userData?.is_marketing_partner || "",
    headline: userData?.headline || "",
    bio: userData?.bio || "",
  };
};

export const submitEditTrainer = async (
  userData: ITrainerField[],
  navigation: NavigateFunction,
  t: TUseTranslationTfn
) => {
  try {
    const resultUpdateInfo = await UPDATE_TRAINER_INFO(userData);
    if (
      resultUpdateInfo &&
      resultUpdateInfo.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      navigation(routeTrainer.trainerHome);
    } else {
      toastError(resultUpdateInfo.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultUpdateInfo?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const getTrainerData = async (
  userData: TReactSetState<IEditTrainer | undefined>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const useInfoList = await GET_TRAINER_INFO();

    if (useInfoList && useInfoList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const parsedUserData = JSON.parse(decryptData(useInfoList.data));
      userData(parsedUserData);
    } else {
      toastError(useInfoList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.useInfoList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
