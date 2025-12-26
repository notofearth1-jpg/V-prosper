import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILibrary, addToFavorite } from "../library/LibraryController";
import BackButton from "../../components/common/BackButton";
import { IFavorites, fetchFavoritesApi } from "./FavoritesController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  fillHeartIcon,
  flatHeartIcon,
  vpServiceIcon,
} from "../../assets/icons/SvgIconList";
import {
  FAV_TABS,
  IS_FAV,
  IS_FAV_PAYLOAD,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import { userRoute } from "../../routes/RouteUser";
import ICImage from "../../core-component/ICImage";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import FavoriteLibrarySkeleton from "./favorites-skeleton/FavoriteLibrarySkeleton";
import LibraryOpenType from "../library/LibraryOpenType";
import NoData from "../../components/common/NoData";
import ICLable from "../../core-component/ICLable";
const Favorites = () => {
  const userRole = Number(localStorageUtils.getRole());
  const savedTab = sessionStorage.getItem("favoriteActiveTab");
  const [activeTab, setActiveTab] = useState<number>(() => {
    return userRole === USER_ROLE.Customer && savedTab
      ? parseInt(savedTab, 10)
      : userRole === USER_ROLE.Customer
      ? FAV_TABS.services
      : FAV_TABS.library;
  });
  const [loading, setLoading] = useState(true);
  const [favoriteServiceList, setFavoriteServiceList] = useState<IFavorites[]>(
    []
  );
  const [favoriteLibraryList, setFavoriteLibraryList] = useState<ILibrary[]>(
    []
  );
  const navigate = useNavigate();
  const { t } = UseTranslationHook();

  useEffect(() => {
    fetchFavoritesApi(
      setFavoriteServiceList,
      setFavoriteLibraryList,
      setLoading
    );
  }, []);

  const removeFavorites = async (item: IFavorites) => {
    const payload = {
      entity_type: item.entity_type,
      entity_id: item?.entity_id,
      is_fav:
        item.is_fav == IS_FAV_PAYLOAD.isTrue
          ? IS_FAV_PAYLOAD.isFalse
          : IS_FAV_PAYLOAD.isTrue,
      is_directory: item.file_type === 1 ? IS_FAV.isTrue : null,
    };

    var isStatusChange = await addToFavorite(payload);
    if (isStatusChange) {
      const updatedLibraryList =
        favoriteServiceList &&
        favoriteServiceList.length > 0 &&
        favoriteServiceList.map((service) => {
          if (service.entity_id === item.entity_id) {
            return {
              ...service,
              is_fav:
                item.is_fav === IS_FAV.isTrue ? IS_FAV.isFalse : IS_FAV.isTrue,
            };
          }
          return service;
        });

      updatedLibraryList && setFavoriteServiceList(updatedLibraryList);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("favoriteActiveTab", activeTab.toString());
  }, [activeTab]);
  return (
    <div className="comman-padding flex flex-col h-svh md:h-[calc(100vh-76px)] overflow-hidden">
      <div>
        <div className="flex justify-between mb-4">
          <BackButton />
        </div>
        {userRole === USER_ROLE.Customer && (
          <div className="text-sm font-medium text-center border-b border-skin-favorite-color mb-4">
            <ul className="flex -mb-px favorites-list">
              <li
                className="me-2 cursor"
                onClick={() => setActiveTab(FAV_TABS.services)}
              >
                <div
                  className={`inline-block p-4 ${
                    activeTab === FAV_TABS.services
                      ? "active-text active-border border-b-2 "
                      : ""
                  }  rounded-t-lg active text-skin-favorite-label  flex`}
                  aria-current="page"
                >
                  {t("services")}
                </div>
              </li>

              <li
                className="me-2 cursor"
                onClick={() => setActiveTab(FAV_TABS.library)}
              >
                <div
                  className={`inline-block p-4 ${
                    activeTab === FAV_TABS.library
                      ? "active-text active-border border-b-2 "
                      : ""
                  }  rounded-t-lg active text-skin-favorite-label flex`}
                  aria-current="page"
                >
                  {t("library")}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto remove-scrollbar-width">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
            {[...Array(12)].map((_, index) => (
              <FavoriteLibrarySkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {activeTab === FAV_TABS.services && (
              <>
                {favoriteServiceList && favoriteServiceList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
                    {favoriteServiceList.map((item, index) => (
                      <div key={index}>
                        <div className="image relative w-full aspect-16/9 object-contain border-library overflow-hidden">
                          {Number(item.fav_item_cost) === 0 && (
                            <ICLable label={t("free")} />
                          )}
                          <ICImage
                            imageUrl={item.cover_image_path}
                            alt={t("service")}
                            className="w-full aspect-16/9 object-contain cursor"
                            onClick={() =>
                              navigate(userRoute.serviceDetails, {
                                state: { id: item.entity_id },
                              })
                            }
                          />
                          <div className="favorites absolute top-1 right-1">
                            {item.is_fav === IS_FAV.isTrue ? (
                              <div
                                className="m-2 favorites-icon cursor"
                                id="heart"
                                onClick={() => {
                                  removeFavorites(item);
                                }}
                              >
                                {fillHeartIcon}
                              </div>
                            ) : (
                              <div
                                id="heart"
                                className=" m-2 cursor favorites-icon cursor"
                                onClick={() => {
                                  removeFavorites(item);
                                }}
                              >
                                {flatHeartIcon}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-auto flex items-center mt-3">
                          <div className="w-9 h-[27px]">{vpServiceIcon}</div>
                          <p className="mx-2 whitespace-nowrap">
                            {item.fav_item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoData title="favorite_item" height={150} width={150} />
                )}
              </>
            )}
            {activeTab === FAV_TABS.library && (
              <>
                {favoriteLibraryList && favoriteLibraryList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
                    {favoriteLibraryList.map((item, index) => (
                      <LibraryOpenType
                        libraryList={favoriteLibraryList}
                        setLibraryList={setFavoriteLibraryList}
                        itemArray={item}
                        childClass="w-full"
                        index={index}
                        videoControls={[
                          "play",
                          "progress",
                          "current-time",
                          "mute",
                          "volume",
                          "fullscreen",
                          "play-large",
                        ]}
                      />
                    ))}{" "}
                  </div>
                ) : (
                  <NoData title="favorite_item" height={150} width={150} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Favorites;
