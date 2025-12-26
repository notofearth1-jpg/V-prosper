import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { DEFAULT_STATUS_CODE_SUCCESS, MESSAGE_UNKNOWN_ERROR_OCCURRED } from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerGender } from "../../../services/trainer/TrainerService";

export const trainerGenderValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    gender: Yup.number().test(
      "is-not-zero",
      t("please_select_gender"),
      (value) => value !== 0
    ),
  });

export const initialGenderValues = (selectedGender: number) => {
  return {
    gender: selectedGender,
  };
};

export const submitTrainerGenderDetails = async (
  trainerData: ITrainerGender,
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

        if (updatedDetails.hasOwnProperty("gender")) {
          // If it exists, update its value
          updatedDetails.gender = trainerData.gender;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.gender = trainerData.gender;
        }
      } else {
        // If ' doesn't exist, create it and add 'gender'
        updatedDetails = {
          gender: trainerData.gender,
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
      toastError(trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (err: any) {
    toastError(err.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
