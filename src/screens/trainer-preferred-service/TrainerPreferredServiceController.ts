import { TReactSetState } from "../../data/AppType";
import {
  GET_ALL_PREFERRED_SERVICES,
  GET_REMAINING_PREFERRED_SERVICES,
  ADD_PREFERRED_SERVICE,
  DELETE_PREFERRED_SERVICE,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
} from "../../utils/AppFunctions";

export interface ITrainerService {
  id: number;
  service_category_id: number;
  category_title: string;
}
export interface ITrainerRemainingService {
  id: number;
  category_title: string;
}

export interface ITrainerServiceValue {
  serviceCategoryIds: number[];
}

export const fetchTrainerPreferredServicesApi = async (
  setServiceCategoryList: TReactSetState<ITrainerService[]>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const serviceCategoryList = await GET_ALL_PREFERRED_SERVICES();
    if (
      serviceCategoryList &&
      serviceCategoryList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setServiceCategoryList(serviceCategoryList.data);
    } else {
      toastError(serviceCategoryList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchRemainingServiceCategoryApi = async (
  setRemainingServiceList: TReactSetState<ITrainerRemainingService[]>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const remainingServiceCategoryList =
      await GET_REMAINING_PREFERRED_SERVICES();
    if (
      remainingServiceCategoryList &&
      remainingServiceCategoryList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setRemainingServiceList(remainingServiceCategoryList.data);
    } else {
      toastError(
        remainingServiceCategoryList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
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
  value: ITrainerServiceValue
) => {
  setLoading(true);
  try {
    const addTrainerPreferredLocation = await ADD_PREFERRED_SERVICE(value);
    if (
      addTrainerPreferredLocation &&
      addTrainerPreferredLocation.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(addTrainerPreferredLocation.message);
    } else {
      sweetAlertError(addTrainerPreferredLocation.message);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const deleteTrainerPreferredServiceCategoryApi = async (
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const deleteTrainerPreferredServiceCategory =
      await DELETE_PREFERRED_SERVICE(id);
    if (
      deleteTrainerPreferredServiceCategory &&
      deleteTrainerPreferredServiceCategory.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(deleteTrainerPreferredServiceCategory.message);
    } else {
      sweetAlertError(deleteTrainerPreferredServiceCategory.message);
    }
  } catch (error) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
