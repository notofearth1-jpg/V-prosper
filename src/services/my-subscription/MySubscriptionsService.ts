import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_MY_SUBSCRIPTION_PACKAGES = (
  query: string,
  pagination: IPagination
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_my_subscriptions_packages.url +
      `?${query ? `type=${query}` : ""}&currentPage=${
        pagination.current_page
      }&perPageRows=${pagination.per_page_rows}`,
    API_ENDPOINTS.get_all_my_subscriptions_packages.method
  );
