import { serviceMaker } from "..";

import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export interface IUserFavoritePayload {
  entity_type: number;
  entity_id: number;
  is_directory?: string | null;
}

export const ADD_FAVORITE = (payload: IUserFavoritePayload) =>
  serviceMaker(
    API_ENDPOINTS.add_user_favorite.url,
    API_ENDPOINTS.add_user_favorite.method,
    payload
  );

export const GET_ALL_FAVORITES = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_user_favorites.url,
    API_ENDPOINTS.get_all_user_favorites.method
  );
