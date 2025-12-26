import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

interface ITrainerLocationsPayload {
  location_ids: number[];
}

export const GET_ALL_PREFERRED_LOCATIONS = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_preferred_locations.url,
    API_ENDPOINTS.get_all_preferred_locations.method
  );

export const GET_REMAINING_PREFERRED_LOCATIONS = () =>
  serviceMaker(
    API_ENDPOINTS.get_remaining_preferred_locations.url,
    API_ENDPOINTS.get_remaining_preferred_locations.method
  );

export const ADD_PREFERRED_LOCATION = (payload: ITrainerLocationsPayload) =>
  serviceMaker(
    API_ENDPOINTS.add_preferred_location.url,
    API_ENDPOINTS.add_preferred_location.method,
    payload
  );

export const DELETE_PREFERRED_LOCATION = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.delete_preferred_location.url + `/${id}`,
    API_ENDPOINTS.delete_preferred_location.method
  );

export const GET_DEFAULT_LOCATION = () =>
  serviceMaker(
    API_ENDPOINTS.get_default_location.url,
    API_ENDPOINTS.get_default_location.method
  );
