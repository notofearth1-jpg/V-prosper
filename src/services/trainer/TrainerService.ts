import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { ITrainerMeeting } from "../../screens/trainer-availability/TrainerAvailabilityController";
import { IAddTrainerFeedback } from "../../screens/trainer-detail-profile/TrainerDetailsProfileController";
import { IAddITrainerCertificates } from "../../screens/trainer-profile/trainer-profile-certificates/TrainerProfileCertificatesController";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import { encryptData } from "../../utils/AppFunctions";

export interface ITrainerSkills {
  skill_set: { value: string; label: string }[];
}

export interface ITrainerCites {
  preferred_location: { value: string; label: string }[];
}

export interface ITrainerOverview {
  completed: number[];
  in_progress: number[];
}

export interface ITrainerAgreement {
  framework_consent: boolean;
  overview_section_status: ITrainerOverview;
}

export interface ITrainerGender {
  gender: number;
}

export interface ITrainerBirthDate {
  dob: string;
}

export interface ITrainerEvents {
  is_marketing_partner: boolean;
}

export interface ITrainerSpace {
  has_own_session_space: boolean;
  has_space_for_rent: boolean;
  overview_section_status: ITrainerOverview;
}

export interface ITrainerIdentity {
  identity_document_image_url: string;
  identity_document_id: number;
  address_document_image_url: string;
  address_document_id: number;
}

export interface ITrainerHealth {
  health_questionnaire: {
    question_id: number;
    answer: string;
  }[];
}

export interface ITrainerCertificates {
  certificates: {
    type: number;
    exp_month: number;
    exp_year: number | null;
    certificate_image_url: string;
  }[];
  overview_section_status: ITrainerOverview;
}

export interface ITrainerKeycodeUpload {
  keycode_document_url: string;
  overview_section_status: ITrainerOverview;
}

export interface ITrainerAddress {
  type: string;
  address?: {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string | undefined;
    city: string;
    state_id: number | undefined;
    country_id: number;
    postcode: string;
  };
}

export interface ITrainerStatus {
  status: number;
}

type TTrainer =
  | ITrainerSkills
  | ITrainerAddress
  | ITrainerAgreement
  | ITrainerGender
  | ITrainerBirthDate
  | ITrainerKeycodeUpload;

type TTrainerPayload = TTrainer;

export const ADD_TRAINER_DETAILS = (payload: TTrainerPayload, id: number) => {
  if ("address" in payload) {
    if (!payload?.address?.address_line_1) {
      delete payload.address;
    }
  }

  return serviceMaker(
    API_ENDPOINTS.add_trainer_details.url + "/" + id + "/trainer/application",
    API_ENDPOINTS.add_trainer_details.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );
};

export const GET_TRAINER_DETAILS_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_details_by_id.url +
      "/" +
      id +
      "/trainer/application",
    API_ENDPOINTS.get_trainer_details_by_id.method
  );

export const GET_TRAINER_KEYCODE_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_keycode_by_id.url + "/" + id + "/keycode",
    API_ENDPOINTS.get_trainer_keycode_by_id.method
  );

export const ADD_TRAINER_APPLICATION = (payload: ITrainerStatus, id: number) =>
  serviceMaker(
    API_ENDPOINTS.add_trainer_application.url + "/" + id + "/status",
    API_ENDPOINTS.add_trainer_application.method,
    payload
  );

export const GET_ALL_TRAINER_CERTIFICATES = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_trainer_certificates.url,
    API_ENDPOINTS.get_all_trainer_certificates.method
  );

export const GET_ALL_TRAINER_CERTIFICATES_PUBLIC = (trainerId: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_trainer_certificates_public.url +
      `?t=${trainerId ? trainerId : ""}`,
    API_ENDPOINTS.get_all_trainer_certificates_public.method
  );

export const ADD_TRAINER_CERTIFICATE = (payload: IAddITrainerCertificates) =>
  serviceMaker(
    API_ENDPOINTS.add_trainer_certificate.url,
    API_ENDPOINTS.add_trainer_certificate.method,
    payload
  );

export const DELETE_TRAINER_CERTIFICATE = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.delete_trainer_certificate.url + "/" + id,
    API_ENDPOINTS.delete_trainer_certificate.method
  );

export const UPDATE_TRAINER_CERTIFICATE_BY_Id = (
  payload: IAddITrainerCertificates,
  id: number
) =>
  serviceMaker(
    API_ENDPOINTS.update_trainer_certificate.url + "/" + id,
    API_ENDPOINTS.update_trainer_certificate.method,
    payload
  );

export const GET_TRAINER_CERTIFICATE_BY_Id = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_trainer_certificates.url + "/" + id,
    API_ENDPOINTS.get_all_trainer_certificates.method
  );

export const GET_ALL_HELP_CATEGORIES = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_help_category.url,
    API_ENDPOINTS.get_all_help_category.method
  );

export const GET_ALL_SYSTEM_HELP = (query: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_system_help.url +
      "?query=" +
      encodeURIComponent(query) +
      `&perPageRows=1000`,
    API_ENDPOINTS.get_all_system_help.method
  );

export const GET_ALL_SYSTEM_HELP_BY_ID = (id: number) =>
  serviceMaker(
    id + "/" + API_ENDPOINTS.get_all_system_help.url + "?perPageRows=10000",
    API_ENDPOINTS.get_all_system_help.method
  );

export const GET_SYSTEM_HELP_TOPIC_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_system_help.url + "/" + id,
    API_ENDPOINTS.get_all_system_help.method
  );

export const GET_TRAINER_FEEDBACK = (payload: IPagination, trainerId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_feedbacks.url +
      "/?trainer_id=" +
      trainerId +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_trainer_feedbacks.method
  );

export const ADD_UPDATE_TRAINER_FEEDBACK = (payload: IAddTrainerFeedback) =>
  serviceMaker(
    API_ENDPOINTS.add_update_trainer_feedbacks.url,
    API_ENDPOINTS.add_update_trainer_feedbacks.method,
    payload
  );

export const GET_SYSTEM_CONFIGURATION_BY_KEY = (key: string) =>
  serviceMaker(
    API_ENDPOINTS.get_system_configurations.url + "/" + key,
    API_ENDPOINTS.get_system_configurations.method
  );

export const GET_MEETING_DETAILS = () =>
  serviceMaker(
    API_ENDPOINTS.get_meeting_details.url,
    API_ENDPOINTS.get_meeting_details.method
  );

export const ADD_MEETING_DETAILS = (payload: ITrainerMeeting) =>
  serviceMaker(
    API_ENDPOINTS.add_meeting_details.url,
    API_ENDPOINTS.add_meeting_details.method,
    payload
  );
