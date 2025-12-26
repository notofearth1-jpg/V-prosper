import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import Loader from "../../components/common/Loader";
import {
  IService,
  IServiceBySubCategory,
  fetchServiceBySubCategoryApi,
  fetchServiceCategoryApi,
  fetchServiceSubCategoryApi,
} from "./ProductServiceCategoryController";
import {
  clockIcon,
  flatHeartIcon,
  titleIcon,
  typeIcon,
  fillHeartIcon,
  vpServiceIcon,
} from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { addToFavorite } from "../library/LibraryController";
import BottomLoader from "../../components/common/BottomLoader";
import ICImage from "../../core-component/ICImage";
import { userRoute } from "../../routes/RouteUser";
import { IS_FAV_PAYLOAD } from "../../utils/AppEnumerations";
import VideoPlayer from "../../components/common/VideoPlayer";
import ICLable from "../../core-component/ICLable";

interface IItem {
  id: number;
  is_fav?: string;
}

const ProductServiceDescription = () => {
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(true);
  const [loadingSubCat, setLoadingSubCat] = useState(true);
  const [servicesList, setServicesList] = useState<IService | null>(null);
  const [serviceSubCategoryList, setServiceSubCategoryList] = useState<
    IService[]
  >([]);
  const [serviceBySubCategoryList, setServiceBySubCategoryList] = useState<
    IServiceBySubCategory[]
  >([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const location = useLocation();
  const id: number = location.state.id;
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceCategoryApi(setServicesList, setLoading, id, t);
    fetchServiceSubCategoryApi(setServiceSubCategoryList, setLoadingSubCat, id);
  }, []);

  const handleTabClick = (tab: string, id: number) => {
    setActiveTab(tab);
    fetchServiceBySubCategoryApi(setServiceBySubCategoryList, id);
  };

  useEffect(() => {
    if (serviceSubCategoryList.length > 0) {
      setActiveTab(serviceSubCategoryList[0].sub_category_title);
      fetchServiceBySubCategoryApi(
        setServiceBySubCategoryList,
        serviceSubCategoryList[0].id
      );
    }
  }, [serviceSubCategoryList]);

  const handleFavoritesService = async (item: IItem) => {
    const serviceFavoritePayload = {
      entity_type: 1,
      entity_id: item?.id,
      is_fav:
        item.is_fav === IS_FAV_PAYLOAD.isTrue
          ? IS_FAV_PAYLOAD.isFalse
          : IS_FAV_PAYLOAD.isTrue,
    };
    var isStatusChange = await addToFavorite(serviceFavoritePayload);
    if (isStatusChange) {
      const updatedSubcategoryList = serviceBySubCategoryList.map((service) => {
        if (service.id === item.id) {
          return {
            ...service,
            is_fav:
              item.is_fav === IS_FAV_PAYLOAD.isTrue
                ? IS_FAV_PAYLOAD.isFalse
                : IS_FAV_PAYLOAD.isTrue,
          };
        }
        return service;
      });
      setServiceBySubCategoryList(updatedSubcategoryList);
    }
  };
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-y-scroll remove-scrollbar-width relative">
          <div className="comman-padding absolute z-20">
            <BackButton />
          </div>
          <div className=" flex flex-col h-svh">
            <div className="flex justify-center aspect-16/9 w-full">
              {servicesList?.poster_image &&
              isVideo(servicesList?.poster_image) ? (
                <div className="overflow-hidden aspect-16/9 w-full">
                  <VideoPlayer
                    autoPlay={true}
                    control={["play-large"]}
                    source={servicesList.poster_image}
                  />
                </div>
              ) : (
                <ICImage
                  imageUrl={servicesList?.poster_image}
                  alt={servicesList?.category_title}
                  scaled={false}
                  className="aspect-16/9 w-full"
                  showOriginal={true}
                />
              )}
            </div>
            <>
              <div className="service-description !rounded-none comman-padding flex-1">
                <div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 -ml-0.5 mr-1">{titleIcon}</div>
                    <p className="comman-black-big">
                      {servicesList?.category_title}
                    </p>
                    <div className="mx-3">|</div>
                    <div className="mr-2">
                      <div className="w-5 h-5">{typeIcon}</div>
                    </div>

                    <p className="comman-black-big">
                      {`${servicesList?.total_services} ${t("types")}`}{" "}
                    </p>
                  </div>
                </div>
                <div className="top comman-black-big">
                  <p>{`${servicesList?.category_title} ${t("description")}`}</p>
                </div>
                <div className="top text-justify comman-grey">
                  <p>{servicesList?.category_desc}</p>
                </div>

                <div className="w-full scrolling-space top">
                  <div className="text-lg font-medium text-center flex border-b-2 remove-scrollbar-width overflow-x-scroll w-full overflow-hidden">
                    <ul
                      className="flex justify-between lg:justify-start lg:space-x-16 cursor-pointer"
                      style={{ listStyle: "none", padding: "0" }}
                    >
                      {serviceSubCategoryList &&
                        serviceSubCategoryList.map((data, index) => (
                          <li
                            key={index}
                            className={`me-2 list-none cursor ${
                              activeTab === data.sub_category_title
                                ? "active-text active-border border-b-2 "
                                : ""
                            }`}
                            onClick={() =>
                              handleTabClick(data.sub_category_title, data.id)
                            }
                          >
                            <div
                              className={`p-4 text whitespace-nowrap rounded-t-lg border-skin-product-service flex `}
                              aria-current="page"
                            >
                              <p
                                className={`${
                                  activeTab === data.sub_category_title
                                    ? "active-text"
                                    : "inactive-text"
                                }`}
                              >
                                {data.sub_category_title}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                {loadingSubCat ? (
                  <BottomLoader />
                ) : (
                  <div className="flex mt-10  overflow-x-scroll w-auto scrolling-space">
                    {serviceBySubCategoryList &&
                      serviceBySubCategoryList.length > 0 &&
                      serviceBySubCategoryList.map((item, index) => (
                        <div key={index} className="flex flex-shrink-0 ">
                          <div className="mr-5">
                            <div
                              className="relative flex justify-center h-[200px] aspect-16/9 object-contain border-library overflow-hidden"
                              onClick={() =>
                                navigate(userRoute.serviceDetails, {
                                  state: { id: item.id },
                                })
                              }
                            >
                              {Number(item.service_cost) === 0 && (
                                <ICLable label={t("free")} />
                              )}
                              <ICImage
                                imageUrl={item?.app_media[0]?.media_url}
                                alt={item?.service_title}
                                className="h-full aspect-16/9 object-contain"
                              />
                              <div className="favorites absolute top-1 right-1">
                                {item.is_fav === "1" ? (
                                  <div
                                    className=" m-2 favorites-icon"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleFavoritesService(item);
                                    }}
                                  >
                                    {fillHeartIcon}
                                  </div>
                                ) : (
                                  <div
                                    className=" m-2 cursor favorites-icon"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleFavoritesService(item);
                                    }}
                                  >
                                    {flatHeartIcon}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="h-8 mt-5 w-full flex justify-around items-center">
                              <div className="w-auto flex items-center">
                                <div className="w-9 h-[27px]">
                                  {vpServiceIcon}
                                </div>

                                <p className="mx-2 whitespace-nowrap comman-black-text">
                                  {item.service_title}
                                </p>
                              </div>

                              <div>
                                <p className="mr-1">| </p>
                              </div>
                              <div className="w-auto flex items-center">
                                <div className="w-5 h-5">{clockIcon}</div>
                                <p className="ml-2 whitespace-nowrap comman-black-text">
                                  {item.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductServiceDescription;
