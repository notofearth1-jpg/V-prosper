import { NavigateFunction } from "react-router-dom";
import { CRYPTO } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";

export interface ICrypto {
  cryptoCipherIV: string;
  cryptoCipherKey: string;
  secretKey: string;
}

export const submitCrypto = async (data: ICrypto) => {
  try {
    const crypto = await CRYPTO(data);

    if (crypto && crypto.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return true;
    } else {
      toastError(crypto.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      return false;
    }
  } catch (error: any) {
    toastError(error?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  }
};
