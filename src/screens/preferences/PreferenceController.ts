import { ADD_USER_THEME } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError, toastSuccess } from "../../utils/AppFunctions";

export interface IUserTheme {
  preference_key: string;
  preference_value: string;
}

export const submitUserTheme = async (userTheme: IUserTheme) => {
  try {
    const resultUserTheme = await ADD_USER_THEME(userTheme);
    if (
      resultUserTheme &&
      resultUserTheme.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      toastSuccess(resultUserTheme.message);
    } else {
      toastError(resultUserTheme.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
