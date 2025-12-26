import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { getLocalDate, toastError } from "../../../utils/AppFunctions";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import {
  GET_ALL_BOOKINGS,
  GET_ALL_EVENTS,
  GET_ALL_SERVICE_CATEGORY_FOR_DISCOVER,
  GET_ALL_SERVICE_CATEGORY_FOR_TREND,
  GET_EVENT_BY_ID,
} from "../../../services/Endpoints";
import { IServiceForSubCategory } from "../../product-services/Web/ProductServiceDetailsWebController";
import { IBookingList } from "../../booking/booking-list/BookingListController";
import {
  GET_ALL_FREE_SERVICE,
  GET_ALL_SERVICE_BY_CATEGORY,
  GET_ALL_SERVICE_BY_CATEGORY_ID,
} from "../../../services/product-services/product-service-table/ProductServiceTableService";
export interface IEvent {
  id: number;
  title: string;
  description: string;
  app_media: {
    media_url: string;
    media_type: string;
  }[];
  event_start_date: string;
  event_start_time: string;
  event_end_date: string;
  event_end_time: string;
  venue: string;
  is_paid_event: string;
  registration_fee: string;
  has_subscribed: string;
  registration_required: string;
  transaction_charge: string | null;
  tax: string | null;
  payment_summary: {
    cost: number;
    discount_cost: number | null;
    sale_cost: number;
    tax: number | null;
    total_amount: number;
    transaction_charge: number | null;
  } | null;

  venue_lat: null | number;
  venue_long: null | number;
  meeting_link: string | null;
  is_register: string;
}

export const isBookingExpired = (schedule_end_date: string) =>
  getLocalDate() > getLocalDate(schedule_end_date + "T23:59:59");
export const carouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 3,
  },
  smallWidthDesTop: {
    breakpoint: { max: 1280, min: 1025 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1025, min: 464 },
    items: 1.2,
  },

  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const fetchEventsApi = async (
  setEventList: TReactSetState<IEvent[]>,
  setLoadingForEvent: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  nearBy?: boolean
) => {
  try {
    setLoadingForEvent(true);
    const eventList = await GET_ALL_EVENTS(nearBy);

    if (eventList && eventList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setEventList(eventList.data.item);
    } else {
      toastError(eventList.message);
    }
  } catch (error: any) {
    toastError(error?.eventList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoadingForEvent(false);
  }
};

export const fetchEventById = async (
  setEventList: TReactSetState<IEvent | undefined>,
  setLoadingForEvent: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  id: number,
  sp: boolean
) => {
  try {
    setLoadingForEvent(true);
    const eventId = await GET_EVENT_BY_ID(id, sp);

    if (eventId && eventId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setEventList(eventId.data);
    } else {
      toastError(eventId.message);
    }
  } catch (error: any) {
    toastError(error?.setEventList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoadingForEvent(false);
  }
};

export const fetchServiceApi = async (
  setServicesList: TReactSetState<IServiceForSubCategory[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  heading?: string
) => {
  try {
    setLoading(true);
    const trendList = await GET_ALL_SERVICE_CATEGORY_FOR_TREND(heading);

    if (trendList && trendList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesList(trendList.data.item);
    } else {
      toastError(trendList.message);
    }
  } catch (error: any) {
    toastError(error?.trendList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchServiceDiscoverApi = async (
  setServicesDiscoverList: TReactSetState<IServiceForSubCategory[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  heading?: string
) => {
  try {
    setLoading(true);
    const discoverList = await GET_ALL_SERVICE_CATEGORY_FOR_DISCOVER(heading);

    if (discoverList && discoverList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesDiscoverList(discoverList.data.item);
    } else {
      toastError(discoverList.message);
    }
  } catch (error: any) {
    toastError(error?.discoverList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchFreeServiceList = async (
  setFreeServicesList: TReactSetState<IServiceForSubCategory[]>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  heading?: string
) => {
  try {
    setLoading(true);

    const freeServiceList = await GET_ALL_FREE_SERVICE(heading);

    if (
      freeServiceList &&
      freeServiceList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setFreeServicesList(freeServiceList.data.item);
    } else {
      toastError(freeServiceList.message);
    }
  } catch (error: any) {
    toastError(error?.discoverList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchUpComingBookingsApi = async (
  setUpComingBookingsList: TReactSetState<IBookingList[]>,
  setLoading: TReactSetState<boolean>
) => {
  const upComingBookings = true;
  setLoading(true);
  try {
    const upComingBookingsList = await GET_ALL_BOOKINGS(upComingBookings);

    if (
      upComingBookingsList &&
      upComingBookingsList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setUpComingBookingsList(upComingBookingsList.data.item);
    } else {
      toastError(upComingBookingsList.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export interface IServiceByCategory {
  id: number;
  category_title: string;
  service: [
    {
      id: number;
      service_title: string;
      app_media: { media_url: string; media_type: string }[];
      service_cost: string;
    }
  ];
}

export const getAllServiceByCategory = async (
  setServicesByCategoryList: TReactSetState<IServiceByCategory[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const serviceList = await GET_ALL_SERVICE_BY_CATEGORY();
    if (serviceList && serviceList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesByCategoryList(serviceList.data);
    } else {
      toastError(serviceList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const getAllServiceByCategoryId = async (
  setServicesByCategoryIdList: TReactSetState<IServiceForSubCategory[]>,
  setLoading: TReactSetState<boolean>,
  id: number
) => {
  try {
    setLoading(true);

    const serviceList = await GET_ALL_SERVICE_BY_CATEGORY_ID(id);
    if (serviceList && serviceList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesByCategoryIdList(serviceList?.data[0]?.service);
    } else {
      toastError(serviceList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
