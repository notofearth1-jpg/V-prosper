import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import {
  GET_SYSTEM_CONFIGURATION_BY_KEY,
  ITrainerAgreement,
} from "../../../services/trainer/TrainerService";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ITrainerDetails } from "../trainerController";

export const initialAgreementValues = (
  getTrainerDetails: ITrainerDetails | undefined
) => {
  return {
    framework_consent: getTrainerDetails?.framework_consent || false,
  };
};

export interface ITrainerAggrementValue {
  config_value: string;
  user_friendly_name: string;
}

export const submitTrainerAgreementDetails = async (
  trainerData: ITrainerAgreement,
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

      if (
        updatedDetails.hasOwnProperty(
          "framework_consent" && "overview_section_status"
        )
      ) {
        // If it exists, update its value
        updatedDetails.framework_consent = trainerData.framework_consent;
        updatedDetails.overview_section_status =
          trainerData.overview_section_status;
      } else {
        // If it doesn't exist, add it to '
        updatedDetails.framework_consent = trainerData.framework_consent;
        updatedDetails.overview_section_status =
          trainerData.overview_section_status;
      }
    } else {
      // If ' doesn't exist, create it and add 'framework_consent'
      updatedDetails = {
        framework_consent: trainerData.framework_consent,
        overview_section_status: trainerData.overview_section_status,
      };
    }

    // Store the updated object back in local storage
    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, userId);

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
    toastError(err?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchTrainerAggrement = async (
  setTrainerAggrementValue: TReactSetState<ITrainerAggrementValue | undefined>,
  setLoading: TReactSetState<boolean>,
  key: string
) => {
  try {
    setLoading(true);

    const trainerAggrement = await GET_SYSTEM_CONFIGURATION_BY_KEY(key);

    if (
      trainerAggrement &&
      trainerAggrement.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setTrainerAggrementValue(trainerAggrement.data);
    } else {
      toastError(trainerAggrement.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
