import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { toastError } from "../../utils/AppFunctions";
import {
  GET_ALL_SERVICE_BY_CATEGORY,
  GET_ALL_SERVICE_CATEGORY,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { IService } from "./ProductServiceCategoryController";

export const fetchServiceApi = async (
  setServicesList: TReactSetState<IService[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const serviceList = await GET_ALL_SERVICE_CATEGORY();
    if (serviceList && serviceList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesList(serviceList.data.item);
    } else {
      toastError(serviceList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
