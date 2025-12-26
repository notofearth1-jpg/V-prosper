import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface IPremiumPackageBookingPayload {
  entity_type: number;
  entity_record_id: number;
}

export const GET_ALL_LIBRARY = (SA: boolean, type: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_library.url + `?all=${SA}&type=${type}`,
    API_ENDPOINTS.get_all_library.method
  );
export const GET_LIBRARY_CONTENT_BY_ID = (id: number, sp: boolean) =>
  serviceMaker(
    API_ENDPOINTS.get_all_library_content.url +
      `/${id}${sp ? `?sp=${sp}` : ""}`,
    API_ENDPOINTS.get_all_library_content.method
  );
export const GET_LIBRARY_DIRECTORY_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_library_directory.url + `/${id}`,
    API_ENDPOINTS.get_library_directory.method
  );
export const GET_LIBRARY_HIERARCHY_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_library_hierarchy.url + `/${id}`,
    API_ENDPOINTS.get_library_hierarchy.method
  );

export const GET_LIBRARY_BY_ID = (
  id: number,
  SA: boolean,
  sp: boolean,
  type?: string,
  cs?: boolean
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_library.url +
      `/${id}${SA ? `?type=${type}&all=true` : `?type=${type}`}&sp=${sp}${
        cs ? "&cs=true" : ""
      }`,
    API_ENDPOINTS.get_all_library.method
  );

export const GET_ALL_PREMIUM_PACKAGES = (pagination: IPagination) =>
  serviceMaker(
    API_ENDPOINTS.get_all_premium_packages.url +
      `?currentPage=${pagination.current_page}&perPageRows=${pagination.per_page_rows}`,
    API_ENDPOINTS.get_all_premium_packages.method
  );

export const GET_PREMIUM_PACKAGE_BY_ID = (id: number, sp: boolean) =>
  serviceMaker(
    API_ENDPOINTS.get_all_premium_packages.url +
      `/${id}${sp ? `?sp=${sp}` : ""}`,
    API_ENDPOINTS.get_all_premium_packages.method
  );

export const ADD_PREMIUM_PACKAGE_BOOKING = (
  payload: IPremiumPackageBookingPayload
) =>
  serviceMaker(
    API_ENDPOINTS.add_premium_package_booking.url,
    API_ENDPOINTS.add_premium_package_booking.method,
    payload
  );

export const GET_LIBRARY_DIRECTORY_PAYMENT_SUMMARY = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_library_directory_payment_summary.url +
      "/" +
      id +
      "/payment_summary",
    API_ENDPOINTS.get_library_directory_payment_summary.method
  );

export const GET_LIBRARY_CONTENT_PAYMENT_SUMMARY = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_library_content_payment_summary.url +
      "/" +
      id +
      "/payment_summary",
    API_ENDPOINTS.get_library_content_payment_summary.method
  );
