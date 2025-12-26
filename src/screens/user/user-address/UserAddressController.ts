import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  prepareMessageFromParams,
  toastError,
} from "../../../utils/AppFunctions";
import { IDDL, IDDLCities } from "../../../data/AppInterface";
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
import { GET_LOCATION } from "../../../services/user/UserServices";

export interface ILocationType {
  country: string;
  country_code: string;
  county: string;
  postcode: string;
  state: string;
  state_district: string;
  suburb: string;
  village: string;
}

export interface IDefultLocation {
  address_line_1: string;
  address_line_2: string;
  postcode: string;
}

export interface ILocationLatLong {
  latitude: number;
  longitude: number;
}

export interface IUserAddress {
  type: string;
  value: {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string | undefined;
    postcode: string;
    city: string;
    state_id: number | null;
    country_id: number;
    address_label: string;
    latitude: number | undefined;
    longitude: number | undefined;
  };
}

export const addressValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    value: Yup.object({
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

      state_id: Yup.number().required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("state")],
        ])
      ),
    }),
  });

export const fetchLocation = async (
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;

    const payload = {
      latitude,
      longitude,
    };

    const getLocation = await GET_LOCATION(payload);

    if (getLocation && getLocation.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return getLocation.data;
    } else {
      toastError(getLocation.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      return null;
    }
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

export const submitUserAddressInfo = async (
  userData: IUserAddress,
  setCurrentIndex: TReactSetState<number>,
  isPrvious: Boolean = false
) => {
  try {
    const resultAddress = await ADD_USER_INFORMATION([userData]);
    if (resultAddress && resultAddress.code === DEFAULT_STATUS_CODE_SUCCESS) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 2)
        : setCurrentIndex((prevIndex) => prevIndex + 1);

      localStorageUtils.setUserAddressLine1(userData.value.address_line_1);
      localStorageUtils.setUserAddressLine2(userData.value.address_line_2);
      localStorageUtils.setUserAddressLine3(
        userData.value.address_line_3 as string
      );
      localStorageUtils.setUserCity(userData.value.city);
      localStorageUtils.setAddressLabel(userData.value.address_label);

      if (
        userData.value.state_id !== null &&
        userData.value.state_id !== undefined
      ) {
        localStorageUtils.setUserStateId(userData.value.state_id.toString());
      }
      localStorageUtils.setUserPostCode(userData.value.postcode);
    } else {
      toastError(resultAddress.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultAddress?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchUserStates = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "states",
      data_value: "id",
      display_value: "state_name",
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
      return resultDdl.data;
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDdl?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchUserCites = async (
  setCitesData: TReactSetState<IDDLCities[]>,
  stateId: number
) => {
  try {
    setCitesData([]);

    const payload = {
      entity: "cities",
      data_value: "city_name",
      display_value: "city_name",
      filters: [
        {
          field: "state_id",
          value: stateId,
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCitesData(resultDdl.data);
      return resultDdl.data;
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDdl?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const addressType = [
  { data_value: "Home", display_value: "Home" },
  { data_value: "Work", display_value: "Work" },
  { data_value: "Other", display_value: "Other" },
];
