import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_REPORT_BY_ID = (reportId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_report_by_id.url + `?report_id=` + reportId,
    API_ENDPOINTS.get_report_by_id.method
  );
