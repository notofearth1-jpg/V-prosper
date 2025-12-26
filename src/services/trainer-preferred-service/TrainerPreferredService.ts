import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface ITrainerServicePayload {
  serviceCategoryIds: number[];
}

export const GET_ALL_PREFERRED_SERVICES = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_preferred_services.url,
    API_ENDPOINTS.get_all_preferred_services.method
  );

export const GET_REMAINING_PREFERRED_SERVICES = () =>
  serviceMaker(
    API_ENDPOINTS.get_remaining_preferred_services.url,
    API_ENDPOINTS.get_remaining_preferred_services.method
  );

export const ADD_PREFERRED_SERVICE = (payload: ITrainerServicePayload) =>
  serviceMaker(
    API_ENDPOINTS.add_preferred_service.url,
    API_ENDPOINTS.add_preferred_service.method,
    payload
  );

export const DELETE_PREFERRED_SERVICE = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.delete_preferred_service.url + `/${id}`,
    API_ENDPOINTS.delete_preferred_service.method
  );
