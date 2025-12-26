import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_HIGHLIGHTS = () => {
  return serviceMaker(
    API_ENDPOINTS.get_all_story.url + `?perPageRows=1000`,
    API_ENDPOINTS.get_all_story.method
  );
};
