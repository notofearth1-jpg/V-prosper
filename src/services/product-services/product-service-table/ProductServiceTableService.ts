import { serviceMaker } from "../..";
import { API_ENDPOINTS } from "../../../utils/ApiEndPoint";

export const GET_SERVICE_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url + "/" + id,
    API_ENDPOINTS.get_all_service.method
  );

export const GET_ALL_SERVICE_CATEGORY_FOR_TREND = (heading?: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url +
      `${heading ? `?type=T&all=true` : `?type=T`}`,
    API_ENDPOINTS.get_all_service.method
  );

export const GET_ALL_SERVICE_CATEGORY_FOR_DISCOVER = (heading?: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url +
      `${heading ? `?type=D&all=true` : `?type=D`}`,
    API_ENDPOINTS.get_all_service.method
  );

export const GET_ALL_FREE_SERVICE = (heading?: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url +
      `${heading ? `?type=F&all=true` : `?type=F`}`,
    API_ENDPOINTS.get_all_service.method
  );

export const GET_ALL_SERVICE = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url,
    API_ENDPOINTS.get_all_service.method
  );

export const GET_ALL_SERVICE_BY_CATEGORY = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_service_by_category.url,
    API_ENDPOINTS.get_all_service_by_category.method
  );

export const GET_ALL_SERVICE_BY_CATEGORY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service_by_category.url + `?SCI=${id}`,
    API_ENDPOINTS.get_all_service_by_category.method
  );

export const CHECK_FREE_BOOKING = (service_id: number) =>
  serviceMaker(
    API_ENDPOINTS.check_free_booking.url,
    API_ENDPOINTS.check_free_booking.method,
    { service_id }
  );

export const RELATED_SERVICE = (service_id: number) =>
  serviceMaker(
    API_ENDPOINTS.related_service.url + "/" + service_id,
    API_ENDPOINTS.related_service.method
  );
