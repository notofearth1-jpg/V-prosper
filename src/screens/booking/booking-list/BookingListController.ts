import { IPagination } from "../../../data/AppInterface";
import { TReactSetState, TSetPaginationFn } from "../../../data/AppType";
import { GET_ALL_BOOKINGS } from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED,
} from "../../../utils/AppConstants";
import {
  toastError,
  generatePaginationFromApiRes,
  resetPaginationWithPpr,
  getLocalDate,
} from "../../../utils/AppFunctions";

export interface IBookingList {
  id: number;
  is_offline: string;
  booking_date: string;
  schedule_time: string;
  schedule_start_date: string;
  schedule_end_date: string;
  service_id: number;
  service_title: string;
  service_media_url: string;
  trainer_id: number | null;
  trainer_name: string | null;
  service_cost: string;
  booking_status_label: string;
  service_discounted_price: string | null;
  booking_status: number;
  cancellation_reason: string | null;
  booking_number: string;
  session_id: number | null;
  meeting_link: string;
}

export const calculateDaysLeft = (scheduleDateStr: string): number => {
  const scheduleDateTime: Date = getLocalDate(scheduleDateStr);
  const currentDate: Date = getLocalDate();

  const differenceMs: number =
    scheduleDateTime.getTime() - currentDate.getTime();
  const daysLeft: number = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export const fetchBookingListApi = async (
  setOverAllBookingSpend: TReactSetState<string>,
  setLoading: TReactSetState<boolean>,
  setBookingList: TReactSetState<IBookingList[]>,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  bookingList: IBookingList[]
) => {
  setLoading(true);
  try {
    const upComingBookings = false;
    const bookingListResult = await GET_ALL_BOOKINGS(
      upComingBookings,
      pagination
    );
    if (
      bookingListResult &&
      bookingListResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (bookingList && bookingList.length > 0) {
        setOverAllBookingSpend(bookingListResult.data.overall_booking_spent);
        setBookingList([...bookingList, ...bookingListResult?.data?.item]);
      } else setBookingList(bookingListResult.data.item);
      setOverAllBookingSpend(bookingListResult.data.overall_booking_spent);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(bookingListResult.data.pagination),
      });
    } else {
      setBookingList([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
      toastError(bookingListResult.message);
    }
  } catch {
    toastError(MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
  } finally {
    setLoading(false);
  }
};
