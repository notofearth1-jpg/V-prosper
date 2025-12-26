import { TReactSetState } from "../../../data/AppType";
import {
  ADD_RECENT_SEARCH_HISTORY,
  GET_ALL_SEARCH_HISTORY,
  GET_ALL_SEARCH_RESULT,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { toastError } from "../../../utils/AppFunctions";
import { ILibrary } from "../../library/LibraryController";

export interface ISearchHistory {
  search_text: string;
  search_category: number;
  entity_record_id: number;
}
export interface ISearch {
  recentSearch: ISearchHistory[];
  trandingSearch: ISearchHistory[];
}

export interface ISearchResultsService {
  service_id: number;
  service_title: string;
  media_url: string;
  average_rating: number;
  total_reviews: number;
}
export interface ISearchResultsBlog {
  id: number;
  blog_title: string;
  cover_image: string;
  slug: string;
  post_anonymously: string;
  created_by: number;
  created_by_name: string;
  publish_date: string;
}
export interface ISearchResultsLibrary {
  object_id: number;
  parent_directory_id: number;
  file_type: string;
  title: string;
  file_path: string;
  cover_image_path: string;
  is_premium: string;
  has_subscribed: string;
  price: string;
  discounted_price: string | null;
  transaction_charge: string | null;
  tax: string | null;
  is_fav?: string;
  description: string;
}

export interface ISearchResults {
  services: ISearchResultsService[];
  blogs: ISearchResultsBlog[];
  library_directory_content: ISearchResultsLibrary[];
}

export interface IRecentSearchAdd {
  search_text: string;
  search_category: number;
  entity_record_id: number;
}

export const fetchSearchHistoryApi = async (
  setSearchHistory: TReactSetState<ISearch | undefined>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const searchHistoryResult = await GET_ALL_SEARCH_HISTORY();
    if (
      searchHistoryResult &&
      searchHistoryResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setSearchHistory(searchHistoryResult.data);
    } else {
      setSearchHistory(undefined);
      toastError(searchHistoryResult.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchSearchApi = async (
  search: string,
  setSearchResult: TReactSetState<ISearchResults[]>,
  setLibraryList: TReactSetState<ILibrary[]>,
  setLoading: TReactSetState<boolean>
) => {
  setLoading(true);
  try {
    const searchResult = await GET_ALL_SEARCH_RESULT(search);
    if (searchResult && searchResult.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setSearchResult(searchResult.data);
      setLibraryList(searchResult.data[0].library_directory_content);
    } else {
      setSearchResult([]);
      toastError(searchResult.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const addRecentSearchHistoryApi = async (
  value: IRecentSearchAdd,
  closeModal: boolean,
  onClose?: () => void
) => {
  try {
    const addRecentSearch = await ADD_RECENT_SEARCH_HISTORY(value);
    if (
      addRecentSearch &&
      addRecentSearch.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      closeModal && onClose && onClose();
    } else {
      toastError(addRecentSearch.message);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
