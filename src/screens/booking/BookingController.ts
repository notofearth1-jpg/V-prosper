import moment from "moment";
import { TReactSetState } from "../../data/AppType";
import {
  ADD_SERVICE_BOOKING,
  GET_ALL_SERVICE_DATE,
  GET_BOOKING_SUMMARY,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { DAYS_Of_WEEK, SERVICE_TYPE } from "../../utils/AppEnumerations";
import { getLocalDate, toastError } from "../../utils/AppFunctions";

export interface IBookingService {
  service_id: number;
  date: string;
  slot: string;
}

export interface ISlotDate {
  schedule_date: string;
  schedule_time: string[];
}

export interface IBookingSummary {
  cost: number;
  discount_cost: number;
  transaction_charge: number;
  total_amount: number;
  tax: number;
}

export interface IOrder {
  order_id: string;
  currency: string;
  amount: number;
  description: string;
  name: string;
  contact_number: string;
}

export const fetchServiceDate = async (
  setChunkedDates: TReactSetState<ISlotDate[][]>,
  setSelectedDate: TReactSetState<string | null>,
  serviceId: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const dateList = await GET_ALL_SERVICE_DATE(serviceId);
    if (dateList && dateList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (dateList.data.length > 0) {
        setChunkedDates(processDates(dateList.data));
        setSelectedDate(dateList.data[0].schedule_date);
      }
    } else {
      toastError(dateList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const serviceBooking = async (
  bookingInfo: IBookingService,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const bookingData = await ADD_SERVICE_BOOKING(bookingInfo);
    if (bookingData && bookingData.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return bookingData.data;
    } else {
      return bookingData.data;
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchBookingSummary = async (
  setBookingSummary: TReactSetState<IBookingSummary | undefined>,
  serviceId: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const bookingSummary = await GET_BOOKING_SUMMARY(serviceId);
    if (bookingSummary && bookingSummary.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setBookingSummary(bookingSummary.data);
    } else {
      toastError(bookingSummary.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const getDayOfWeek = (dateString: string): string => {
  const daysOfWeek: string[] = [
    DAYS_Of_WEEK.Sunday,
    DAYS_Of_WEEK.Monday,
    DAYS_Of_WEEK.Tuesday,
    DAYS_Of_WEEK.Wednesday,
    DAYS_Of_WEEK.Thursday,
    DAYS_Of_WEEK.Friday,
    DAYS_Of_WEEK.Saturday,
  ];
  const date: Date = getLocalDate(dateString);
  return daysOfWeek[date.getDay()];
};

export const calculateEndDate = (
  startDate: string,
  duration: number
): string => {
  const endDate = moment(startDate).add(duration - 1, "days");
  return endDate.format("DD MMM YYYY");
};

export const processDates = (
  availableDates: ISlotDate[],
  chunkSize: number = 7
) => {
  // Sort the data by date
  const sortedData = availableDates.sort(
    (a, b) =>
      getLocalDate(a.schedule_date).getTime() -
      getLocalDate(b.schedule_date).getTime()
  );

  // Group data by month
  const groupedByMonth = sortedData.reduce<Record<string, ISlotDate[]>>(
    (acc, item) => {
      const month = item.schedule_date.slice(0, 7); // Extract the 'YYYY-MM' part of the date
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(item);
      return acc;
    },
    {}
  );

  // Split each month's data into chunks of 7 dates
  const splitDates: ISlotDate[][] = Object.keys(groupedByMonth).reduce<
    ISlotDate[][]
  >((acc, month) => {
    const monthData = groupedByMonth[month];
    for (let i = 0; i < monthData.length; i += chunkSize) {
      acc.push(monthData.slice(i, i + chunkSize));
    }
    return acc;
  }, []);

  return splitDates;
};

export const getScheduleByDate = (
  data: ISlotDate[][],
  schedule_date: string
): ISlotDate | undefined => {
  // Sort schedule times for each date
  data.forEach((week) => {
    week.forEach((day) => {
      day.schedule_time.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a}`).getTime();
        const timeB = new Date(`1970/01/01 ${b}`).getTime();
        return timeA - timeB;
      });
    });
  });

  // Find and return the schedule for the given date
  for (const week of data) {
    for (const day of week) {
      if (day.schedule_date === schedule_date) {
        return day;
      }
    }
  }

  return undefined;
};

// Helper function to add minutes to a given Date object
const addMinutes = (date: Date, minutes: number): Date => {
  return getLocalDate(date.getTime() + minutes * 60000);
};

// Helper function to format Date object to 'hh:mm AM/PM' string
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Main function to calculate the end time
export const calculateEndTime = (
  startTime: string,
  durationMinutes: number
): string => {
  const [time, modifier] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = addMinutes(startDate, durationMinutes);
  return formatTime(endDate);
};
