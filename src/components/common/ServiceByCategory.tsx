import React, { forwardRef } from "react";
import ICImage from "../../core-component/ICImage";
import ICLable from "../../core-component/ICLable";
import ScrollActionBtn from "./ScrollActionBtn";
import HorizontalScrollRoundedCardSkeleton from "./skeletons/HorizontalScrollRoundedCardSkeleton";
import { useNavigate } from "react-router-dom";
import { IServiceByCategory } from "../../screens/header/home-page/HomePageController";
import { userRoute } from "../../routes/RouteUser";
import { MEDIA_TYPE, VIEW_TYPE } from "../../utils/AppEnumerations";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import VideoPlayer from "./VideoPlayer";
import ShrinkText from "./ShrinkText";
import NoData from "./NoData";
import { rightArrowIcon } from "../../assets/icons/SvgIconList";

interface IServiceByCategoryProps {
  item: IServiceByCategory;
  serviceByCategoryLoading: boolean;
  showScollBotton?: boolean;
}

const ServiceCategory = forwardRef<HTMLDivElement, IServiceByCategoryProps>(
  ({ item, serviceByCategoryLoading, showScollBotton }) => {
    const navigate = useNavigate();
    const { t } = UseTranslationHook();
    const serviceByCategoryRefs = React.createRef<HTMLDivElement>();

    return (
      <div>
        <div
          className={`grid grid-cols-2 ${
            showScollBotton ? "comman-padding" : ""
          } top`}
        >
          <div className="col-span-1 comman-black-lg flex items-center">
            {item.category_title}
          </div>
          {item.service && item.service.length > 0 && (
            <div className="col-span-1 space-x-3 flex justify-end">
              <div
                className="flex space-x-2 cursor"
                onClick={() =>
                  navigate(userRoute.serviceAll, {
                    state: {
                      heading: item.category_title,
                      type: VIEW_TYPE.ServiceCategory,
                      categoryId: item.id,
                    },
                  })
                }
              >
                <p className="comman-black-text pt-1.5 link-color">
                  {t("view_all")}
                </p>
                <div className="h-1 w-5 mt-1.5 link-color">
                  {rightArrowIcon}
                </div>
              </div>
              {showScollBotton && (
                <ScrollActionBtn
                  Ref={serviceByCategoryRefs}
                  scrollLength={308}
                  leftArrowId={"left-arrow-event"}
                  rightArrowId={"right-arrow-event"}
                />
              )}
            </div>
          )}
        </div>
        {serviceByCategoryLoading ? (
          <HorizontalScrollRoundedCardSkeleton
            height={240}
            width={256}
            fontSize={32}
          />
        ) : (
          <div
            className={`flex overflow-x-scroll ${
              showScollBotton ? "px-4" : "top"
            } space-x-4 remove-scrollbar-width`}
            ref={serviceByCategoryRefs}
          >
            {item.service && item.service.length > 0 ? (
              item.service.slice(0, 5).map((service, serviceIndex) => (
                <div key={serviceIndex}>
                  <div
                    className="home-page-card-web flex justify-center border-library relative overflow-hidden cursor"
                    onClick={() =>
                      navigate(userRoute.serviceDetails, {
                        state: { id: service.id },
                      })
                    }
                  >
                    {Number(service.service_cost) === 0 && (
                      <ICLable label={t("free")} />
                    )}
                    {service.app_media && service.app_media.length > 0 ? (
                      service.app_media[0].media_type === MEDIA_TYPE.image ? (
                        <ICImage
                          height={162}
                          width={288}
                          imageUrl={service.app_media[0]?.media_url}
                          alt={service.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      ) : (
                        <VideoPlayer
                          control={[
                            "play",
                            "progress",
                            "current-time",
                            "mute",
                            "fullscreen",
                            "play-large",
                          ]}
                          source={service.app_media[0].media_url}
                        />
                      )
                    ) : (
                      <ICImage
                        height={162}
                        width={288}
                        alt={service.service_title}
                        className="w-full h-full rounded-lg aspect-16/9"
                        scaled={false}
                      />
                    )}
                  </div>
                  <p className="comman-black-text mt-[10px]">
                    <ShrinkText text={service.service_title} maxLength={30} />
                  </p>
                </div>
              ))
            ) : (
              <NoData title={t("service")} height={100} width={100} />
            )}
          </div>
        )}
      </div>
    );
  }
);

export default ServiceCategory;
