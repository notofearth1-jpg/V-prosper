import { IDDL } from "../../../data/AppInterface";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_TRAINER_DETAILS,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";
import { ITrainerCertificates } from "../../../services/trainer/TrainerService";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export interface ICertificate {
  type: number;
  exp_month: number;
  exp_year: number | null;
  certificate_image_url: string;
  category_name: string;
}

export const initialCertificatesValues = (
  trainerDetails: ITrainerCertificates | undefined
) => {
  return {
    certificates: trainerDetails?.certificates || [],
  };
};

export const fetchTrainerCertificate = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "service_category",
      data_value: "id",
      display_value: "category_title",
      filters: [
        {
          field: "is_available_for_certificate",
          value: "1",
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const submitTrainerCertificateDetails = async (
  trainerData: ITrainerCertificates,
  userId: number,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  isNext: boolean,
  isReview: boolean,
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
            "certificates" && "overview_section_status"
          )
        ) {
          // If it exists, update its value
          updatedDetails.certificates = trainerData.certificates;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        } else {
          // If it doesn't exist, add it to '
          updatedDetails.certificates = trainerData.certificates;
          updatedDetails.overview_section_status =
            trainerData.overview_section_status;
        }
      } else {
        // If ' doesn't exist, create it and add 'certificates'
        updatedDetails = {
          certificates: trainerData.certificates,
          overview_section_status: trainerData.overview_section_status,
        };
      }
    }
    // Store the updated object back in local storage
    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, userId);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (isReview) {
        setCurrentIndex((prevIndex) => prevIndex + 3);
      } else {
        isNext === true
          ? setCurrentIndex((prevIndex) => prevIndex + 1)
          : setCurrentIndex((prevIndex) => prevIndex - 1);
      }
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

export const monthsDropdown = [
  { data_value: 1, display_value: "January" },
  { data_value: 2, display_value: "February" },
  { data_value: 3, display_value: "March" },
  { data_value: 4, display_value: "April" },
  { data_value: 5, display_value: "May" },
  { data_value: 6, display_value: "June" },
  { data_value: 7, display_value: "July" },
  { data_value: 8, display_value: "August" },
  { data_value: 9, display_value: "September" },
  { data_value: 10, display_value: "October" },
  { data_value: 11, display_value: "November" },
  { data_value: 12, display_value: "December" },
];
