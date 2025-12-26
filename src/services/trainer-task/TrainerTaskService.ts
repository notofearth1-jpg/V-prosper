import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface ICustomPaginationPayload {
  per_page_rows: number;
  current_page: number;
}

export interface IOfflineSessionPayload {
  otp: string;
}

export interface IOfflineSessionEndPayload {
  notes: string | number;
  session_media: {
    media_type: string;
    media_url: string;
    media_title: string;
  }[];
}

export const GET_ALL_SESSIONS = (
  pagination: ICustomPaginationPayload,
  showHistorical: boolean,
  onDate?: string
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_sessions.url +
      `?${
        onDate
          ? `onDate=${onDate}&currentPage=${pagination.current_page}&perPageRows=${pagination.per_page_rows}&showHistorical=${showHistorical}`
          : `currentPage=${pagination.current_page}&perPageRows=${pagination.per_page_rows}&showHistorical=${showHistorical}`
      }`,
    API_ENDPOINTS.get_all_sessions.method
  );

export const START_OFFLINE_SESSION = (
  payload: IOfflineSessionPayload,
  id: number
) =>
  serviceMaker(
    API_ENDPOINTS.start_offline_session.url + `/${id}`,
    API_ENDPOINTS.start_offline_session.method,
    payload
  );

export const END_OFFLINE_SESSION = (
  payload: IOfflineSessionEndPayload,
  id: number
) =>
  serviceMaker(
    API_ENDPOINTS.end_offline_session.url + `/${id}`,
    API_ENDPOINTS.end_offline_session.method,
    payload
  );
export const RESEND_SESSION_OTP = (payload: { session_id: number }) =>
  serviceMaker(
    API_ENDPOINTS.resend_session_otp.url,
    API_ENDPOINTS.resend_session_otp.method,
    payload
  );
