import { NavigateFunction } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import {
  prepareMessageFromParams,
  toastError,
  toastSuccess,
} from "../../../utils/AppFunctions";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import * as Yup from "yup";
import {
  ADD_USER_INFORMATION,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
export interface IGenderUser {
  type: string;
  value: number;
}

export const genderValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    type: Yup.string()
      .oneOf(["gender"])
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("type")],
        ])
      ),
    value: Yup.number().test(
      "is-not-zero",
      t("please_select_gender"),
      (value) => value !== 0
    ),
  });

export const submitUserGender = async (
  userData: IGenderUser,
  navigation: NavigateFunction,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  isPrvious: Boolean = false
) => {
  try {
    const resultGender = await ADD_USER_INFORMATION([userData]);

    if (resultGender && resultGender.code === 200) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 1)
        : setCurrentIndex((prevIndex) => prevIndex + 1);

      localStorageUtils.setUserType(userData.type);
      localStorageUtils.setUserValue(userData.value.toString());
    } else {
      toastSuccess(resultGender.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastSuccess(
      error?.resultGender?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const fetchUserGender = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "gender_identity",
      data_value: "id",
      display_value: "gender_title",
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
