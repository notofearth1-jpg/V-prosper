import { NavigateFunction } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import {
  prepareMessageFromParams,
  toastError,
  toastSuccess,
} from "../../../utils/AppFunctions";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import * as Yup from "yup";
import {
  ADD_USER_INFORMATION,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export interface IUserHealth {
  type: string;
  value: [
    {
      question_id: number;
      answer: string;
    }
  ];
}

export const healthValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    type: Yup.string().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("type")],
      ])
    ),
    value: Yup.array().of(
      Yup.object().shape({
        question_id: Yup.number().required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("question_id")],
          ])
        ),
        answer: Yup.string().when("question_id", {
          is: 3,
          then: () =>
            Yup.string()
              .max(5, t("blood_group_max_validation"))
              .required(
                prepareMessageFromParams(t("error_message_required"), [
                  ["fieldName", t("answer")],
                ])
              ),
          otherwise: () =>
            Yup.string().required(
              prepareMessageFromParams(t("error_message_required"), [
                ["fieldName", t("answer")],
              ])
            ),
        }),
      })
    ),
  });

export const submitUserHealth = async (
  userData: IUserHealth[],
  setCurrentIndex: TReactSetState<number>,
  isPrvious: Boolean = false
) => {
  try {
    const resultHealth = await ADD_USER_INFORMATION(userData);

    if (resultHealth && resultHealth.code === DEFAULT_STATUS_CODE_SUCCESS) {
      isPrvious
        ? setCurrentIndex((prevIndex) => prevIndex - 1)
        : setCurrentIndex((prevIndex) => prevIndex + 1);

      userData.forEach((item, index) => {
        if (Array.isArray(item.value)) {
          const answer = item.value.map((Valueitem) => Valueitem.answer);
          localStorage.setItem(`answer${index + 1}`, JSON.stringify(answer));
        } else {
          localStorage.setItem(
            `answer${index + 1}`,
            JSON.stringify(item.value)
          );
        }
      });
    } else {
      toastError(resultHealth.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultHealth?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchUserHealth = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "questionnaire",
      data_value: "id",
      display_value: "question",
      filters: [
        {
          field: "questionnaire_type",
          value: 1,
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDdl?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const getUserBloodGroup = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "blood_groups",
      data_value: "id",
      display_value: "blood_group",
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDdl?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
