import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export interface ITrainerAvailabilityPayload {
  service_id: number;
  // for future update
  // from_date: string;
  // to_date: string;
  is_available: string;
  day_slot_configuration: [
    {
      day: string;
      slot: string[];
    }
  ];
}
export const GET_TRAINER_AVAILABILITY = (
  trainerId: number,
  search: number | undefined,
  historicalCheck: number | undefined,
  pagination: IPagination
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_trainer_availability.url +
      "/" +
      trainerId +
      "/schedule" +
      `?serviceId=${search ? search : ""}&showHistoricalData=${
        historicalCheck ? historicalCheck : ""
      }&currentPage=${pagination.current_page}&perPageRows=${
        pagination.per_page_rows
      }`,
    API_ENDPOINTS.get_all_trainer_availability.method
  );

export const GET_SERVICE_BY_ID_SCHEDULE_INFO = (serviceId: number | null) =>
  serviceMaker(
    API_ENDPOINTS.get_all_service.url + "/" + serviceId + "/schedule-info",
    API_ENDPOINTS.get_all_service.method
  );
export const ADD_TRAINER_AVAILABILITY = (
  trainerId: number | null,
  payload: ITrainerAvailabilityPayload
) =>
  serviceMaker(
    API_ENDPOINTS.add_trainer.url + "/" + trainerId + "/schedule",
    API_ENDPOINTS.add_trainer.method,
    payload
  );

export const UPDATE_TRAINER_AVAILABILITY = (
  trainerId: number | null,
  payload: ITrainerAvailabilityPayload,
  scheduleId?: number
) =>
  serviceMaker(
    API_ENDPOINTS.update_trainer.url +
      "/" +
      trainerId +
      "/schedule" +
      "/" +
      scheduleId,
    API_ENDPOINTS.update_trainer.method,
    payload
  );

export const GET_TRAINER_AVAILABILITY_BY_ID = (
  trainerId: number,
  scheduleId: number
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_trainer_availability.url +
      "/" +
      trainerId +
      "/schedule" +
      "/" +
      scheduleId,
    API_ENDPOINTS.get_all_trainer_availability.method
  );
export const DELETE_TRAINER_AVAILABILITY = (
  trainerId: number,
  scheduleId: number
) =>
  serviceMaker(
    API_ENDPOINTS.delete_trainer_availability.url +
      "/" +
      trainerId +
      "/schedule" +
      "/" +
      scheduleId,
    API_ENDPOINTS.delete_trainer_availability.method
  );

export const GET_TRAINER_APPROVED_SERVICES = () =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_approved_services.url,
    API_ENDPOINTS.get_trainer_approved_services.method
  );
