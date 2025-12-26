import { TReactSetState } from "../../data/AppType";
import { GET_REPORT_BY_ID } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { toastError } from "../../utils/AppFunctions";

export interface IRevenueReport {
  p_service_revenue_growth_percentage: number;
  p_service_current_month_revenue: number;
  p_total_revenue: number;
}

export interface ISessionReport {
  p_session_growth_percentage: number;
  p_current_month_sessions: number;
  p_total_sessions: number;
}

export interface IMonthlyRevenueReport {
  month: 4;
  year: 2024;
  offline_revenue: "0";
  online_revenue: "0";
}

export interface ITopServicesReport {
  p_service_title: string;
  p_total_bookings: number;
  p_popularity_percentage: number;
}

export interface ICategoryWiseSession {
  category_title: string;
  total_sessions: number;
}

export interface ITrainerRatingReport {
  average_rating: number;
  month: number;
  total_rating: number;
  year: number;
}

export const getReportById = async (
  reportId: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const resReport = await GET_REPORT_BY_ID(reportId);
    if (resReport && resReport.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return resReport.data;
    } else {
      toastError(resReport.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resReport?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }

  return null;
};
