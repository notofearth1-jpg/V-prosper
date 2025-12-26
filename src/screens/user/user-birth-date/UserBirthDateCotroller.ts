import { NavigateFunction } from "react-router";
import { toastError } from "../../../utils/AppFunctions";
import { ADD_USER_INFORMATION } from "../../../services/Endpoints";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export interface IBirthDate {
  type: string;
  value: string;
}

export const submitUserBirthDate = async (
  userData: IBirthDate,
  navigation: NavigateFunction,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  isPrvious: Boolean = false
) => {
  try {
    const resultBirthDate = await ADD_USER_INFORMATION([userData]);

    if (
      resultBirthDate &&
      resultBirthDate.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 1)
        : setCurrentIndex((prevIndex) => prevIndex + 1);

      localStorageUtils.setUserBirthDayType(userData.type);
      localStorageUtils.setUserBirthDayValue(userData.value);
    } else {
      toastError(resultBirthDate.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultBirthDate?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
