import React, { useEffect, useState } from "react";
import { IServiceForSubCategory } from "../screens/product-services/Web/ProductServiceDetailsWebController";
import {
  fetchFreeServiceList,
  fetchServiceApi,
  fetchServiceDiscoverApi,
  getAllServiceByCategoryId,
  IServiceByCategory,
} from "../screens/header/home-page/HomePageController";
import BackButton from "./common/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import UseTranslationHook from "../hooks/UseTranslationHook";
import { VIEW_TYPE } from "../utils/AppEnumerations";
import ICImage from "../core-component/ICImage";
import { userRoute } from "../routes/RouteUser";
import CardListPageSkeleton from "./common/skeletons/CardListPageSkeleton";
import VideoPlayer from "./common/VideoPlayer";
import ICLable from "../core-component/ICLable";

const ServiceComponent = () => {
  const [servicesList, setServicesList] = useState<IServiceForSubCategory[]>(
    []
  );
  const [servicesByCategoryList, setServicesByCategoryList] = useState<
    IServiceByCategory[]
  >([]);
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const heading = location.state.heading;
  const viewType = location.state.type;
  const categoryId = location.state.categoryId;

  useEffect(() => {
    if (viewType === VIEW_TYPE.Trending) {
      fetchServiceApi(setServicesList, setLoading, t, heading);
    } else if (viewType === VIEW_TYPE.Discover) {
      fetchServiceDiscoverApi(setServicesList, setLoading, t, heading);
    } else if (viewType === VIEW_TYPE.ServiceCategory) {
      getAllServiceByCategoryId(setServicesList, setLoading, categoryId);
    } else {
      fetchFreeServiceList(setServicesList, setLoading, t, heading);
    }
  }, []);

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <>
      <div className="h-svh comman-padding !pb-0 overflow-hidden md:h-[calc(100vh-76px)] flex flex-col">
        <div className="flex">
          <div className="flex space-x-5">
            <div>
              <BackButton />
            </div>
            <div className="w-full comman-grey ml-2 flex items-center comman-black-lg">
              <h1>
                {heading} ({servicesList.length})
              </h1>
            </div>
          </div>
        </div>
        {loading ? <CardListPageSkeleton /> : null}
        <div className="mt-4 flex-1 overflow-y-scroll remove-scrollbar-width">
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {servicesList &&
              servicesList.map((item, index) => (
                <div key={index} className="mb-2">
                  <div
                    key={index}
                    onClick={() =>
                      navigate(userRoute.serviceDetails, {
                        state: { id: item?.id },
                      })
                    }
                    className="cursor flex justify-center items-center border bg-skin-on-background rounded-lg overflow-hidden aspect-16/9 object-contain relative"
                  >
                    {Number(item.service_cost) === 0 && (
                      <ICLable label={t("free")} />
                    )}
                    {isVideo(item.app_media[0]?.media_url) ? (
                      <div className="overflow-hidden aspect-16/9 object-contain">
                        <VideoPlayer
                          control={["play-large"]}
                          source={item.app_media[0]?.media_url}
                        />
                      </div>
                    ) : (
                      <ICImage
                        imageUrl={item.app_media[0]?.media_url}
                        alt={item.service_title}
                        className="w-full aspect-16/9 object-contain"
                        scaled={false}
                      />
                    )}
                  </div>
                  <div className="comman-black-text mt-[10px]">
                    {item.service_title}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceComponent;
