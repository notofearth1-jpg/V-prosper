import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerSkills } from "../../../services/trainer/TrainerService";

export const trainerCategoryValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    skill_set: Yup.array().min(1, t("select_category")),
  });

export const submitTrainerDetails = async (
  trainerData: ITrainerSkills,
  user_id: number,
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

        if (updatedDetails.hasOwnProperty("skill_set")) {
          // If it exists, update its value
          updatedDetails.skill_set = trainerData.skill_set;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.skill_set = trainerData.skill_set;
        }
      } else {
        // If ' doesn't exist, create it and add 'skill_set'
        updatedDetails = {
          skill_set: trainerData.skill_set,
        };
      }
    }
    // Store the updated object back in local storage

    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, user_id);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      successCB();
    } else {
      const trainerDetailData = JSON.parse(decryptData(trainerDetails?.data));
      toastError(
        trainerDetails?.message
          ? trainerDetails?.message
          : trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
