import { TReactSetState } from "../../../data/AppType";
import { GET_SYSTEM_CONFIGURATION_BY_KEY } from "../../../services/Endpoints";
import { GET_PROFILE_MENU_ITEMS } from "../../../services/user/UserServices";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ISystemConfig } from "../../bank-info/BankInfoController";

export const getProfileMenuItems = async () => {
  try {
    const pmi = await GET_PROFILE_MENU_ITEMS();

    if (pmi && pmi.code === DEFAULT_STATUS_CODE_SUCCESS) {
      localStorageUtils.setPmi(pmi.data);
    } else {
      toastError(pmi.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const fetchSystemConfigValue = async (
  setSystemConfigValue: TReactSetState<ISystemConfig | undefined>,
  configKey: string
) => {
  try {
    const panNote = await GET_SYSTEM_CONFIGURATION_BY_KEY(configKey);
    if (panNote && panNote.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setSystemConfigValue(panNote.data);
    } else {
      toastError(panNote.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
