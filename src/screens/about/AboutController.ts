import { TReactSetState } from "../../data/AppType";
import { GET_CONTENT_MANAGEMENT_BY_Id } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";

export interface IAppContent {
  type: string;
  value: string;
}

export const fetchContentManagementApi = async (
  setAboutUs: TReactSetState<IAppContent | undefined>,
  contentType: number
) => {
  try {
    const contentId = await GET_CONTENT_MANAGEMENT_BY_Id(contentType);

    if (contentId && contentId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setAboutUs(contentId.data);
    } else {
      toastError(contentId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.contentId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
  }
};
