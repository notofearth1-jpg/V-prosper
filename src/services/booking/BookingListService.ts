import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_BOOKINGS = (
  upComingBookings: boolean,
  pagination?: IPagination
) => {
  return serviceMaker(
    API_ENDPOINTS.get_all_bookings.url +
      `?${
        pagination
          ? `currentPage=${pagination.current_page}&perPageRows=${pagination.per_page_rows}&orderBy=${pagination.order_by}&sortBy=${pagination.sort_by}&`
          : ""
      }up=${upComingBookings}`,
    API_ENDPOINTS.get_all_bookings.method
  );
};

export const GET_BOOKING_BY_ID = (id: number) => {
  return serviceMaker(
    API_ENDPOINTS.get_booking_by_id.url + `/${id}`,

    API_ENDPOINTS.get_booking_by_id.method
  );
};
export const BOOKING_CANCELLATION_CHARGE_BY_ID = (id: number) => {
  return serviceMaker(
    API_ENDPOINTS.booking_cancellation_charge.url + `/${id}`,
    API_ENDPOINTS.booking_cancellation_charge.method
  );
};
export const ADD_CANCEL_BOOKING_REASON = (
  id: number,
  payload: { cancellation_reason: string }
) => {
  return serviceMaker(
    API_ENDPOINTS.cancel_booking_reason.url + `/${id}`,
    API_ENDPOINTS.cancel_booking_reason.method,
    payload
  );
};
