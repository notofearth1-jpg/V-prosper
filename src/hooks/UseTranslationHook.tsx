// Hooks for translation i18n
import { useTranslation as useI18nTranslation } from "react-i18next";
import { TUseTranslationTfn } from "../data/AppType";

type TUseTranslation = {
  (): {
    t: TUseTranslationTfn;
    changeLanguage: (value: string) => void;
  };
};

const UseTranslationHook: TUseTranslation = () => {
  const { t: translate, i18n } = useI18nTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value).catch((err) => console.log(err));
  };

  const t = (text: string) => {
    return translate(text);
  };

  return { t, changeLanguage };
};

export default UseTranslationHook;
