import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerSpace } from "../../../services/trainer/TrainerService";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export const initialValuesSpace = (
  trainerDetails: ITrainerSpace | undefined
) => {
  return {
    has_own_session_space: trainerDetails?.has_own_session_space ?? true,
    has_space_for_rent: trainerDetails?.has_space_for_rent ?? true,
  };
};

export const submitTrainerSpaceDetails = async (
  trainerData: ITrainerSpace,
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

        if (
          updatedDetails.hasOwnProperty(
            "has_own_session_space" &&
              "has_space_for_rent" &&
              "overview_section_status"
          )
        ) {
          // If it exists, update its value
          updatedDetails.has_own_session_space =
            trainerData.has_own_session_space;
          updatedDetails.has_space_for_rent = trainerData.has_space_for_rent;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.has_own_session_space =
            trainerData.has_own_session_space;
          updatedDetails.has_space_for_rent = trainerData.has_space_for_rent;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        }
      } else {
        // If ' doesn't exist, create it and add 'has_own_session_space' and 'has_space_for_rent'
        updatedDetails = {
          has_own_session_space: trainerData.has_own_session_space,
          has_space_for_rent: trainerData.has_space_for_rent,
          overview_section_status: trainerData.overview_section_status,
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
        trainerDetails?.message
          ? trainerDetails?.message
          : trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
