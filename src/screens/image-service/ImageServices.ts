import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";
import { UPLOAD_IMAGE } from "../../services/generic/GenericServices";

export const fetchUploadImageService = async (formData: FormData) => {
  try {
    const resUploadImage = await UPLOAD_IMAGE(formData);
    if (resUploadImage && resUploadImage.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return resUploadImage.data.imagePath;
    } else {
      toastError(resUploadImage.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }

  return null;
};
