import { IPagination } from "../../data/AppInterface";
import {
  TReactSetState,
  TSetPaginationFn,
  TUseTranslationTfn,
} from "../../data/AppType";
import {
  END_OFFLINE_SESSION,
  GET_ALL_SESSIONS,
  START_OFFLINE_SESSION,
  RESEND_SESSION_OTP,
} from "../../services/Endpoints";
import {
  IOfflineSessionEndPayload,
  IOfflineSessionPayload,
} from "../../services/trainer-task/TrainerTaskService";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  generatePaginationFromApiRes,
  getLocalDate,
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
} from "../../utils/AppFunctions";
import { IAddress } from "../user-location/UserLocation.controller";

export const isSessionExpired = (session_end_date: string) =>
  getLocalDate() > getLocalDate(session_end_date + "T23:59:59");

export const currentDate = getLocalDate().toISOString().split("T")[0];
export const isDateBetween = (startDate: string, endDate: string): boolean => {
  return startDate <= currentDate && endDate >= currentDate;
};
export interface ICustomPagination {
  per_page_rows: number;
  current_page: number;
}

export interface ISession {
  id: number;
  session_start_date: string;
  session_end_date: string;
  session_start_time: string;
  session_end_time: string;
  join_url: string;
  created_date: string;
  trainer_id: number | null;
  trainer_name: string | null;
  service_id: number;
  service_title: string;
  total_bookings: number;
  is_offline: string;
  actual_session_start_time: string;
  actual_session_end_time: string;
  session_duration: number;
  meeting_link: string;
  address: IAddress;
}

export const fetchTrainerSessionsApi = async (
  isAppend: boolean,
  sessionList: ISession[],
  setSessionList: TReactSetState<ISession[]>,
  pagination: IPagination,
  setPagination: TSetPaginationFn,
  setLoading: TReactSetState<boolean>,
  showHistorical: boolean,
  setSessionDateList?: TReactSetState<number[]>,
  onDate?: string
) => {
  setLoading(true);
  try {
    const sessionListResult = await GET_ALL_SESSIONS(
      pagination,
      showHistorical,
      onDate
    );
    if (sessionList && sessionListResult.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (isAppend) {
        setSessionList([...sessionList, ...sessionListResult?.data?.item]);
        setSessionDateList &&
          setSessionDateList(sessionListResult.data.session_booked_on);
      } else setSessionList(sessionListResult.data.item);
      setSessionDateList &&
        setSessionDateList(sessionListResult.data.session_booked_on);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(sessionListResult.data.pagination),
      });
    } else {
      toastError(sessionListResult.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const startOfflineSession = async (
  sessionInfo: IOfflineSessionPayload,
  sessionId: number,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const sessionData = await START_OFFLINE_SESSION(sessionInfo, sessionId);
    if (sessionData && sessionData.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(t("otp_verify_successfully"));
    } else {
      sweetAlertError(sessionData.message);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const endOfflineSession = async (
  endSessionInfo: IOfflineSessionEndPayload,
  sessionId: number,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const endSessionData = await END_OFFLINE_SESSION(endSessionInfo, sessionId);
    if (endSessionData && endSessionData.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(t("session_end"));
    } else {
      sweetAlertError(endSessionData.message);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const resendSessionOtp = async (id: number) => {
  const payload = {
    session_id: id,
  };
  try {
    const resendOtp = await RESEND_SESSION_OTP(payload);
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
