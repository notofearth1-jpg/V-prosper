import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerKeycodeUpload } from "../../../services/trainer/TrainerService";

export const keycodeValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    keycode_document_url: Yup.mixed().required(t("please_select_image")),
  });

export const initialKeyCodeValue = (selectedFile: File | null) => ({
  keycode_document_url: selectedFile || null,
});

export const submitTrainerKeycodeDetails = async (
  trainerData: ITrainerKeycodeUpload,
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
            "keycode_document_url" && "overview_section_status"
          )
        ) {
          // If it exists, update its value
          updatedDetails.keycode_document_url =
            trainerData.keycode_document_url;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.keycode_document_url =
            trainerData.keycode_document_url;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        }
      } else {
        // If ' doesn't exist, create it and add 'keycode_document_url'
        updatedDetails = {
          keycode_document_url: trainerData.keycode_document_url,
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
        trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
