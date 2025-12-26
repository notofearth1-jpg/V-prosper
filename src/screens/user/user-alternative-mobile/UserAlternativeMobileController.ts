import { NavigateFunction } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import {
  prepareMessageFromParams,
  toastError,
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

export interface IAlternateMobileNumber {
  alternate_phone: string;
  relation_id: number;
}

export const validationSchemaUserAlternativeNumber = (t: TUseTranslationTfn) =>
  Yup.object({
    alternate_phone: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("alternate_phone")],
        ])
      )

      .min(
        10,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("alternate_phone")],
          ["min", "10"],
        ])
      )
      .max(
        10,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("alternate_phone")],
          ["max", "10"],
        ])
      ),
    relation_id: Yup.number().required(t("select_relation_error")),
  });

export const submitAlternativeUserInfo = async (
  userData: IAlternateMobileNumber,
  navigation: NavigateFunction,
  setCurrentIndex: TReactSetState<number>,
  isPrvious: Boolean = false
) => {
  try {
    const resultNumber = await ADD_USER_INFORMATION([
      {
        type: "alternate",
        value: {
          alternate_phone: userData.alternate_phone.toString(),
          relation_id: userData.relation_id,
          is_alternate: true,
        },
      },
    ]);

    // const isAlternateVerify = localStorageUtils.getIsAlternateMobileVerify();

    if (resultNumber && resultNumber.code === DEFAULT_STATUS_CODE_SUCCESS) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 1)
        : // isAlternateVerify == "true"
          // ? setCurrentIndex((prevIndex) => prevIndex + 2)
          setCurrentIndex((prevIndex) => prevIndex + 2);

      localStorageUtils.setAlternatePhone(userData.alternate_phone);
      localStorageUtils.setUserRelation(userData.relation_id.toString());
    } else {
      toastError(resultNumber.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultNumber?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const getUserRelation = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "relations",
      data_value: "id",
      display_value: "relation_title",
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
