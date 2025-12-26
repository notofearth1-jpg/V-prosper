import { TReactSetState } from "../../data/AppType";
import { GET_GENERAL_FAQ } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";
import { IFaqs } from "../product-services/Web/ProductServiceDetailsWebController";

export const fetchGenFaqsApi = async (setGenFaqs: TReactSetState<IFaqs[]>) => {
  try {
    const genFaqs = await GET_GENERAL_FAQ();

    if (genFaqs && genFaqs.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setGenFaqs(genFaqs.data.item);
    } else {
      toastError(genFaqs.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.genFaqs?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
