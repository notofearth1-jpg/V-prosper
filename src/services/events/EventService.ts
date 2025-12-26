import { serviceMaker } from "..";
import { IPagination, ISearch } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface IRegistrationFormPayLoad {
  event_id: number | null;
  first_name: string;
  last_name: string;
  participant_age: string;
  email_address: string;
  mobile_number?: string;
}

export const GET_ALL_EVENTS = (nearBy?: boolean) =>
  serviceMaker(
    API_ENDPOINTS.get_all_events.url +
      `?perPageRows=1000` +
      (nearBy ? `&nbe=true` : ""),
    API_ENDPOINTS.get_all_events.method
  );

export const GET_EVENT_BY_ID = (id: number, sp: boolean) =>
  serviceMaker(
    API_ENDPOINTS.get_events_by_id.url + `/${id}${sp ? `?sp=${sp}` : ""}`,
    API_ENDPOINTS.get_events_by_id.method
  );
export const GET_EVENTS = (payload: IPagination, search: ISearch) =>
  serviceMaker(
    API_ENDPOINTS.get_events.url +
      `?query=${search.enterpriseSearch}&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_events.method
  );
export const EVENT_REGISTRATION = (payload: IRegistrationFormPayLoad) =>
  serviceMaker(
    API_ENDPOINTS.event_registration.url,
    API_ENDPOINTS.event_registration.method,
    payload
  );
