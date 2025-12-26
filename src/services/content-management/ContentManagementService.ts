import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_CONTENT_MANAGEMENT_BY_Id = (contentType:number) =>
  serviceMaker(
    API_ENDPOINTS.get_content_type_by_id.url + `?ct=${contentType}`,
    API_ENDPOINTS.get_content_type_by_id.method
  );
