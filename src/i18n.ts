// Language Codes
// https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { APP_DEFAULT_LANGUAGE } from "./config/AppConfig";
import { LANGUAGE_LIST } from "./utils/AppConstants";

const getResaurceFormat = (lng: any) => {
  return {
    translation: lng,
  };
};

const resources = LANGUAGE_LIST.reduce(
  (acc, cur) => ({ ...acc, [cur.code]: getResaurceFormat(cur.path) }),
  {}
);

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3", // plural handling
  lng: APP_DEFAULT_LANGUAGE,
  fallbackLng: APP_DEFAULT_LANGUAGE,
  resources,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});
