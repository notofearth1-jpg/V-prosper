import { TReactSetState } from "../../data/AppType";
import {
  handleLibraryFileType,
  toastError,
  toastSuccess,
} from "../../utils/AppFunctions";
import {
  ADD_FAVORITE,
  GET_ALL_LIBRARY,
  GET_LIBRARY_BY_ID,
  GET_LIBRARY_CONTENT_BY_ID,
  GET_LIBRARY_CONTENT_PAYMENT_SUMMARY,
  GET_LIBRARY_DIRECTORY_BY_ID,
  GET_LIBRARY_DIRECTORY_PAYMENT_SUMMARY,
  GET_LIBRARY_HIERARCHY_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { IUserFavoritePayload } from "../../services/favorites/FavoritesService";
export interface ILibrary {
  object_id: number;
  parent_directory_id?: number;
  file_type: string;
  title: string;
  description?: string;
  is_premium: string;
  duration?: number;
  file_path: string;
  is_fav?: string;
  cover_image_path: string;
  has_subscribed: string;
  price: string;
  discounted_price: string | null;
  transaction_charge: string | null;
  tax: string | null;
  content_tags?: string[];
  root_directory_id: number;
}

export interface ILibraryHierarchy {
  id: number;
  title: string;
}

export interface ILibraryPaymentSummary {
  cost: number;
  discount_cost: number | null;
  sale_cost: number;
  tax: number | null;
  total_amount: number;
  transaction_charge: number | null;
}

export const fetchLibraryById = async (
  setLibraryList: TReactSetState<ILibrary[]>,
  setLoading: TReactSetState<boolean>,
  SA: boolean,
  sp: boolean,
  viewType?: string,
  libraryIdFromFrontend?: number,
  cs?: boolean
) => {
  try {
    setLoading(true);
    const defaultLibraryTrendId = 1; // Default ID to use if no ID is provided from the frontend
    const libraryIdToUse =
      libraryIdFromFrontend !== undefined
        ? libraryIdFromFrontend
        : defaultLibraryTrendId;
    const libraryTrendId = await GET_LIBRARY_BY_ID(
      libraryIdToUse,
      SA,
      sp,
      viewType && viewType,
      cs
    );
    if (libraryTrendId && libraryTrendId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setLibraryList(libraryTrendId.data);
    } else {
      toastError(libraryTrendId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.libraryTrendId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};
export const getAllLibraryItems = async (
  setLoading: TReactSetState<boolean>,
  setLibraryList: TReactSetState<ILibrary[]>,
  SA: boolean,
  viewType: string
) => {
  try {
    const libraryList = await GET_ALL_LIBRARY(SA, viewType);
    if (libraryList && libraryList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setLibraryList(libraryList.data);
    } else {
      toastError(libraryList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.libraryTrendId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const addToFavorite = async (favoritesData: IUserFavoritePayload) => {
  try {
    const resultFavorites = await ADD_FAVORITE(favoritesData);

    if (
      resultFavorites &&
      resultFavorites.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      toastSuccess(resultFavorites.message);
      return true;
    } else {
      toastError(resultFavorites.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      return false;
    }
  } catch (error: any) {
    toastError(
      error?.resultFavorites?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
    return false;
  }
};

export const fetchPaymentSummary = async (
  id: number,
  isFolder: boolean,
  setPaymentSummary: TReactSetState<ILibraryPaymentSummary | null>
) => {
  try {
    let resLibraryPaymentSummary = null;

    if (isFolder) {
      resLibraryPaymentSummary = await GET_LIBRARY_DIRECTORY_PAYMENT_SUMMARY(
        id
      );
    } else {
      resLibraryPaymentSummary = await GET_LIBRARY_CONTENT_PAYMENT_SUMMARY(id);
    }

    if (
      resLibraryPaymentSummary &&
      resLibraryPaymentSummary.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setPaymentSummary(resLibraryPaymentSummary.data);
    } else {
      toastError(
        resLibraryPaymentSummary.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const getLibraryContentById = async (
  id: number,
  setLibraryContentItem: TReactSetState<ILibrary[]>,
  setLoading: TReactSetState<boolean>,
  sp: boolean
) => {
  try {
    const libraryContentResult = await GET_LIBRARY_CONTENT_BY_ID(id, sp);
    if (
      libraryContentResult &&
      libraryContentResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      const libraryContentItem = libraryContentResult.data;
      setLibraryContentItem([
        libraryContentItem && {
          ...libraryContentItem,
          file_type: handleLibraryFileType(
            Number(libraryContentItem?.file_type)
          ),
          object_id: libraryContentItem.id,
          discounted_price: libraryContentItem.content_discounted_price,
          price: libraryContentItem.content_price,
          cover_image_path: libraryContentItem.file_path,
        },
      ]);
    } else {
      setLibraryContentItem([]);
      toastError(libraryContentResult.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
export const getLibraryDirectoryById = async (
  id: number,
  setLibraryContentItem: TReactSetState<ILibrary[]>
) => {
  try {
    const libraryDirectoryResult = await GET_LIBRARY_DIRECTORY_BY_ID(id);
    if (
      libraryDirectoryResult &&
      libraryDirectoryResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      const libraryContentItem = libraryDirectoryResult.data;
      setLibraryContentItem([
        libraryContentItem && {
          ...libraryContentItem,
          file_type: handleLibraryFileType(
            Number(libraryContentItem?.file_type)
          ),
          title: libraryContentItem.directory_name,
          object_id: libraryContentItem.id,
          discounted_price: libraryContentItem.content_discounted_price,
          price: libraryContentItem.content_price,
          cover_image_path: libraryContentItem.file_path,
        },
      ]);
    } else {
      setLibraryContentItem([]);
      toastError(libraryDirectoryResult.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const getLibraryHierarchyById = async (
  setHierarchy: TReactSetState<ILibraryHierarchy[]>,
  id: number
) => {
  try {
    const libraryHierarchyResult = await GET_LIBRARY_HIERARCHY_BY_ID(id);
    if (
      libraryHierarchyResult &&
      libraryHierarchyResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setHierarchy(libraryHierarchyResult.data);
    } else {
      setHierarchy([]);
      toastError(libraryHierarchyResult.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
