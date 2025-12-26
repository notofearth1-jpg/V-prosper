import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import * as Yup from "yup";
import {
  decryptData,
  prepareMessageFromParams,
  toastError,
  toastSuccess,
} from "../../utils/AppFunctions";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  GET_SYSTEM_CONFIGURATION_BY_KEY,
  GET_TRAINER_BANK_INFO_BY_TRAINER_ID,
  SAVE_TRAINER_BANK_INFO,
  UPDATE_TRAINER_BANK_INFO,
} from "../../services/Endpoints";
import { NavigateFunction } from "react-router-dom";
import { SYSTEM_CONFIGURATION_KEYS } from "../../utils/AppEnumerations";

export interface IBankInfo {
  id: number;
  beneficiary_name: string;
  beneficiary_account_number: string;
  ifsc_code: string;
  pan_number: string;
}

export interface ISystemConfig {
  config_value: string;
  user_friendly_name: string;
}

export const getBankInfoInitialValues = (bankInfo: IBankInfo | null) => {
  return {
    beneficiary_name: bankInfo?.beneficiary_name || "",
    beneficiary_account_number: bankInfo?.beneficiary_account_number || "",
    re_type_beneficiary_account_number: "",
    ifsc_code: bankInfo?.ifsc_code || "",
    pan_number: bankInfo?.pan_number || "",
    re_type_pan_number: "",
  };
};

export const bankInfoValidationSchema = (t: TUseTranslationTfn) => {
  return Yup.object().shape({
    beneficiary_name: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("beneficiary_name")],
        ])
      )
      .max(
        250,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("beneficiary_name")],
          ["max", "250"],
        ])
      ),
    beneficiary_account_number: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("beneficiary_account_number")],
        ])
      )
      .min(
        9,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("beneficiary_account_number")],
          ["min", "9"],
        ])
      )
      .max(
        18,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("beneficiary_account_number")],
          ["max", "18"],
        ])
      ),
    re_type_beneficiary_account_number: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("re_type_beneficiary_account_number")],
        ])
      )
      .oneOf(
        [Yup.ref("beneficiary_account_number")],
        t("beneficiary_account_number_must_match")
      ),
    ifsc_code: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("ifsc_code")],
        ])
      )
      .min(11, t("min_max_ifsc_code"))
      .max(11, t("min_max_ifsc_code")),
    pan_number: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("pan_number")],
        ])
      )
      .min(
        10,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("pan_number")],
          ["min", "10"],
        ])
      )
      .max(
        10,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("pan_number")],
          ["max", "10"],
        ])
      )
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, t("invalid_pan_number_message")),
    re_type_pan_number: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("re_type_pan_number")],
        ])
      )
      .oneOf([Yup.ref("pan_number")], t("pan_number_must_match")),
  });
};

export const fetchTrainerBankInfo = async (
  setBankInfo: TReactSetState<IBankInfo | null>
) => {
  try {
    const userId = localStorageUtils.getUserId();
    if (!userId) {
      return;
    }

    const resBankInfo = await GET_TRAINER_BANK_INFO_BY_TRAINER_ID(
      Number(userId)
    );
    if (resBankInfo && resBankInfo.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const bankData = JSON.parse(decryptData(resBankInfo.data));
      setBankInfo(bankData);
    }
  } catch (e) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const handleSubmitTrainerBankInfo = async (
  values: Omit<IBankInfo, "id">,
  trianerBankInfoId: number | null,
  navigate: NavigateFunction
) => {
  try {
    let resBankInfo = null;
    if (trianerBankInfoId) {
      resBankInfo = await UPDATE_TRAINER_BANK_INFO(values, trianerBankInfoId);
    } else {
      const userId = localStorageUtils.getUserId();
      if (!userId) {
        return;
      }
      resBankInfo = await SAVE_TRAINER_BANK_INFO(values, Number(userId));
    }

    if (resBankInfo && resBankInfo.code === DEFAULT_STATUS_CODE_SUCCESS) {
      toastSuccess(resBankInfo.message);
      navigate(-1);
    } else {
      toastError(resBankInfo.message);
    }
  } catch (e) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchPanNote = async (
  setPanNoteValue: TReactSetState<ISystemConfig | undefined>
) => {
  try {
    const panNote = await GET_SYSTEM_CONFIGURATION_BY_KEY(
      SYSTEM_CONFIGURATION_KEYS.PanNote
    );
    if (panNote && panNote.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setPanNoteValue(panNote.data);
    } else {
      toastError(panNote.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
