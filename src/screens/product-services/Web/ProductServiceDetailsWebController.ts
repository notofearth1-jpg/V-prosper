import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { sweetAlertError, toastError } from "../../../utils/AppFunctions";
import { GET_FAQ_BY_ID, GET_SERVICE_BY_ID } from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { ISCC } from "../../booking/booking-cancellation/BookingCancellationController";
import {
  CHECK_FREE_BOOKING,
  RELATED_SERVICE,
} from "../../../services/product-services/product-service-table/ProductServiceTableService";
import { NavigateFunction } from "react-router-dom";
import { userRoute } from "../../../routes/RouteUser";
import { IServiceByCategory } from "../../header/home-page/HomePageController";

export interface IServiceForSubCategory {
  service_discounted_price: number;
  service_title: string;
  service_desc: string;
  service_duration: number;
  app_media: { media_url: string; media_type: string }[];
  id: number;
  service_pros: [];
  service_precautions: [];
  service_other_notes: [];
  service_tags: [];
  feedback_tags: string;
  service_params: [];
  service_age_min_criteria: number;
  service_cost: string;
  cancellation_cutoff_time_hours: number;
  service_days: [];
  SCC: ISCC[];
  interval_unit_types: {
    unit_type_text: string;
  };
  service_rating: { total_reviews: string; average_rating: number }[];
  is_offline: string;
  is_gender_specific: string;
  is_peer_to_peer: string;
  session_duration: number;
}

export interface IFaqs {
  question: string;
  answer: string;
  tags: [];
  is_active: string;
  deleted: string;
  id: number;
  reference_links: [];
}

export interface ICheckFreeBookingAttempts {
  data: string;
  message: string;
}

export const fetchServiceForSubCategoryApi = async (
  setGetServiceForSubCategory: TReactSetState<IServiceForSubCategory | null>,
  setLoading: TReactSetState<boolean>,
  id: number,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const serviceId = await GET_SERVICE_BY_ID(id);

    if (serviceId && serviceId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setGetServiceForSubCategory(serviceId.data);
    } else {
      toastError(serviceId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.serviceId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchFaqsApi = async (
  setGetFaqs: TReactSetState<IFaqs[]>,
  setLoading: TReactSetState<boolean>,
  id: number,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const faqId = await GET_FAQ_BY_ID(id);

    if (faqId && faqId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setGetFaqs(faqId.data);
    } else {
      toastError(faqId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.faqId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const checkFreeBooking = async (
  setFreeBookingAttempts: TReactSetState<ICheckFreeBookingAttempts | null>,
  navigation: NavigateFunction,
  setLoading: TReactSetState<boolean>,
  id: number
) => {
  try {
    setLoading(true);
    const checkFreeBookingAttempt = await CHECK_FREE_BOOKING(id);

    if (
      checkFreeBookingAttempt &&
      checkFreeBookingAttempt.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      navigation(userRoute.slotBooking, { state: { id: id } });
    } else if (checkFreeBookingAttempt.data.data === "MaxFreeAttempts") {
      setFreeBookingAttempts(checkFreeBookingAttempt.data);
    } else {
      return sweetAlertError(
        checkFreeBookingAttempt.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(error?.responce?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const getAllRelatedService = async (
  setRelatedServicesList: TReactSetState<IServiceForSubCategory[]>,
  setLoading: TReactSetState<boolean>,
  id: number
) => {
  try {
    setLoading(true);

    const serviceList = await RELATED_SERVICE(id);
    if (serviceList && serviceList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelatedServicesList(serviceList.data);
    } else {
      sweetAlertError(serviceList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
