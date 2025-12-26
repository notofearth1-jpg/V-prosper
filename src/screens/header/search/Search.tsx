import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../../routes/RouteUser";
import {
  ISearch,
  ISearchHistory,
  ISearchResults,
  fetchSearchApi,
  fetchSearchHistoryApi,
} from "./SearchController";
import {
  recentSearchIcon,
  trendingSearchIcon,
} from "../../../assets/icons/SvgIconList";
import SearchResult from "./SearchResult";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import SearchBar from "../../../components/common/SearchBar";
import { SEARCH_CATEGORY, USER_ROLE } from "../../../utils/AppEnumerations";
import { isMobileDevice } from "../../../utils/AppFunctions";
import { ILibrary } from "../../library/LibraryController";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { routeTrainer } from "../../../routes/RouteTrainer";
import BackButton from "../../../components/common/BackButton";

interface ISearchProps {
  onClose?: () => void;
}

const Search: React.FC<ISearchProps> = ({ onClose }) => {
  const userRole = Number(localStorageUtils.getRole());
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  let timer: NodeJS.Timeout;
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState<ISearch>();
  const [searchResult, setSearchResult] = useState<ISearchResults[]>([]);
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const isMobile = isMobileDevice();
  useEffect(() => {
    fetchSearchHistoryApi(setSearchHistory, setLoading);
  }, []);

  const fetchSearch = (searchValue: string) => {
    if (searchValue.length > 0) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setSearch(encodeURIComponent(searchValue));
        fetchSearchApi(
          searchValue,
          setSearchResult,
          setLibraryList,
          setSearchLoading
        );
      }, 500);
    } else {
      setSearch(searchValue);
    }
  };

  const handleServiceNavigate = (value: ISearchHistory) => {
    navigate(userRoute.serviceDetails, {
      state: { id: value.entity_record_id },
    });
    onClose && onClose();
  };

  const handleBlogNavigate = (value: ISearchHistory) => {
    navigate(
      userRole === USER_ROLE.Trainer
        ? routeTrainer.postDetail
        : userRoute.postDetail,
      {
        state: {
          id: value.entity_record_id,
          object: value,
        },
      }
    );
    onClose && onClose();
  };
  const handleLibraryNavigate = (value: ISearchHistory) => {
    navigate(
      value.search_category === SEARCH_CATEGORY.LibraryContent
        ? userRole === USER_ROLE.Trainer
          ? routeTrainer.libraryDetails
          : userRoute.libraryDetails
        : userRole === USER_ROLE.Trainer
        ? routeTrainer.folderDetail
        : userRoute.folderDetail,
      {
        state: {
          id: value.entity_record_id,
          object: value,
          sp: false,
        },
      }
    );
    onClose && onClose();
  };

  const handleSearchedNavigate = (value: ISearchHistory) => {
    value.search_category === SEARCH_CATEGORY.Service
      ? handleServiceNavigate(value)
      : value.search_category === SEARCH_CATEGORY.Blog
      ? handleBlogNavigate(value)
      : handleLibraryNavigate(value);
  };

  return (
    <>
      <div
        className={`${
          isMobile ? "h-svh" : "h-[80vh]"
        }  w-full comman-padding flex flex-col`}
      >
        <div className="flex space-x-3.5">
          {isMobile && (
            <div className="flex items-center">
              <BackButton />
            </div>
          )}
          <div className="w-full">
            <SearchBar disableSearch={false} setSearch={fetchSearch} />
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex-1 overflow-auto">
            {search.length < 1 &&
              searchHistory &&
              searchHistory.recentSearch &&
              searchHistory.recentSearch.length > 0 && (
                <>
                  <div className="top comman-black-big">
                    <p>{t("recent_search")}</p>
                  </div>
                  <div className="mt-2 gap-4 recent-container w-full flex flex-wrap">
                    {searchHistory.recentSearch.map((value, index) => (
                      <div
                        className="recent-box flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          handleSearchedNavigate(value);
                        }}
                        key={index}
                      >
                        <div className="h-5 w-5 svg-color">
                          {recentSearchIcon}
                        </div>

                        <p className="comman-black-text mx-2">
                          {value.search_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            {search.length < 1 &&
              searchHistory &&
              searchHistory.trandingSearch &&
              searchHistory.trandingSearch.length > 0 && (
                <>
                  <div className="top comman-black-big">
                    <p>{t("trending_search")}</p>
                  </div>
                  <div className="mt-2 gap-4 recent-container w-full flex flex-wrap">
                    {searchHistory.trandingSearch.map((value, index) => (
                      <div
                        onClick={() => {
                          handleSearchedNavigate(value);
                        }}
                        className="recent-box flex items-center justify-center cursor-pointer"
                        key={index}
                      >
                        <div className="h-5 w-5 svg-color">
                          {trendingSearchIcon}
                        </div>
                        <p className="comman-black-text mx-2">
                          {value.search_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

            {search.length > 0 && (
              <SearchResult
                libraryList={libraryList}
                setLibraryList={setLibraryList}
                onClose={onClose}
                searchResult={searchResult}
                searchLoading={searchLoading}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
