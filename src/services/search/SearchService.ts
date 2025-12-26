import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface IRecentSearchAddPayload {
  search_text: string;
  search_category: number;
  entity_record_id: number;
}

export const GET_ALL_SEARCH_HISTORY = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_search_history.url,
    API_ENDPOINTS.get_all_search_history.method
  );
export const GET_ALL_SEARCH_RESULT = (search: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_search_result.url +
      `?q=${encodeURIComponent(search)}`,
    API_ENDPOINTS.get_all_search_result.method
  );
export const ADD_RECENT_SEARCH_HISTORY = (payload: IRecentSearchAddPayload) =>
  serviceMaker(
    API_ENDPOINTS.add_recent_search_history.url,
    API_ENDPOINTS.add_recent_search_history.method,
    payload
  );
