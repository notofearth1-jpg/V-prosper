import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import {
  decryptData,
  toastError,
  toastSuccess,
} from "../../utils/AppFunctions";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { GET_TRAINER_DETAILS_BY_ID } from "../../services/Endpoints";
import { localStorageUtils } from "../../utils/LocalStorageUtil";

export interface ITrainerDetails {
  id: number;
  application_status: number;
  framework_consent: boolean;
  is_marketing_partner: boolean;
  has_own_session_space: boolean;
  has_space_for_rent: boolean;
  identity_document_image_url: string;
  address_document_image_url: string;
  skill_set: number[];
  preferred_location: number[];
  address: {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string | undefined;
    city: string;
    state_id: number;
    postcode: string;
  };
  health_questionnaire: {
    question_id: number;
    answer: string;
  }[];
  gender: number;
  dob: string;
  keycode_document_url: string;
  certificates: {
    type: number;
    exp_month: number;
    exp_year: number | undefined;
    certificate_image_url: string;
  }[];
  overview_section_status: {
    completed: number[];
    in_progress: number[];
  };
}

export const fetchTrainerDetails = async (
  setTrainerDetails: TReactSetState<ITrainerDetails | undefined>,
  userId: number,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const trainerDetails = await GET_TRAINER_DETAILS_BY_ID(userId);
    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const trainerDetail = JSON.parse(decryptData(trainerDetails.data));
      setTrainerDetails(trainerDetail.application_content);
      localStorageUtils.setTrainerId(trainerDetail.id);
      localStorageUtils.setApplicationId(trainerDetail.application_id);
    } else {
      toastError(trainerDetails.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
