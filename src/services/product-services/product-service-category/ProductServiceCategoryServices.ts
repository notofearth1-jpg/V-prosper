import { serviceMaker } from "../..";
import { API_ENDPOINTS } from "../../../utils/ApiEndPoint";

export const GET_ALL_SERVICE_CATEGORY = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_services_category.url + `?perPageRows=1000`,
    API_ENDPOINTS.get_all_services_category.method
  );

export const GET_BY_ID_SERVICE_CATEGORY = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_services_category.url + "/" + id,
    API_ENDPOINTS.get_all_services_category.method
  );
