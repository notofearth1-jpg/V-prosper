import {
  ADD_GRIEVANCE,
  ADD_GRIEVANCE_CONVERSATION,
  GET_GRIEVANCE_BOOKINGS,
  GET_GRIEVANCE_BY_ID,
  GET_GRIEVANCES,
  MARK_READ_GRIEVANCE,
  UPDATE_GRIEVANCE,
  UPDATE_GRIEVANCE_CONVERSATION,
} from "./../../services/Endpoints";
import {
  TReactSetState,
  TSetPaginationFn,
  TUseTranslationTfn,
} from "../../data/AppType";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  generatePaginationFromApiRes,
  getLocalDate,
  prepareMessageFromParams,
  resetPaginationWithPpr,
  toastError,
} from "../../utils/AppFunctions";
import { IPagination } from "../../data/AppInterface";
import * as Yup from "yup";
import { NavigateFunction } from "react-router-dom";

export interface IGrivance {
  complaint_date: Date;
  complainer: number;
  complaint_title: string;
  complaint_detail: string;
  grievance_status: number;
  modified_date: Date | null;
  modified_by: Date | null;
  grievance_conversations: IGrievanceConversation[] | null;
  unread_messages: number;
}
export interface IAddGrievance {
  complaint_title: string;
  complaint_detail: string;
  booking_id: number | null;
}
export interface IGrievanceByID {
  id: number;
  complaint_date: Date | null;
  complainer: string | null;
  complainer_id: number;
  against_trainer: string | null;
  against_trainer_id: number | null;
  complaint_title: string;
  complaint_detail: string;
  grievance_status: number;
  modified_date: Date | null;
  modified_by: string | null;
  grievance_conversations: IGrievanceConversation[] | null;
}
export interface IGrievanceConversation {
  comment: string | null;
  modified_by: string | null;
  log_date: Date;
  id: number;
  pass_on_reason: string | null;
  assign_date: Date | null;
  assigned_by: string | null;
  assigned_to: string | null;
  role_id: number;
  modified_date: Date | null;
  file_path: string | null;
  modified_by_name: string;
}

export const fetchAllGrievance = async (
  setGrievances: TReactSetState<IGrivance[] | undefined>,
  setLoading: TReactSetState<boolean>,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  t: TUseTranslationTfn,
  grievanceList: IGrivance[] | undefined
) => {
  try {
    if (!grievanceList) setLoading(true);
    if (grievanceList && grievanceList.length === 0) setLoading(true);

    const grievance_list: any = await GET_GRIEVANCES(pagination);
    if (grievance_list && grievance_list.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (grievanceList && grievanceList.length > 0) {
        setGrievances([...grievanceList, ...grievance_list?.data?.item]);
      } else setGrievances(grievance_list?.data?.item);

      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(grievance_list.data.pagination),
      });
    } else {
      setGrievances([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
      toastError(grievance_list?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.grievance_list?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

// ADD NEW GRIEVANCEs
export const initialGrievanceValues = {
  complaint_title: "",
  complaint_detail: "",
  against_trainer_id: "",
  booking_id: null,
};

export const addGrievanceValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    complaint_title: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("complaint_title")],
        ])
      )
      .max(
        100,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("complaint_title")],
          ["max", "100"],
        ])
      ),
    complaint_detail: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("complaint_detail")],
        ])
      )
      .max(
        4000,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("complaint_detail")],
          ["max", "4000"],
        ])
      ),
  });

export const addGrievance = async (
  setLoading: TReactSetState<boolean>,
  navigation: NavigateFunction,
  t: TUseTranslationTfn,
  grievanceData: IAddGrievance
) => {
  try {
    setLoading(true);

    const resGrievance = await ADD_GRIEVANCE(grievanceData);
    if (resGrievance && resGrievance.code === DEFAULT_STATUS_CODE_SUCCESS) {
      navigation(-1);
    } else {
      toastError(resGrievance.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resGrievance?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

// UPDATE GRIEVANCES
export const updateGrievance = async (
  setLoading: TReactSetState<boolean>,
  navigation: NavigateFunction,
  t: TUseTranslationTfn,
  grievanceData: IAddGrievance,
  grievanceId: number
) => {
  try {
    setLoading(true);
    const resGrievance = await UPDATE_GRIEVANCE(grievanceData, grievanceId);
    if (resGrievance && resGrievance.code === DEFAULT_STATUS_CODE_SUCCESS) {
      navigation(-1);
      navigation(-1);
    } else {
      toastError(resGrievance.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resGrievance?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const getGrievanceByID = async (
  setLoading: TReactSetState<boolean>,
  setGrievanceConversation: TReactSetState<
    IGrievanceConversation[] | undefined
  >,
  setHasUnreadMessage: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  grievanceId: number
) => {
  try {
    setLoading(true);
    const resGrievance = await GET_GRIEVANCE_BY_ID(grievanceId);
    if (resGrievance && resGrievance.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setGrievanceConversation(resGrievance.data.grievance_conversations);
      setHasUnreadMessage(resGrievance.data?.unread_messages > 0);
    } else {
      toastError(resGrievance.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resGrievance?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
export interface IGrievanceConversationPayload {
  grievance_id: number;
  comment: string | null;
  file_path: string | null;
}

export const addGrievanceConversation = async (
  setLoading: TReactSetState<boolean>,
  setGrievanceConversation: TReactSetState<
    IGrievanceConversation[] | undefined
  >,
  grievanceConversation: IGrievanceConversation[] | undefined,
  t: TUseTranslationTfn,
  payload: any
) => {
  try {
    setLoading(true);
    const resConversation = await ADD_GRIEVANCE_CONVERSATION(payload);
    if (
      resConversation &&
      resConversation.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (grievanceConversation)
        setGrievanceConversation([
          ...grievanceConversation,
          resConversation.data,
        ]);
    } else {
      toastError(resConversation.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.resConversation?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const updateGrievanceConversation = async (
  setGrievanceConversation: TReactSetState<
    IGrievanceConversation[] | undefined
  >,
  t: TUseTranslationTfn,
  grievanceConversation: IGrievanceConversation[] | undefined,
  grievanceConversationId: number,
  payload: IGrievanceConversationPayload
) => {
  try {
    const resGrievance = await UPDATE_GRIEVANCE_CONVERSATION(
      payload,
      grievanceConversationId
    );
    if (resGrievance && resGrievance.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (grievanceConversation) {
        setGrievanceConversation(
          grievanceConversation.map((i: IGrievanceConversation) => {
            if (i.id == grievanceConversationId) {
              return {
                ...i,
                comment: payload.comment,
                modified_date: getLocalDate(),
              };
            }
            return i;
          })
        );
      }
    } else {
      toastError(resGrievance.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resGrievance?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export interface IGrievanceBooking {
  id: number;
  schedule_date: string;
  service_title: string;
}

export const fetchBookingListApi = async (
  setLoading: TReactSetState<boolean>,
  setBookingList: TReactSetState<IGrievanceBooking[]>,
  bookingList: IGrievanceBooking[]
) => {
  setLoading(true);
  try {
    const bookingListResult = await GET_GRIEVANCE_BOOKINGS();
    if (
      bookingListResult &&
      bookingListResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setBookingList(bookingListResult.data);
    } else {
      setBookingList([]);
      toastError(bookingListResult.message);
    }
  } catch {
    toastError(MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
  } finally {
    setLoading(false);
  }
};

export interface IGrievanceConversationPayload {
  grievance_id: number;
  comment: string | null;
  file_path: string | null;
}

export const markReadGrievance = async (grievanceId: number) => {
  try {
    await MARK_READ_GRIEVANCE(grievanceId);
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
