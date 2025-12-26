import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerEvents } from "../../../services/trainer/TrainerService";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export const initialValuesMarketingPartner = (
  trainerDetails: ITrainerEvents | undefined
) => {
  return {
    is_marketing_partner: trainerDetails?.is_marketing_partner ?? true,
  };
};

export const submitTrainerEventDetails = async (
  trainerData: ITrainerEvents,
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

        if (updatedDetails.hasOwnProperty("is_marketing_partner")) {
          // If it exists, update its value
          updatedDetails.is_marketing_partner =
            trainerData.is_marketing_partner;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.is_marketing_partner =
            trainerData.is_marketing_partner;
        }
      } else {
        // If ' doesn't exist, create it and add 'is_marketing_partner'
        updatedDetails = {
          is_marketing_partner: trainerData.is_marketing_partner,
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
