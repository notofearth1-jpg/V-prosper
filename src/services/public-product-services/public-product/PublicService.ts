import { serviceMaker } from "../..";
import { IPagination } from "../../../data/AppInterface";
import { API_ENDPOINTS } from "../../../utils/ApiEndPoint";

export const GET_SERVICE_PUBLIC = (
  payload: IPagination,
  trendingFlag: boolean
) =>
  serviceMaker(
    API_ENDPOINTS.get_public_service.url +
      "?ad=true" +
      `${trendingFlag ? `&type=T` : ""}` +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_public_service.method
  );
export const GET_PUBLIC_SERVICE_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_public_service.url + "/" + id,
    API_ENDPOINTS.get_public_service.method
  );
export const GET_PUBLIC_SERVICE_RATING_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_public_service_rating.url + "/" + id,
    API_ENDPOINTS.get_public_service_rating.method
  );
