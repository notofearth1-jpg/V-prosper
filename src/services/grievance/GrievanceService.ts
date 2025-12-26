import { IPagination } from "./../../data/AppInterface";
import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import {
  IAddGrievance,
  IGrievanceConversationPayload,
} from "../../screens/grievance/grievanceController";

export interface IGetGrievance {
  perPageRows: number | null;
  currentPage: number | null;
  orderBy: string | null;
  sortBy: string | null;
}

export const GET_GRIEVANCES = (payload: IPagination) =>
  serviceMaker(
    API_ENDPOINTS.get_all_grievance.url +
      `/?perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_all_grievance.method
  );

export const ADD_GRIEVANCE = (payload: IAddGrievance) =>
  serviceMaker(
    API_ENDPOINTS.add_grievance.url,
    API_ENDPOINTS.add_grievance.method,
    payload
  );

export const UPDATE_GRIEVANCE = (
  payload: IAddGrievance,
  grievanceaId: number
) =>
  serviceMaker(
    API_ENDPOINTS.update_grievance.url + "/" + grievanceaId,
    API_ENDPOINTS.update_grievance.method,
    payload
  );

export const GET_GRIEVANCE_BY_ID = (grievanceId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_grievance_by_id.url + "/" + grievanceId,
    API_ENDPOINTS.get_grievance_by_id.method
  );

export const ADD_GRIEVANCE_CONVERSATION = (
  payload: IGrievanceConversationPayload
) =>
  serviceMaker(
    API_ENDPOINTS.add_grievance_conversation.url,
    API_ENDPOINTS.add_grievance_conversation.method,
    payload
  );

export const UPDATE_GRIEVANCE_CONVERSATION = (
  payload: IGrievanceConversationPayload,
  grievanceConversationId: number
) =>
  serviceMaker(
    API_ENDPOINTS.update_grievance_conversation.url +
      "/" +
      grievanceConversationId,
    API_ENDPOINTS.update_grievance_conversation.method,
    payload
  );

export const GET_GRIEVANCE_BOOKINGS = () =>
  serviceMaker(
    API_ENDPOINTS.get_grievance_bookings.url,
    API_ENDPOINTS.get_grievance_bookings.metod
  );

export const MARK_READ_GRIEVANCE = (grievanceId: number) =>
  serviceMaker(
    API_ENDPOINTS.mark_read_grievance.url + "/" + grievanceId,
    API_ENDPOINTS.mark_read_grievance.method,
    { is_seen: "1" }
  );
