import moment from "moment";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerBirthDate } from "../../../services/trainer/TrainerService";

export const initialBirthDateValues = (startDate: Date | null) => {
  return {
    dob: startDate ? moment(startDate).format("DD/MM/YYYY") : null,
  };
};

export const submitTrainerBirthDetails = async (
  trainerData: ITrainerBirthDate,
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

        if (updatedDetails.hasOwnProperty("dob")) {
          // If it exists, update its value
          updatedDetails.dob = trainerData.dob;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.dob = trainerData.dob;
        }
      } else {
        // If ' doesn't exist, create it and add 'dob'
        updatedDetails = {
          dob: trainerData.dob,
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
        trainerDetailData.message
          ? trainerDetailData.message
          : trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
