import { NavigateFunction } from "react-router-dom";
import { TReactSetState } from "../../../data/AppType";
import {
  BOOKING_CANCELLATION_CHARGE_BY_ID,
  ADD_CANCEL_BOOKING_REASON,
  GET_BOOKING_BY_ID,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED,
} from "../../../utils/AppConstants";
import { SERVICE_TYPE } from "../../../utils/AppEnumerations";
import {
  getLocalDate,
  sweetAlertSuccess,
  toastError,
} from "../../../utils/AppFunctions";
import { userRoute } from "../../../routes/RouteUser";
import { ILibraryData } from "../../../components/zoom/ZoomMeetingJoinController";

export interface IFaqs {
  question: string;
  answer: string;
  tags: [];
  is_active: string;
  deleted: string;
  id: number;
  reference_links: [];
}
export interface IUserDetails {
  id: number;
  user_name: string;
}
export interface ITrainerDetails {
  id: number;
  trainer_name: string;
  trainer_url: string;
}
export interface ISCC {
  content_delivery_time: number;
  content_desc: string;
  content_title: string;
  id: number;
  library_content: ILibraryData[];
  library_directory: ILibraryData[];
}
export interface IBookingDetails {
  id: number;
  booking_date: string;
  schedule_date: string;
  schedule_time: string;
  service_cost: string;
  service_id: number;
  service_discounted_price: string;
  booking_status: number;
  booking_status_label: string;
  booking_cancellation_date: null | string;
  cancellation_reason: null | string;
  session_id: null | number;
  booking_location_lat: null | number;
  booking_location_long: null | number;
  booking_address_id: null | number;
  booking_number: string;
  feedback_given: string;
  session_duration: number;
  is_gender_specific: string;
  is_peer_to_peer: string;
  is_offline: string;
  user: IUserDetails;
  trainer: null | ITrainerDetails;
  service: {
    id: number;
    service_title: string;
    service_desc: string;
    unit_type_text: string;
    service_duration: number;
    service_pros: [];
    service_precautions: [];
    cancellation_cutoff_time_hours: number;
    service_other_notes: [];
    service_params: [];
    service_tags: string[];
    app_media: [
      {
        media_type: string;
        media_url: string;
      }
    ];
    SCC: ISCC[];
  };
  cancellation_cutoff_hours: string;
  service_faqs: IFaqs[];
}

export const calculateEndTimeDate = (
  scheduleDate: string,
  scheduleTime: string,
  unitType: string,
  serviceDuration: number
): Date => {
  const startTime = getLocalDate(`${scheduleDate}T${scheduleTime}`);
  let endTime = getLocalDate(startTime);

  switch (unitType) {
    case SERVICE_TYPE.Hours:
      endTime.setHours(startTime.getHours() + serviceDuration);
      break;
    case SERVICE_TYPE.Days:
      endTime.setDate(startTime.getDate() + serviceDuration);
      break;
    case SERVICE_TYPE.Weeks:
      endTime.setDate(startTime.getDate() + serviceDuration * 7);
      break;
    case SERVICE_TYPE.Months:
      endTime.setMonth(startTime.getMonth() + serviceDuration);
      break;
  }
  return endTime;
};

export const fetchBookingByIdApi = async (
  setLoading: TReactSetState<boolean>,
  setBookingDetails: TReactSetState<IBookingDetails | undefined>,
  id: number
) => {
  setLoading(true);
  try {
    const bookingListResult = await GET_BOOKING_BY_ID(id);
    if (
      bookingListResult &&
      bookingListResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setBookingDetails(bookingListResult.data);
    } else {
      toastError(bookingListResult.message);
    }
  } catch {
    toastError(MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
  } finally {
    setLoading(false);
  }
};

export const bookingCancelChargeApiCall = async (
  setBookingChargeLoading: TReactSetState<boolean>,
  handleOpenModal: (refundPercentage: number, refundableAmount: number) => void,
  id: number
) => {
  setBookingChargeLoading(true);
  try {
    const bookingCancelChargeResult = await BOOKING_CANCELLATION_CHARGE_BY_ID(
      id
    );
    if (
      bookingCancelChargeResult &&
      bookingCancelChargeResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      handleOpenModal(
        bookingCancelChargeResult.data.refund_percentage,
        bookingCancelChargeResult.data.refundable_amount
      );
    } else {
      toastError(bookingCancelChargeResult.message);
    }
  } catch {
    toastError(MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
  } finally {
    setBookingChargeLoading(false);
  }
};

export const bookingCancelApiCall = async (
  reason: string,
  id: number,
  navigate: NavigateFunction
) => {
  try {
    const bookingCancelResult = await ADD_CANCEL_BOOKING_REASON(id, {
      cancellation_reason: reason,
    });
    if (
      bookingCancelResult &&
      bookingCancelResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(bookingCancelResult.message);
      navigate(userRoute.bookingList);
    } else {
      toastError(bookingCancelResult.message);
    }
  } catch {
    toastError(MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
  }
};
