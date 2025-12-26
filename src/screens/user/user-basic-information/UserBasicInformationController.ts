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

export interface IBasicInformation {
  full_name: string;
  email: string;
}

export const validationSchemaUserBasicInformation = (t: TUseTranslationTfn) =>
  Yup.object({
    full_name: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("full_name")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("full_name")],
          ["max", "50"],
        ])
      )
      .min(
        2,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("full_name")],
          ["min", "2"],
        ])
      ),
    email: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("email")],
        ])
      )
      .email(
        prepareMessageFromParams(t("invalid_email_format"), [
          ["fieldName", t("email")],
        ])
      ),
  });

export const submitBasicInfo = async (
  userData: IBasicInformation,
  setCurrentIndex: TReactSetState<number>
) => {
  try {
    const resultBasicInfo = await ADD_USER_INFORMATION([
      { type: "full_name", value: userData.full_name },
      {
        type: "email",
        value: userData.email,
      },
    ]);

    if (
      resultBasicInfo &&
      resultBasicInfo.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      localStorageUtils.setEmail(userData.email);
      localStorageUtils.setUserFullName(userData.full_name);
    } else {
      toastError(resultBasicInfo.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultNumber?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
