import { ZOOM_API_KEY } from "../../config/AppConfig";
import { TReactSetState } from "../../data/AppType";
import {
  GET_ALL_SERVICE,
  GET_ALL_SERVICE_COURSE_CONTENT,
  ZOOM_MEETING,
} from "../../services/Endpoints";
import { ADD_TRAINER_SESSION_COURSE } from "../../services/product-services/product-services-course-content/ProductServiceCourseContentService";
import {
  GET_ZOOM_MEETING_BY_SESSION_ID,
  IZoomMeeting,
} from "../../services/session-management/SessionManagementServices";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";

export interface ISessions {
  session_id: number;
  course_ids: number[];
}

export interface IMeetingInfo {
  name: string;
  email: string;
  meeting_number: string;
  password: string;
}

export interface ISessionServicInfo {
  service_title: string;
  session_end_date: string;
  session_start_date: string;
  session_start_time: string;
}

export interface ILibraryData {
  id: number;
  title: string;
}

export interface IServiceCourse {
  id: number;
  content_title: string;
  content_desc: string;
  content_image_url: string;
  content_sequence: number;
  content_delivery_time: number;
  SCE: { completion_date: string };
  library_content: ILibraryData[];
  library_directory: ILibraryData[];
}

export const joinMeeting = async (zoomPayload: IZoomMeeting) => {
  try {
    const resultZoom = await ZOOM_MEETING(zoomPayload);
    if (resultZoom && resultZoom.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return resultZoom.data;
    } else {
      toastError(resultZoom.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultZoom.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchServiceCourseContentApi = async (
  setServiceCourseContentList: TReactSetState<IServiceCourse[]>,
  setServiceInfo: TReactSetState<ISessionServicInfo | undefined>,
  sessionId: number
) => {
  try {
    const listServiceCourseContent = await GET_ALL_SERVICE_COURSE_CONTENT(
      sessionId
    );

    if (
      listServiceCourseContent &&
      listServiceCourseContent.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setServiceCourseContentList(listServiceCourseContent.data.item);
      setServiceInfo(listServiceCourseContent.data.service);
    } else {
      toastError(
        listServiceCourseContent.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.listServiceCourseContent.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const trainerCourse = async (
  courseInfo: ISessions,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const courseData = await ADD_TRAINER_SESSION_COURSE(courseInfo);
    if (courseData && courseData.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return courseData.data;
    } else {
      toastError(courseData.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchMeeting = async (
  setMeeingInfo: TReactSetState<IMeetingInfo | undefined>,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const meetingInfo = await GET_ZOOM_MEETING_BY_SESSION_ID(id);
    if (meetingInfo && meetingInfo.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setMeeingInfo(meetingInfo.data);
    } else {
      toastError(meetingInfo.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
