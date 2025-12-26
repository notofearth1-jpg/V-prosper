import { NavigateFunction } from "react-router";
import * as Yup from "yup";
import { IDDL } from "../../../data/AppInterface";
import {
  prepareMessageFromParams,
  toastError,
} from "../../../utils/AppFunctions";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_USER_INFORMATION,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";
import { IUserInterest } from "../user-interests/UserInterestController";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { userRoute } from "../../../routes/RouteUser";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { USER_STATUS } from "../../../utils/AppEnumerations";

export const languageValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    type: Yup.string().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("type")],
      ])
    ),
    value: Yup.array()
      .min(
        1,
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("language")],
        ])
      )
      .of(
        Yup.object().shape({
          value: Yup.string().required(
            prepareMessageFromParams(t("error_message_required"), [
              ["fieldName", t("language")],
            ])
          ),
          label: Yup.string().required(
            prepareMessageFromParams(t("error_message_required"), [
              ["fieldName", t("language")],
            ])
          ),
        })
      ),
  });

export const submitUserLanguages = async (
  userData: IUserInterest[],
  navigation: NavigateFunction,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn
) => {
  try {
    const resultLanguages = await ADD_USER_INFORMATION(userData);

    if (
      resultLanguages &&
      resultLanguages.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      navigation(userRoute.home);
      const userLangKeys = userData[0].value.map((item, index) => {
        const key = `userlang${index + 1}`;
        localStorage.setItem(key, item.toString());

        return key;
      });
      await localStorageUtils.setUserProfileStatus(
        USER_STATUS.ProfileCompleted.toString()
      );
      userLangKeys.forEach((key) => {
        let userLangValue = localStorage.getItem(key);
      });
    } else {
      toastError(resultLanguages.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resultLanguages?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const fetchUserLanguages = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "languages",
      data_value: "id",
      display_value: "language_title",
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDDL?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export function checkLocalStorage() {
  const requiredKeys = [
    // "AlternatePhone",
    // "RelationId",
    "FullName",
    "Email",
    // "AddressLine1",
    // "AddressLine2",
    // "AddressLine3",
    // "City",
    // "StateId",
    // "Postcode",
    "Type",
    "Value",
    // "AddressLabel",
    "BirthDayType",
    "BirthDayValue",
    // "answer1",
    // "answer2",
    // "Interest",
    // "BloodGroup",
  ];

  for (const key of requiredKeys) {
    if (!localStorage.getItem(key)) {
      return false; // Return false if any required key is missing
    }
  }

  return true; // All required keys are present
}
