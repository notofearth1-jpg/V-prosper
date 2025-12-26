import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IService,
  IServiceBySubCategory,
  fetchServiceBySubCategoryApi,
  fetchServiceCategoryApi,
  fetchServiceSubCategoryApi,
} from "../ProductServiceCategoryController";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  clockIcon,
  contentIcon,
  fillHeartIcon,
  flatHeartIcon,
  pathLineIcon,
  vpServiceIcon,
} from "../../../assets/icons/SvgIconList";
import BottomLoader from "../../../components/common/BottomLoader";
import BackButton from "../../../components/common/BackButton";
import ICImage from "../../../core-component/ICImage";
import { userRoute } from "../../../routes/RouteUser";
import { addToFavorite } from "../../library/LibraryController";
import { IS_FAV_PAYLOAD } from "../../../utils/AppEnumerations";
import VideoPlayer from "../../../components/common/VideoPlayer";
import ICLable from "../../../core-component/ICLable";
interface IItem {
  id: number;
  is_fav?: string;
}
const ProductServiceCategoryWeb = () => {
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(true);

  const [servicesList, setServicesList] = useState<IService | null>(null);
  const [serviceSubCategoryList, setServiceSubCategoryList] = useState<
    IService[]
  >([]);
  const [loadingSubCat, setLoadingSubCat] = useState(true);

  const [serviceBySubCategoryList, setServiceBySubCategoryList] = useState<
    IServiceBySubCategory[]
  >([]);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const id: number = location?.state?.id;

  const handleTabClick = (tab: string, categoryId: number) => {
    setActiveTab(tab);
    fetchServiceBySubCategoryApi(setServiceBySubCategoryList, categoryId);
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

  useEffect(() => {
    fetchServiceCategoryApi(setServicesList, setLoading, id, t);
    fetchServiceSubCategoryApi(setServiceSubCategoryList, setLoadingSubCat, id);
  }, []);
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
        <div className="w-full comman-padding">
          <div className="mb-2">
            <BackButton />
          </div>
          <div className="container mx-auto">
            <div className="">
              <div>
                <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-x-scroll">
                  <div className="w-full aspect-16/9 object-contain flex xl:justify-start lg:justify-start col-span-1 justify-center rounded-lg overflow-hidden">
                    {servicesList?.poster_image &&
                    isVideo(servicesList?.poster_image) ? (
                      <div className="overflow-hidden">
                        <VideoPlayer
                          control={["play-large"]}
                          source={servicesList.poster_image}
                        />
                      </div>
                    ) : (
                      <ICImage
                        imageUrl={servicesList?.poster_image}
                        alt={servicesList?.category_title}
                        className="w-full aspect-16/9 object-contain"
                        showOriginal={true}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-col justify-center col-span-2  xl:p-5">
                    <div className="flex justify-start md:justify-center lg:justify-start xl:justify-start">
                      <div className="flex  mr-10 items-center">
                        <div className="flex space-x-4">
                          <div className="w-7 h-7 ">{contentIcon}</div>
                          <div className="comman-black-big">
                            {servicesList?.category_title}
                          </div>
                          <div className="border-left"></div>
                          <div className="w-[33px] h-[37px]">
                            {pathLineIcon}
                          </div>
                          <p className="comman-black-big">
                            {`${servicesList?.total_services} ${t("types")}`}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="top comman-black-big">
                      <div>{`${servicesList?.category_title} ${t(
                        "description"
                      )}`}</div>
                    </div>

                    <div className="top text-justify comman-grey">
                      {servicesList?.category_desc}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col top ">
                  {/* <div>
                    <h1 className="text-xl font-bold">{t("continue_flows")}</h1>
                  </div> */}

                  {loadingSubCat ? (
                    <BottomLoader />
                  ) : (
                    <>
                      <div className="text-lg font-medium text-center flex pb-0 overflow-x-scroll w-full">
                        {serviceSubCategoryList &&
                          serviceSubCategoryList.length > 0 &&
                          serviceSubCategoryList.map((data, index) => (
                            <ul
                              key={index}
                              className="flex justify-between lg:justify-start lg:space-x-16 -mb-px cursor-pointer"
                            >
                              <li
                                key={index}
                                className={`list-none cursor${
                                  activeTab === data.sub_category_title
                                    ? "active-text active-border border-b-2 "
                                    : ""
                                } `}
                                onClick={() =>
                                  handleTabClick(
                                    data.sub_category_title,
                                    data.id
                                  )
                                }
                              >
                                <div
                                  className={`p-4 text rounded-t-lg  border-skin-product-service flex `}
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
                            </ul>
                          ))}
                      </div>
                      <div className="overflow-x-hidden w-full">
                        <div className="flex overflow-x-scroll w-full">
                          {serviceBySubCategoryList &&
                            serviceBySubCategoryList.length > 0 &&
                            serviceBySubCategoryList.map((item, index) => (
                              <div
                                className="flex flex-shrink-0 overflow-hidden flex-col mr-5"
                                key={index}
                              >
                                <div
                                  className="h-[200px] aspect-16/9 object-contain cursor"
                                  onClick={() =>
                                    navigate(userRoute.serviceDetails, {
                                      state: { id: item.id },
                                    })
                                  }
                                >
                                  <div className="relative aspect-16/9 object-contain border-library overflow-hidden flex justify-center">
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
                                          className=" m-2 favorites-icon cursor"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleFavoritesService(item);
                                          }}
                                        >
                                          {fillHeartIcon}
                                        </div>
                                      ) : (
                                        <div
                                          className=" m-2 cursor favorites-icon cursor"
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
                                </div>

                                <div className="h-12 w-full flex justify-around items-center">
                                  <div className="w-auto flex items-center">
                                    <div className="w-9 h-[27px]">
                                      {vpServiceIcon}
                                    </div>

                                    <p className="mx-2 whitespace-nowrap comman-black-text">
                                      {item.service_title}{" "}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="mr-1">| </p>
                                  </div>
                                  <div className="w-auto flex items-center">
                                    <div className="w-5 h-5">{clockIcon}</div>
                                    <p className="ml-2 whitespace-nowrap comman-black-text">
                                      {item.duration}{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductServiceCategoryWeb;
