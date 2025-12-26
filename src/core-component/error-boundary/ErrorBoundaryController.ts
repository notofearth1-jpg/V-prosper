import { LOG_ERROR_PT, LOG_ERROR } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";
import { localStorageUtils } from "../../utils/LocalStorageUtil";

export const logApplicationError = async (payload: any) => {
  try {
    let resultErrorToken;
    const getLocalStorage = await localStorageUtils.getAccessToken();
    if (getLocalStorage) {
      resultErrorToken = await LOG_ERROR(payload);
    } else {
      resultErrorToken = await LOG_ERROR_PT(payload);
    }
    if (
      resultErrorToken &&
      resultErrorToken.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      return;
    } else {
      toastError(resultErrorToken.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultErrorToken?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
