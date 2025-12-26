import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_FAQ_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_faq.url + `/${id}`,
    API_ENDPOINTS.get_all_faq.method
  );
export const GET_GENERAL_FAQ = () =>
  serviceMaker(
    API_ENDPOINTS.get_general_faq.url + `?perPageRows=1000`,
    API_ENDPOINTS.get_general_faq.method
  );
