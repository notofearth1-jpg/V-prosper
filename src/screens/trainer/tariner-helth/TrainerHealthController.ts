import { IDDL } from "../../../data/AppInterface";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_TRAINER_DETAILS,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import {
  decryptData,
  prepareMessageFromParams,
  toastError,
} from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ITrainerHealth } from "../../../services/trainer/TrainerService";

export interface IQuestionAnswer {
  question_id: number;
  answer: string;
}

export const initialHealthValues = (
  healthQuestion: IDDL[],
  userAnswers: string[]
) => {
  return {
    health_questionnaire: healthQuestion?.map((question, index) => ({
      question_id: question.data_value,
      answer: userAnswers[index] || "",
    })),
  };
};

export const trainerHealthValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    health_questionnaire: Yup.array().of(
      Yup.object().shape({
        question_id: Yup.string().required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("question_id")],
          ])
        ),
        answer: Yup.string().required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("answer")],
          ])
        ),
      })
    ),
  });

export const fetchTrainerHealthApi = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const trainerHealthPayload = {
      entity: "questionnaire",
      data_value: "id",
      display_value: "question",
      filters: [
        {
          field: "questionnaire_type",
          value: 2,
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(trainerHealthPayload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const submitTrainerHelathDetails = async (
  trainerData: ITrainerHealth,
  userId: number,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  successCB: () => void
) => {
  try {
    // Retrieve the existing object from local storage
    const storedDetails = await localStorageUtils.getTrainerDetails();
    let updatedDetails: any = {};

    if (storedDetails) {
      // Parse the stored object
      updatedDetails = JSON.parse(storedDetails);

      if (storedDetails) {
        // Parse the stored object
        updatedDetails = JSON.parse(storedDetails);

        if (updatedDetails.hasOwnProperty("health_questionnaire")) {
          // If it exists, update its value
          updatedDetails.health_questionnaire =
            trainerData.health_questionnaire;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.health_questionnaire =
            trainerData.health_questionnaire;
        }
      } else {
        // If ' doesn't exist, create it and add 'health_questionnaire'
        updatedDetails = {
          health_questionnaire: trainerData.health_questionnaire,
        };
      }
    }
    // Store the updated object back in local storage
    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, userId);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      successCB();
    } else {
      const trainerDetailData = JSON.parse(decryptData(trainerDetails?.data))
      toastError(
        trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
