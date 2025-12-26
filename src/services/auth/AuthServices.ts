import { serviceMaker } from "..";
import { API_PUBLIC_AUTHORIZATION_TOKEN } from "../../config/AppConfig";
import { ICrypto } from "../../screens/auth/AuthController";
import { IVerifyAlterativeOtp } from "../../screens/header/profile/verify-alternate-mobile/VerifyAlternateMobileController";

import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import { encryptCrypto, encryptData } from "../../utils/AppFunctions";

export const LOGIN = (payload: { username: string }) =>
  serviceMaker(API_ENDPOINTS.login.url, API_ENDPOINTS.login.method, {
    payload: encryptData(JSON.stringify(payload)),
  });

export const RESEND_OTP = (payload: { username: string }) =>
  serviceMaker(API_ENDPOINTS.resend_otp.url, API_ENDPOINTS.resend_otp.method, {
    payload: encryptData(JSON.stringify(payload)),
  });

export const VERIFY_OTP = (payload: { username?: string; otp: string }) =>
  serviceMaker(API_ENDPOINTS.verify_otp.url, API_ENDPOINTS.verify_otp.method, {
    payload: encryptData(JSON.stringify(payload)),
  });

export const LOGOUT = (payload: string) =>
  serviceMaker(API_ENDPOINTS.logout.url, API_ENDPOINTS.logout.method, payload);

export const VERIFY_ALTERNATE_OTP = (payload: IVerifyAlterativeOtp) =>
  serviceMaker(API_ENDPOINTS.verify_otp.url, API_ENDPOINTS.verify_otp.method, {
    payload: encryptData(JSON.stringify(payload)),
  });

export const CRYPTO = (payload: ICrypto) =>
  serviceMaker(
    API_ENDPOINTS.crypto.url,
    API_ENDPOINTS.crypto.method,
    {
      payload: encryptCrypto(payload),
    },
    {
      headers: {
        Authorization: API_PUBLIC_AUTHORIZATION_TOKEN,
      },
    }
  );
