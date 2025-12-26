import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export interface IZoomMeeting {
  meetingNumber: string;
  role: string | number;
}

export const ZOOM_MEETING = (payload: IZoomMeeting) =>
  serviceMaker(
    API_ENDPOINTS.add_zoom_meeting_session.url,
    API_ENDPOINTS.add_zoom_meeting_session.method,
    payload
  );

export const GET_ZOOM_MEETING_BY_SESSION_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_session_meeting.url + `/${id}`,
    API_ENDPOINTS.get_session_meeting.method
  );
