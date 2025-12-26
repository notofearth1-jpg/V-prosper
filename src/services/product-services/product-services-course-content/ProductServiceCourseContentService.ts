import { serviceMaker } from "../..";
import { ISessions } from "../../../components/zoom/ZoomMeetingJoinController";
import { API_ENDPOINTS } from "../../../utils/ApiEndPoint";

export const GET_ALL_SERVICE_COURSE_CONTENT = (sessionId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service_course_content.url +
      `?sessionId=${sessionId}`,
    API_ENDPOINTS.get_all_service_course_content.method
  );

export const ADD_TRAINER_SESSION_COURSE = (payload: ISessions) =>
  serviceMaker(
    API_ENDPOINTS.add_trainer_sessions_course.url,
    API_ENDPOINTS.add_trainer_sessions_course.method,
    payload
  );
