import { title } from "process";
import { TReactSetState } from "../../data/AppType";
import { GET_ALL_FAVORITES } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { FAV_TABS, IS_FAV } from "../../utils/AppEnumerations";
import { handleLibraryFileType, toastError } from "../../utils/AppFunctions";
import { ILibrary } from "../library/LibraryController";
export interface IFavorites {
  cover_image_path: string;
  entity_id: number;
  fav_item: string;
  lc_file_type: number | null;
  entity_type: number;
  lc_file_path: string;
  file_type?: number;
  is_premium: string;
  description: string;
  price: string;
  discounted_price: string;
  has_subscribed: string;
  transaction_charge: string | null;
  tax: string | null;
  is_directory: string | null;
  is_fav: string;
  fav_item_cost: string;
}

export const fetchFavoritesApi = async (
  setFavoriteServiceList: TReactSetState<IFavorites[]>,
  setFavoriteLibraryList: TReactSetState<ILibrary[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const favoritesList = await GET_ALL_FAVORITES();

    if (favoritesList && favoritesList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      favoritesList.data &&
        favoritesList.data.length > 0 &&
        favoritesList.data.filter(
          (item: IFavorites) => item.entity_type === FAV_TABS.services
        ).length > 0 &&
        setFavoriteServiceList(
          favoritesList.data
            .filter(
              (item: IFavorites) => item.entity_type === FAV_TABS.services
            )
            .map((item: IFavorites) => ({
              ...item,
              is_fav: IS_FAV.isTrue,
            }))
        );
      favoritesList.data &&
        favoritesList.data.length > 0 &&
        favoritesList.data.filter(
          (item: IFavorites) => item.entity_type === FAV_TABS.library
        ).length > 0 &&
        setFavoriteLibraryList(
          favoritesList.data
            .filter((item: IFavorites) => item.entity_type === FAV_TABS.library)
            .map((item: IFavorites) => ({
              ...item,
              title: item.fav_item,
              file_type: handleLibraryFileType(
                item.lc_file_type ? item.lc_file_type : 0
              ),
              object_id: item.entity_id,
              file_path: item.lc_file_path,
              is_fav: IS_FAV.isTrue,
            }))
        );
    } else {
      toastError(favoritesList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.favoritesList?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
