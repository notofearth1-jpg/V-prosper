// HOSTING ENVIRONMENT
export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT as string;
export const APP_HOST_URL = process.env.REACT_APP_APP_HOST_URL as string;

// bucket url
export const BUCKET_URL = process.env.REACT_APP_BUCKET_URL as string;
export const APP_IMAGE_URL = process.env.REACT_APP_APP_IMAGE_URL as string;

// API
export const API_HOST = process.env.REACT_APP_API_HOST as string;
export const API_BASE_PATH = process.env.REACT_APP_API_BASE_PATH as string;
export const API_BASE_URL = (API_HOST + "/" + API_BASE_PATH) as string;
export const API_PUBLIC_AUTHORIZATION_TOKEN = process.env
  .REACT_APP_API_PUBLIC_AUTHORIZATION_TOKEN as string;

// RAZOR PAY
export const RP_KEY_ID = process.env.REACT_APP_RP_KEY_ID as string;
export const RP_COMPANY_NAME = process.env.REACT_APP_RP_COMPANY_NAME as string;

// ZOOM
export const ZOOM_API_KEY = process.env.REACT_APP_ZOOM_API_KEY as string;

// FIREBASE
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APP_ID,
};
export const FIREBASE_VAP_ID_KEY = process.env
  .REACT_APP_FIREBASE_VAP_ID_KEY as string;

// Google map

export const GOOGLE_MAPS_API_KEY = process.env
  .REACT_APP_GOOGLE_MAPS_API_KEY as string;

// APP ENVIRONMENT
export const APP_DEFAULT_LANGUAGE = process.env
  .REACT_APP_APP_DEFAULT_LANGUAGE as string;
export const PER_PAGE_ROW_LIST = process.env.REACT_APP_PER_PAGE_ROW_LIST
  ? process.env.REACT_APP_PER_PAGE_ROW_LIST.split(",").map(Number)
  : [5, 10, 25, 50];
export const PER_PAGE_ROWS = process.env.REACT_APP_PER_PAGE_ROW
  ? Number(process.env.REACT_APP_PER_PAGE_ROW)
  : 10;
export const CALLING_CODE = process.env.REACT_APP_CALLING_CODE as string;

// PUBLIC KEY
export const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY
? process.env.REACT_APP_PUBLIC_KEY.replace(/\\n/gm, "\n")
: '' as string;