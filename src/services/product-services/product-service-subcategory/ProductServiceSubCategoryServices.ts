import { serviceMaker } from "../..";
import { API_ENDPOINTS } from "../../../utils/ApiEndPoint";

export const GET_SERVICE_SUB_CATEGORY_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service_sub_categories.url + "/" + id,
    API_ENDPOINTS.get_all_service_sub_categories.method
  );

export const GET_SERVICE_BY_SUBCATEGORY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_services_by_sub_category.url + "/" + id,
    API_ENDPOINTS.get_all_services_by_sub_category.method
  );
