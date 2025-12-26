import { NavigateFunction } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import { toastError } from "../../../utils/AppFunctions";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_USER_INFORMATION,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
export interface IUserInterest {
  type: string;
  value: number[];
}
export const submitUserInterests = async (
  userData: IUserInterest[],
  navigation: NavigateFunction,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  isPrvious: Boolean = false
) => {
  try {
    const resultInterest = await ADD_USER_INFORMATION(userData);
    if (resultInterest && resultInterest.code === DEFAULT_STATUS_CODE_SUCCESS) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 1)
        : setCurrentIndex((prevIndex) => prevIndex + 1);

      const interestsValues = userData.map((item) => item.value).flat();
      localStorageUtils.setUserInterest(JSON.stringify(interestsValues));
    } else {
      toastError(resultInterest.message);
    }
  } catch (error) {
    toastError(t("error_during_login"));
  }
};

export const fetchUserInterestDdl = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "service_category",
      data_value: "id",
      display_value: "category_title",
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDdl?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
