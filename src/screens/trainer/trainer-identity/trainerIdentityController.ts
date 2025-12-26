import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { MESSAGE_UNKNOWN_ERROR_OCCURRED } from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import { ITrainerIdentity } from "../../../services/trainer/TrainerService";
import { PROOF_LABEL } from "../../../utils/AppEnumerations";

export const submitTrainerIdentityDetails = async (
  trainerData: ITrainerIdentity,
  userId: number,
  setCurrentIndex: TReactSetState<number>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  t: TUseTranslationTfn,
  successCB: () => void
) => {
  try {
    setLoading(true);
    const storedDetails = await localStorageUtils.getTrainerDetails();
    let updatedDetails: any = {};

    if (storedDetails) {
      updatedDetails = JSON.parse(storedDetails);

      if (storedDetails) {
        updatedDetails = JSON.parse(storedDetails);

        if (
          updatedDetails.hasOwnProperty(
            "identity_document_image_url" &&
              "address_document_image_url" &&
              "identity_document_id" &&
              "address_document_id"
          )
        ) {
          updatedDetails.identity_document_image_url =
            trainerData.identity_document_image_url;
          updatedDetails.address_document_image_url =
            trainerData.address_document_image_url;
          updatedDetails.identity_document_id =
            trainerData.identity_document_id;
          updatedDetails.address_document_id = trainerData.address_document_id;
        } else {
          updatedDetails.identity_document_image_url =
            trainerData.identity_document_image_url;
          updatedDetails.address_document_image_url =
            trainerData.address_document_image_url;
          updatedDetails.identity_document_id =
            trainerData.identity_document_id;
          updatedDetails.address_document_id = trainerData.address_document_id;
        }
      } else {
        updatedDetails = {
          identity_document_image_url: trainerData.identity_document_image_url,
          address_document_image_url: trainerData.address_document_image_url,
          identity_document_id: trainerData.identity_document_id,
          address_document_id: trainerData.address_document_id,
        };
      }
    }

    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, userId);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      successCB();
    } else {
      const trainerDetailData = JSON.parse(decryptData(trainerDetails?.data));
      toastError(
        trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const identityOptions: string[] = [
  PROOF_LABEL.PanCard,
  PROOF_LABEL.AadhaarCard,
  PROOF_LABEL.ElectionCard,
  PROOF_LABEL.DrivingLicence,
];

export const addressOptions: string[] = [
  PROOF_LABEL.AadhaarCard,
  PROOF_LABEL.ElectionCard,
];
