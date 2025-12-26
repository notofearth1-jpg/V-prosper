import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { IBookingService } from "../../screens/booking/BookingController";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_SERVICE_DATE = (serviceId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_service_dates.url + `?service_id=${serviceId}`,
    API_ENDPOINTS.get_service_dates.method
  );

export const ADD_SERVICE_BOOKING = (payload: IBookingService) =>
  serviceMaker(
    API_ENDPOINTS.add_service_booking.url,
    API_ENDPOINTS.add_service_booking.method,
    payload
  );

export const GET_BOOKING_SUMMARY = (serviceId: number) =>
  serviceMaker(
    `service/${serviceId}` + "/" + API_ENDPOINTS.get_booking_summary.url,
    API_ENDPOINTS.get_booking_summary.method
  );

export const GET_ALL_TRANSCTION = (
  payload: IPagination,
  transactionType?: string,
  transactionFor?: string,
  fromDate?: string,
  toDate?: string,
  transactionStatus?: number
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_transaction.url +
      "?ad=true" +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      (transactionType ? `&tt=${transactionType}` : "") +
      (transactionFor ? `&et=${transactionFor}` : "") +
      (fromDate ? `&fd=${fromDate}` : "") +
      (toDate ? `&td=${toDate}` : "") +
      (transactionStatus ? `&ts=${transactionStatus}` : "") +
      payload.sort_by,
    API_ENDPOINTS.get_all_transaction.method
  );

export const GET_TRANSCTION_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_transaction.url + `/${id}`,
    API_ENDPOINTS.get_all_transaction.method
  );
