import * as Yup from "yup";
import {
  prepareMessageFromParams,
  sweetAlertError,
  toastError,
} from "../../../../utils/AppFunctions";
import { TUseTranslationTfn } from "../../../../data/AppType";
import { ADD_USER_INFORMATION } from "../../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../../utils/AppConstants";
import { ALTERNATE_OTP } from "../../../../services/user/UserServices";

export interface IAlternateMobileNumber {
  alternate_phone: string;
  relation_id?: number | null;
}

export const initialValues = (values: IAlternateMobileNumber) => {
  return {
    alternate_phone: values.alternate_phone || "",
    relation_id: values.relation_id || "",
  };
};

export const validationSchemaAlternativeMobileNumber = (
  t: TUseTranslationTfn
) =>
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
  userData: IAlternateMobileNumber
) => {
  try {
    const alternateMobileInfo = await ALTERNATE_OTP({
      alternate_phone: userData.alternate_phone.toString(),
    });

    if (
      alternateMobileInfo &&
      alternateMobileInfo.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      return true;
    } else {
      sweetAlertError(
        alternateMobileInfo.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
      return false;
    }
  } catch (error: any) {
    toastError(error?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  }
};
