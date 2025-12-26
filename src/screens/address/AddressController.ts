import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { ADD_ADDRESS } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  prepareMessageFromParams,
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
} from "../../utils/AppFunctions";
import * as Yup from "yup";

export interface IAddressModel {
  id?: number;
  postcode: string;
  state_id: number;
  country_id: number;
  latitude?: number | null;
  longitude?: number | null;
}

export const addressModelValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    postcode: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("postcode")],
        ])
      )
      .max(
        6,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("postcode")],
          ["max", "6"],
        ])
      )
      .min(
        6,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("postcode")],
          ["min", "6"],
        ])
      ),
    state_id: Yup.number().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("state")],
      ])
    ),
  });

export const addUserAddress = async (
  addressDetails: IAddressModel,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const address = await ADD_ADDRESS(addressDetails);

    if (address && address.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(address.message);
    } else {
      sweetAlertError(address.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
