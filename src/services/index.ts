import Axios, { AxiosRequestConfig } from "axios";
import {
  API_PUBLIC_AUTHORIZATION_TOKEN,
  APP_HOST_URL,
  API_BASE_URL,
  PUBLIC_KEY,
} from "../config/AppConfig";
import { IServiceMethods } from "../data/AppType";
import { SERVICE_METHODS } from "../utils/AppEnumerations";
import { localStorageUtils } from "../utils/LocalStorageUtil";
import {
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
  DEFAULT_STATUS_CODE_UNKNOWN_ERROR,
  DEFAULT_STATUS_CODE_UNAUTHORIZED,
  MESSAGE_TOKEN_EXPIRED,
  UNPROCESSABLE_ENTITY_CODE,
  ENCRYPTION_DECRYPTION_FAIL,
} from "../utils/AppConstants";
import { API_ENDPOINTS } from "../utils/ApiEndPoint";
import { unauthorizedAccess } from "../routes/RoutePublic";
import { generateKeys } from "../utils/AppFunctions";
import { submitCrypto } from "../screens/auth/AuthController";

export const CONFIG = Axios.create({
  baseURL: API_BASE_URL,
});

CONFIG.interceptors.request.use(async (config) => {
  const token = await getAuthorizationToken();
  const cryptoKey = await getCryptoKey();

  if (!config.headers.Authorization) {
    config.headers.setAuthorization(token);
  }
  if (!config.headers["Content-Type"])
    config.headers.setContentType("application/json");
  config.headers.set("ngrok-skip-browser-warning", 0);
  config.headers["x-custom-header"] = "VP-PWA";
  config.headers["x-cck"] = cryptoKey;

  return config;
});

CONFIG.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  async (error) => {
    // Handle errors, including 404|401

    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.code === UNPROCESSABLE_ENTITY_CODE &&
      error.response.data.data === ENCRYPTION_DECRYPTION_FAIL
    ) {
      localStorage.clear();
      window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
      await new Promise((res, rej) => setTimeout(res, 1000));
    }

    if (
      (error &&
        error.response &&
        error.response.data &&
        error.response.data.code === DEFAULT_STATUS_CODE_UNAUTHORIZED &&
        error.response.data.message === MESSAGE_TOKEN_EXPIRED) ||
      error.response?.data?.data?.name === "JsonWebTokenError"
    ) {
      try {
        const refreshToken = await localStorageUtils.getRefreshToken();
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const resToken = await Axios.post(
          API_BASE_URL + "/" + API_ENDPOINTS.renew_access_token.url,
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `${API_PUBLIC_AUTHORIZATION_TOKEN}`,
              "Content-Type": "application/json",
              "x-custom-header": "VP-PWA",
            },
          }
        );
        if (
          resToken.data &&
          resToken.data.data &&
          resToken.data.data.token &&
          resToken.data.data.refresh_token
        ) {
          await localStorageUtils.setAccessToken(resToken.data.data.token);
          await localStorageUtils.setRefreshToken(
            resToken.data.data.refresh_token
          );
          const config = {
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: resToken.data.data.token,
            },
          };
          return await Axios(config);
        }
      } catch (e) {
        localStorage.clear();
        window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
        await new Promise((res, rej) => setTimeout(res, 1000));
      }
    }
    return Promise.reject(error);
  }
);

const getAuthorizationToken = async () => {
  const token = localStorageUtils.getAccessToken();
  if (token) {
    return token;
  }
  return API_PUBLIC_AUTHORIZATION_TOKEN;
};

let cryptoKeyPromise: Promise<string> | null = null;

const getCryptoKey = async () => {
  try {
    const storedCryptoKey = localStorageUtils.getCryptoKey();

    if (storedCryptoKey) {
      const parsedKey = JSON.parse(storedCryptoKey);
      return parsedKey.secretKey;
    }

    if (!cryptoKeyPromise) {
      cryptoKeyPromise = (async () => {
        const cryptoKey = generateKeys(PUBLIC_KEY);
        localStorageUtils.setCryptoKey(JSON.stringify(cryptoKey));
        await submitCrypto(cryptoKey);
        return cryptoKey.secretKey;
      })();
    }

    const secretKey = await cryptoKeyPromise;

    cryptoKeyPromise = null;

    return secretKey;
  } catch (e) {
    localStorage.clear();
    window.location.href = `${APP_HOST_URL}/${unauthorizedAccess.unauthorizedAccess}`;
    await new Promise((res, rej) => setTimeout(res, 1000));
  }
};

export const serviceMaker = async (
  url: string,
  method: IServiceMethods,
  data: any = {},
  config: AxiosRequestConfig = {}
) => {
  try {
    let result;
    let APIInstance = CONFIG;
    switch (method) {
      case SERVICE_METHODS.GET: {
        result = await APIInstance.get(url);
        break;
      }
      case SERVICE_METHODS.GET_CONFIG: {
        result = await APIInstance.get(url, config);
        break;
      }
      case SERVICE_METHODS.POST: {
        result = await APIInstance.post(url, data);
        break;
      }
      case SERVICE_METHODS.POST_CONFIG: {
        result = await APIInstance.post(url, data, config);
        break;
      }
      case SERVICE_METHODS.PUT: {
        result = await APIInstance.put(url, data);
        break;
      }
      case SERVICE_METHODS.PUT_CONFIG: {
        result = await APIInstance.put(url, data, config);
        break;
      }
      case SERVICE_METHODS.DELETE: {
        result = await APIInstance.delete(url, data);
        break;
      }
      case SERVICE_METHODS.DELETE_CONFIG: {
        result = await APIInstance.delete(url, data);
        break;
      }
      case SERVICE_METHODS.REQUEST: {
        result = await APIInstance.request({
          url: url,
          ...(config ? config : {}),
        });
        break;
      }
      default: {
        throw "InvalidMethod";
      }
    }

    return {
      data: result.data?.data,
      code: result.status,
      message: result.data?.message,
      response: method === SERVICE_METHODS.REQUEST ? result : result.data,
    };
  } catch (error: any) {
    try {
      return {
        data: error.response.data,
        code: error.response.status,
        message: error.response.data._server_messages
          ? JSON.parse(JSON.parse(error.response.data._server_messages)[0])
              .message
          : error.response.data.message,
      };
    } catch (e) {
      return {
        data: error,
        code: DEFAULT_STATUS_CODE_UNKNOWN_ERROR,
        message: MESSAGE_UNKNOWN_ERROR_OCCURRED,
      };
    }
  }
};
