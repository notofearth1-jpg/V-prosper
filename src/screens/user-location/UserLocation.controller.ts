import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { ADD_USER_ADDRESS, GET_ALL_ADDRESS } from "../../services/Endpoints";
import {
  CHANGE_USER_DEFULT_ADDRESS,
  DELETE_USER_ADDRESS,
  GET_ADDRESS_BY_ID,
  GET_GEOCODE,
  GET_USER_DEFULT_ADDRESS,
  UPDATE_USER_ADDRESS,
} from "../../services/user/UserServices";
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

export interface IAddress {
  id?: number;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  city: string;
  state_name?: string;
  country_name?: string;
  postcode: string;
  address_label: string;
  is_default?: string;
  state_id: number;
  country_id: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface IGeocode {
  address: string;
}

interface Location {
  lat: number;
  lng: number;
}

export const getGeocode = async (address: string): Promise<Location | null> => {
  try {
    const geoCode = await GET_GEOCODE(address);
    if (geoCode && geoCode.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return geoCode.data;
    } else {
      sweetAlertError(geoCode.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      return null;
    }
  } catch (error: any) {
    toastError(error.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return null;
  }
};

export const userAddressValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    address_line_1: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("address_line_1")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("address_line_1")],
          ["max", "50"],
        ])
      )
      .min(
        2,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("address_line_1")],
          ["min", "2"],
        ])
      ),

    address_line_2: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("address_line_2")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("address_line_2")],
          ["max", "50"],
        ])
      )
      .min(
        2,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("address_line_2")],
          ["min", "2"],
        ])
      ),
    address_line_3: Yup.string().max(
      50,
      prepareMessageFromParams(t("error_message_max_length"), [
        ["fieldName", t("address_line_3")],
        ["max", "50"],
      ])
    ),

    city: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("city")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("city")],
          ["max", "50"],
        ])
      )
      .min(
        2,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("city")],
          ["min", "2"],
        ])
      ),

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

    address_label: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("address_label")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("address_label")],
          ["max", "50"],
        ])
      )
      .min(
        2,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("address_label")],
          ["min", "2"],
        ])
      ),

    state_id: Yup.number().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("state")],
      ])
    ),
  });

export const fetchUserAddress = async (
  setAddressList: TReactSetState<IAddress[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const addressList = await GET_ALL_ADDRESS();

    if (addressList && addressList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setAddressList(addressList.data);
    } else {
      toastError(addressList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchUserAddressById = async (
  setAddressData: TReactSetState<IAddress | null>,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await GET_ADDRESS_BY_ID(id);

    if (address && address.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setAddressData(address.data);
    } else {
      toastError(address.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const addUserAddress = async (
  addressDetails: IAddress,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await ADD_USER_ADDRESS(addressDetails);

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

export const updateUserAddress = async (
  addressDetails: IAddress,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await UPDATE_USER_ADDRESS(addressDetails, id);

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

export const deleteUserAddress = async (
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await DELETE_USER_ADDRESS(id);

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

export const changeDefaultUserAddress = async (
  addressDetails: { id: number },
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await CHANGE_USER_DEFULT_ADDRESS(addressDetails);

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

export const fetchUserDefultAddress = async (
  setAddressData: TReactSetState<IAddress | null>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const address = await GET_USER_DEFULT_ADDRESS();

    if (address && address.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setAddressData(address.data);
    } else {
      toastError(address.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
