import { serviceMaker } from "..";
import { IPagination, ISearch } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_INSIGHTS = (
  payload: IPagination,
  config: { id?: number | null; search?: ISearch; trendFlag?: boolean } = {}
) => {
  const { id, search, trendFlag } = config;
  const url = `${API_ENDPOINTS.get_all_insights.url}?ad=true${
    trendFlag ? "&type=T" : ""
  }${search?.enterpriseSearch ? `&query=${search?.enterpriseSearch}` : ""}${
    trendFlag ? "" : id ? `&cid=${id}` : ""
  }&currentPage=${payload.current_page}&perPageRows=${
    payload.per_page_rows
  }&sortBy=${payload.sort_by}&orderBy=${payload.order_by}`;

  return serviceMaker(url, API_ENDPOINTS.get_all_insights.method);
};

export const GET_ALL_INSIGHTS_BY_ID = (id: number) => {
  return serviceMaker(
    API_ENDPOINTS.get_all_insights.url + `/${id}`,
    API_ENDPOINTS.get_all_insights.method
  );
};

export const GET_ALL_INSIGHTS_CATEGORY_PUBLIC = (payload: IPagination) => {
  return serviceMaker(
    API_ENDPOINTS.get_all_insights_category.url +
      "?ad=true" +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_all_insights_category.method
  );
};
