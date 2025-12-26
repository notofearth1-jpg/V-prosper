import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import {
  ADD_PREFERRED_LOCATION,
  DELETE_PREFERRED_LOCATION,
  GET_ALL_PREFERRED_LOCATIONS,
  GET_DEFAULT_LOCATION,
  GET_REMAINING_PREFERRED_LOCATIONS,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { IS_DEFAULT } from "../../utils/AppEnumerations";
import {
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
  toastSuccess,
} from "../../utils/AppFunctions";

export interface ITrainerPreferredLocations {
  id: number;
  location_id: number;
  location_name: string;
  is_default: string;
}
export interface ITrainerRemainingLocations {
  id: number;
  city_name: string;
}

export interface ITrainerLocationsValue {
  location_ids: number[];
  DL?: number;
}

export const initialValuesLocation = {
  value: [],
};

export const fetchTrainerPreferredLocationsApi = async (
  setLocationList: TReactSetState<ITrainerPreferredLocations[]>,
  setSelectedLocationValue: TReactSetState<number | undefined>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const locationList = await GET_ALL_PREFERRED_LOCATIONS();
    if (locationList && locationList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      locationList.data.forEach((item: ITrainerPreferredLocations) => {
        if (item.is_default === IS_DEFAULT.Yes) {
          setSelectedLocationValue(item.location_id);
        }
      });
      setLocationList(locationList.data);
    } else {
      toastError(locationList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchRemainingTrainerPreferredLocationsApi = async (
  setRemainingLocationList: TReactSetState<ITrainerRemainingLocations[]>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const remainingLocationList = await GET_REMAINING_PREFERRED_LOCATIONS();
    if (
      remainingLocationList &&
      remainingLocationList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setRemainingLocationList(remainingLocationList.data);
    } else {
      toastError(
        remainingLocationList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const addTrainerPreferredLocationApi = async (
  setLoading: TReactSetState<boolean>,
  value: ITrainerLocationsValue,
  isDefaultLocationChange: boolean,
  t: TUseTranslationTfn
) => {
  setLoading(true);
  try {
    const addTrainerPreferredLocation = await ADD_PREFERRED_LOCATION(value);
    if (
      addTrainerPreferredLocation &&
      addTrainerPreferredLocation.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      isDefaultLocationChange
        ? toastSuccess(t("default_location_change"))
        : sweetAlertSuccess(addTrainerPreferredLocation.message);
    } else {
      sweetAlertError(addTrainerPreferredLocation.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const deleteTrainerPreferredLocationApi = async (
  setLoading: TReactSetState<boolean>,
  id: number
) => {
  setLoading(true);
  try {
    const deleteTrainerPreferredLocation = await DELETE_PREFERRED_LOCATION(id);
    if (
      deleteTrainerPreferredLocation &&
      deleteTrainerPreferredLocation.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(deleteTrainerPreferredLocation.message);
    } else {
      sweetAlertError(deleteTrainerPreferredLocation.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchTrainerDefaultLocationsApi = async (
  setDefaultLocation: TReactSetState<ITrainerPreferredLocations | null>
) => {
  try {
    const defaultLocation = await GET_DEFAULT_LOCATION();
    if (
      defaultLocation &&
      defaultLocation.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setDefaultLocation(defaultLocation.data);
    } else {
      setDefaultLocation(null);
      toastError(defaultLocation.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
