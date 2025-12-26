import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userRoute } from "../../../routes/RouteUser";
import { ISearchResults, addRecentSearchHistoryApi } from "./SearchController";
import {
  FILE_TYPE,
  IS_PREMIUM,
  IS_SUBSCRIBED,
  SEARCH_CATEGORY,
  SEARCH_SUB_TABS,
  SEARCH_TABS,
  USER_ROLE,
} from "../../../utils/AppEnumerations";
import ICImage from "../../../core-component/ICImage";
import LibraryOpenType from "../../library/LibraryOpenType";
import { isMobileDevice } from "../../../utils/AppFunctions";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { ILibrary } from "../../library/LibraryController";
import Loader from "../../../components/common/Loader";
import ShrinkText from "../../../components/common/ShrinkText";
import { TReactSetState } from "../../../data/AppType";
import { searchSubTabItems, searchTabItems } from "../../../utils/AppConstants";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { routeTrainer } from "../../../routes/RouteTrainer";
interface ISearchResultProps {
  searchLoading: boolean;
  searchResult: ISearchResults[];
  setLibraryList: TReactSetState<ILibrary[]>;
  libraryList: ILibrary[];
  onClose?: () => void;
}
const SearchResult: React.FC<ISearchResultProps> = ({
  searchResult,
  searchLoading,
  libraryList,
  setLibraryList,
  onClose,
}) => {
  const userRole = Number(localStorageUtils.getRole());
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [activeTab, setActiveTab] = useState(
    location.pathname === userRoute.library ||
      location.pathname === routeTrainer.library
      ? SEARCH_TABS.Library
      : userRole === USER_ROLE.Customer
      ? SEARCH_TABS.Services
      : SEARCH_TABS.Blogs
  );
  const [activeSubTab, setActiveSubTab] = useState(SEARCH_SUB_TABS.All);
  let filteredSearchTabItems =
    userRole === USER_ROLE.Customer ? searchTabItems : searchTabItems.slice(1);
  const filteredObjects =
    libraryList && libraryList.length > 0
      ? libraryList.filter((object) => {
          if (activeSubTab === SEARCH_SUB_TABS.All) {
            return true;
          } else {
            return object.file_type === activeSubTab;
          }
        })
      : libraryList;

  return (
    <>
      <div className="top">
        <div className="text-sm font-medium text-center border-b border-skin-favorite-color">
          <ul
            className={`flex justify-${
              isMobileDevice() ? "between" : "start"
            } -mb-px p-0 list-none`}
          >
            {filteredSearchTabItems.map((value, index) => (
              <li className="me-2 cursor-pointer" key={index}>
                <div
                  onClick={() => setActiveTab(value.value)}
                  className={`inline-block p-4 active-text cursor  rounded-t-lg  ${
                    activeTab === value.value && "active-border active"
                  }`}
                  aria-current="page"
                >
                  {t(value.label)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {activeTab === SEARCH_TABS.Library && (
          <div className="top">
            <ul className="flex justify-between  text-center comman-black-text overflow-x-scroll p-0 list-none">
              {searchSubTabItems.map((value, index) => (
                <li key={index} className="me-2 cursor-pointer">
                  <div
                    onClick={() => setActiveSubTab(value.value)}
                    className={`inline-block px-4 py-3 rounded-lg cursor ${
                      activeSubTab === value.value && "active"
                    } `}
                  >
                    {t(value.label)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {searchLoading ? (
        <Loader />
      ) : (
        activeTab === SEARCH_TABS.Blogs &&
        searchResult &&
        searchResult.length > 0 &&
        searchResult[0].blogs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 ">
            {searchResult[0].blogs.map((value, index) => (
              <div
                className="top flex items-center cursor-pointer"
                key={index}
                onClick={() => {
                  addRecentSearchHistoryApi(
                    {
                      search_text: value.blog_title,
                      search_category: SEARCH_CATEGORY.Blog,
                      entity_record_id: value.id,
                    },

                    true,
                    onClose
                  );
                  navigate(
                    userRole === USER_ROLE.Trainer
                      ? routeTrainer.postDetail
                      : userRoute.postDetail,
                    {
                      state: { id: value.id, object: value },
                    }
                  );
                }}
              >
                <div className="search-img-box flex items-center justify-center">
                  <div className="">
                    <ICImage
                      height={60}
                      width={60}
                      imageUrl={value.cover_image}
                      alt={value.blog_title}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="mx-3 flex flex-col items-center">
                  <div className="comman-black-text">
                    <ShrinkText text={value.blog_title} maxLength={25} />
                    <div className="flex"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {searchLoading ? (
        <Loader />
      ) : (
        activeTab === SEARCH_TABS.Services &&
        searchResult &&
        searchResult.length > 0 &&
        searchResult[0].services && (
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {searchResult[0].services.map((value, index) => (
              <div
                className="top flex items-center cursor-pointer"
                key={index}
                onClick={() => {
                  addRecentSearchHistoryApi(
                    {
                      search_text: value.service_title,
                      search_category: SEARCH_CATEGORY.Service,
                      entity_record_id: value.service_id,
                    },
                    true,
                    onClose
                  );
                  navigate(userRoute.serviceDetails, {
                    state: { id: value.service_id },
                  });
                }}
              >
                <div className="search-img-box flex items-center justify-center ">
                  <div className="">
                    <ICImage
                      height={60}
                      width={60}
                      imageUrl={value.media_url}
                      alt={value.service_title}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="mx-3 flex flex-col items-center">
                  <div className="comman-black-text">
                    <ShrinkText text={value.service_title} maxLength={25} />

                    <div className="flex"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {searchLoading ? (
        <Loader />
      ) : (
        activeTab === SEARCH_TABS.Library &&
        searchResult.length > 0 &&
        searchResult[0].library_directory_content &&
        searchResult[0].library_directory_content.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 top">
            {filteredObjects.map((value, index) => (
              <div
                className="w-full aspect-16/9 object-contain cursor"
                key={index}
                onClick={() =>
                  addRecentSearchHistoryApi(
                    {
                      search_text: value.title,
                      search_category:
                        value.file_type === FILE_TYPE.DIRECTORY
                          ? SEARCH_CATEGORY.LibraryDirectory
                          : SEARCH_CATEGORY.LibraryContent,
                      entity_record_id: value.object_id,
                    },
                    value.is_premium === IS_PREMIUM.Yes &&
                      value.has_subscribed === IS_SUBSCRIBED.No
                      ? false
                      : true,
                    onClose
                  )
                }
              >
                <LibraryOpenType
                  libraryList={libraryList}
                  setLibraryList={setLibraryList}
                  itemArray={value}
                  childClass="w-full"
                  index={index}
                />
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default SearchResult;
