import { AxiosRequestConfig } from "axios";
import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import { SERVICE_METHODS } from "../../utils/AppEnumerations";

export const GLOBAL_DROP_DOWN = (payload: {
  entity: string;
  data_value: string;
  display_value: string;
}) =>
  serviceMaker(
    API_ENDPOINTS.global_drop_down.url,
    API_ENDPOINTS.global_drop_down.method,
    payload
  );

export const LOG_ERROR = (payload: any) =>
  serviceMaker(
    API_ENDPOINTS.add_error_handling_token.url,
    API_ENDPOINTS.add_error_handling_token.method,
    payload
  );

export const LOG_ERROR_PT = (payload: any) =>
  serviceMaker(
    API_ENDPOINTS.add_error_handling_public_token.url,
    API_ENDPOINTS.add_error_handling_public_token.method,
    payload
  );

// Image url will be dynamic. So can not use API_ENDPOINTS in below function
export const GET_IMAGE = (url: string, config?: AxiosRequestConfig) =>
  serviceMaker(url, SERVICE_METHODS.REQUEST, null, config);

export const UPLOAD_IMAGE = (data: FormData) =>
  serviceMaker(
    API_ENDPOINTS.upload_image.url,
    API_ENDPOINTS.upload_image.method,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const SWITCH_INTERFACE = () =>
  serviceMaker(
    API_ENDPOINTS.add_switch_interface_token.url,
    API_ENDPOINTS.add_switch_interface_token.method
  );

export const IS_ALLOW_GOOGLE_SIGN_IN = () =>
  serviceMaker(
    API_ENDPOINTS.get_google_is_allow.url,
    API_ENDPOINTS.get_google_is_allow.method
  );

export const IS_ALLOW_FACEBOOK_SIGN_IN = () =>
  serviceMaker(
    API_ENDPOINTS.get_facebook_is_allow.url,
    API_ENDPOINTS.get_facebook_is_allow.method
  );

export const IS_ALLOW_APPLE_SIGN_IN = () =>
  serviceMaker(
    API_ENDPOINTS.get_apple_is_allow.url,
    API_ENDPOINTS.get_apple_is_allow.method
  );
