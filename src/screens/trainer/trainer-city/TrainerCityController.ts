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
import { decryptData, toastError } from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ITrainerCites } from "../../../services/trainer/TrainerService";

export const trainerLocationValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    preferred_location: Yup.array().min(1, t("select_location")),
  });

export const fetchTrainerCites = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "cities",
      data_value: "id",
      display_value: "city_name",
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

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

export const submitTrainerPreferredLocationDetails = async (
  trainerData: ITrainerCites,
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

        if (updatedDetails.hasOwnProperty("preferred_location")) {
          // If it exists, update its value
          updatedDetails.preferred_location = trainerData.preferred_location;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.preferred_location = trainerData.preferred_location;
        }
      } else {
        // If ' doesn't exist, create it and add 'preferred_location'
        updatedDetails = {
          preferred_location: trainerData.preferred_location,
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
