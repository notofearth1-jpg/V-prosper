import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavbar from "../../../components/common/BottomNavbar";
import "react-responsive-modal/styles.css";
import StoryModal from "../../../components/common/StoryModel";
import MobileHeader from "../MobileHeader";
import { IStory, fetchHighlightsApi } from "./StoryController";
import ShrinkText from "../../../components/common/ShrinkText";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  IEvent,
  fetchEventsApi,
  fetchServiceApi,
  fetchServiceDiscoverApi,
  fetchUpComingBookingsApi,
  carouselResponsive,
  fetchFreeServiceList,
  IServiceByCategory,
  getAllServiceByCategory,
} from "./HomePageController";
import { IServiceForSubCategory } from "../../product-services/Web/ProductServiceDetailsWebController";
import { userRoute } from "../../../routes/RouteUser";
import ICImage from "../../../core-component/ICImage";
import ICButton from "../../../core-component/ICButton";
import {
  leftArrow,
  leftArrowIcon,
  premiumIcon,
  rightArrowIcon,
} from "../../../assets/icons/SvgIconList";
import { IBookingList } from "../../booking/booking-list/BookingListController";
import Carousel from "react-multi-carousel";
import {
  BIT_VALUE,
  BOOKING_STATUS,
  CAROUSEL_NEXT_PREV_BUTTON_VALUE,
  CAROUSEL_SLIDE_PRE_CLICK,
  IS_PREMIUM,
  MEDIA_TYPE,
  VIEW_TYPE,
} from "../../../utils/AppEnumerations";
import { IThemeConfiguration } from "../profile/EditProfileController";
import PremiumPackagesView from "../../premium-package/PremiumPackagesView";
import VideoPlayer from "../../../components/common/VideoPlayer";
import useTheme from "../../../hooks/useThemeHook";
import { ensureHttpsUrl, updateRootStyles } from "../../../utils/AppFunctions";
import {
  handlePushNotification,
  requestNotificationPermission,
} from "../../../utils/firebaseNotification";
import HighlightsSkeleton from "./home-page-skeleton/HighlightsSkeleton";
import UpcomingBookingsSkeleton from "./home-page-skeleton/UpcomingBookingsSkeleton";
import HorizontalScrollRoundedCardSkeleton from "../../../components/common/skeletons/HorizontalScrollRoundedCardSkeleton";
import NoData from "../../../components/common/NoData";
import BookingJoinButton from "../../booking/booking-list/BookingJoinButton";
import ICLable from "../../../core-component/ICLable";
import ServiceCategory from "../../../components/common/ServiceByCategory";
import AddressModel from "../../address/AddressModel";
import { useAddressContext } from "../../../context/AddressContext";

const Home = () => {
  const { t } = UseTranslationHook();
  const carouselRef = useRef<Carousel>(null);
  const [highlightLoading, setHighlightLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [freeServiceLoading, setFreeServiceLoading] = useState(true);
  const [serviceByCategoryLoading, setServiceByCategoryLoading] =
    useState(true);
  const [upComingBookingLoading, setUpComingBookingLoading] = useState(true);
  const [highlightList, setHighlightList] = useState<IStory[]>([]);
  const [open, setOpen] = useState(false);
  const [servicesList, setServicesList] = useState<IServiceForSubCategory[]>(
    []
  );
  const [servicesDiscoverList, setServicesDiscoverList] = useState<
    IServiceForSubCategory[]
  >([]);
  const [servicesByCategoryList, setServicesByCategoryList] = useState<
    IServiceByCategory[]
  >([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(-1);
  const [eventsList, setEventList] = useState<IEvent[]>([]);
  const [upComingBookingsList, setUpComingBookingsList] = useState<
    IBookingList[]
  >([]);
  const [freeServicesList, setFreeServicesList] = useState<
    IServiceForSubCategory[]
  >([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddressModel, setShowAddressModel] = useState(false);
  const { addressData } = useAddressContext();

  const onOpenModal = (index: number) => {
    setOpen(true);
    setSelectedStoryIndex(index);
  };

  const reallyclose = () => {
    setOpen(false);
    setSelectedStoryIndex(-1);
  };

  const closeStory = () => {
    if (
      selectedStoryIndex >= 0 &&
      selectedStoryIndex < highlightList.length - 1
    ) {
      setSelectedStoryIndex((prev) => prev + 1);
    } else {
      reallyclose();
    }
  };

  const openStory = (index: number) => {
    onOpenModal(index);
  };

  useEffect(() => {
    fetchServiceApi(setServicesList, setTrendLoading, t);
    fetchServiceDiscoverApi(setServicesDiscoverList, setDiscoverLoading, t);
    fetchFreeServiceList(setFreeServicesList, setFreeServiceLoading, t);
    fetchEventsApi(setEventList, setEventLoading, t, true);
    fetchHighlightsApi(setHighlightList, setHighlightLoading);
    getAllServiceByCategory(
      setServicesByCategoryList,
      setServiceByCategoryLoading
    );
    fetchUpComingBookingsApi(
      setUpComingBookingsList,
      setUpComingBookingLoading
    );
  }, []);

  const handleCarouselSlide = (direction: string) => {
    if (carouselRef.current) {
      if (direction === CAROUSEL_NEXT_PREV_BUTTON_VALUE.Next) {
        carouselRef.current.next(CAROUSEL_SLIDE_PRE_CLICK.One);
      } else if (direction === CAROUSEL_NEXT_PREV_BUTTON_VALUE.Previous) {
        carouselRef.current.previous(CAROUSEL_SLIDE_PRE_CLICK.One);
      }
    }
  };

  const { randomTheme } = useTheme();

  useEffect(() => {
    if (randomTheme && randomTheme.theme_configuration) {
      const themeConfig: IThemeConfiguration = randomTheme.theme_configuration;
      let groupTitle = randomTheme.group_title.toLowerCase();

      // Check if groupTitle contains spaces
      if (groupTitle.includes(" ")) {
        // Remove spaces and convert to lowercase
        groupTitle = groupTitle.replace(/\s+/g, "").toLowerCase();
      }

      // Construct the CSS variable name dynamically
      const boxBgColorVariable = `${groupTitle}_box_bg_color`;
      const descriptionFontColorVariable = `${groupTitle}_description_font_color`;
      const iconSolidColorVariable = `${groupTitle}_icon_solid_color`;
      const linkColorVariable = `${groupTitle}_link_color`;
      const mainBgColorVariable = `${groupTitle}_main_bg_color`;
      const placeholderColorVariable = `${groupTitle}_placeholder_color`;
      const titleColorVariable = `${groupTitle}_title_color`;
      // Update the CSS variable with the corresponding color
      updateRootStyles(
        "--services-background-color",
        themeConfig[boxBgColorVariable]
      );
      updateRootStyles(
        "--primary-button-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-background-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--main-background-color",
        themeConfig[mainBgColorVariable]
      );
      updateRootStyles(
        "--input-active-border-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-icon-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-button-hover-color",
        themeConfig[mainBgColorVariable]
      );
      updateRootStyles(
        "--primary-title-color",
        themeConfig[titleColorVariable]
      );
      updateRootStyles(
        "--primary-description-color",
        themeConfig[descriptionFontColorVariable]
      );
      updateRootStyles("--primary-link-color", themeConfig[linkColorVariable]);
      updateRootStyles(
        "--primary-placeholder-color",
        themeConfig[placeholderColorVariable]
      );
      updateRootStyles(
        "--progress-stroke-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--input-placeholder-color",
        themeConfig[placeholderColorVariable]
      );
      updateRootStyles("--input-label-color", themeConfig[titleColorVariable]);
    }
  }, [randomTheme]);

  useEffect(() => {
    requestNotificationPermission();

    // Set up foreground message handler
    handlePushNotification((payload: any) => {
      const { title, body, icon } = payload.notification;

      // Display the notification
      new Notification(title, { body, icon });
    });
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent back navigation
      window.history.pushState(null, "", location.pathname);
      event.preventDefault();
    };

    // Add a dummy state to the history stack
    window.history.pushState(null, "", location.pathname);

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);

  return (
    <>
      <div className="main-bg min-h-svh">
        <MobileHeader />

        {highlightList && highlightList.length > 0 && (
          <div className="top">
            <p className="comman-black-big">{t("highlights")}</p>
          </div>
        )}

        {highlightLoading ? (
          <div className="top">
            <HighlightsSkeleton />
          </div>
        ) : (
          highlightList &&
          highlightList.length > 0 && (
            <div className="top">
              <div className="flex overflow-x-scroll scrolling-space">
                {highlightList && highlightList.length > 0
                  ? highlightList.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 flex flex-col items-center rounded-full mx-2"
                      >
                        <div
                          className="story-image  border-custom rounded-full overflow-hidden p-1"
                          onClick={() => openStory(index)}
                        >
                          <ICImage
                            src={
                              item?.app_media[0]?.media_type === "v"
                                ? require("../../../assets/image/video1.png")
                                : null
                            }
                            imageUrl={
                              item?.app_media[0]?.media_type !== "v"
                                ? item?.app_media[0]?.media_url
                                : undefined
                            }
                            alt={item.highlight_text}
                            className="w-[58px] h-[58px] object-cover rounded-full"
                          />
                        </div>
                        <p className="flex items-center justify-center mt-1">
                          <ShrinkText
                            text={item.highlight_text}
                            maxLength={10}
                            toLowercase
                          />
                        </p>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          )
        )}

        {open && highlightList[selectedStoryIndex]?.app_media && (
          <StoryModal
            open={open}
            onClose={closeStory}
            appMedia={highlightList[selectedStoryIndex].app_media}
            selectedStoryIndex={selectedStoryIndex}
            reallyclose={reallyclose}
            title={highlightList[selectedStoryIndex]?.highlight_text}
          />
        )}

        {upComingBookingLoading ? (
          <div className="top">
            <UpcomingBookingsSkeleton />
          </div>
        ) : (
          upComingBookingsList &&
          upComingBookingsList.length > 0 && (
            <>
              <div className="top flex justify-between">
                <p className="comman-black-big">{t("upcoming_bookings")}</p>
                <div className="flex space-x-2 comman-grey cursor-pointer">
                  {upComingBookingsList && upComingBookingsList.length > 1 && (
                    <>
                      <ICButton
                        className="!px-3"
                        onClick={() =>
                          handleCarouselSlide(
                            CAROUSEL_NEXT_PREV_BUTTON_VALUE.Previous
                          )
                        }
                      >
                        <div className=" h-2 w-2 text-white">{leftArrow}</div>
                      </ICButton>
                      <ICButton
                        className="!px-3"
                        onClick={() =>
                          handleCarouselSlide(
                            CAROUSEL_NEXT_PREV_BUTTON_VALUE.Next
                          )
                        }
                      >
                        <div className="h-2 w-2 text-white">
                          {leftArrowIcon}
                        </div>
                      </ICButton>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Carousel
                  arrows={false}
                  responsive={carouselResponsive}
                  ref={carouselRef}
                >
                  {upComingBookingsList &&
                    upComingBookingsList.length > 0 &&
                    upComingBookingsList.map((val, index) => (
                      <div
                        key={index}
                        className="top w-full flex justify-between items-center bg-skin-highlighted p-2 rounded-lg"
                      >
                        <div className="h-14 aspect-16/9">
                          <ICImage
                            imageUrl={val.service_media_url}
                            alt={val.service_title}
                            className="h-full aspect-16/9object-cover rounded-lg"
                            scaled={false}
                          />
                        </div>

                        <p className="comman-black-text w-full ml-3">
                          {(val.service_title, val.service_title)}
                        </p>
                        <div className="w-full flex justify-end">
                          {val.booking_status ===
                            BOOKING_STATUS.BookingConfirmed && (
                            <BookingJoinButton
                              session_id={val.session_id}
                              isOffline={val.is_offline}
                              schedule_time={val.schedule_time}
                              schedule_start_date={val.schedule_start_date}
                              schedule_end_date={val.schedule_end_date}
                              handleJoinButton={(event) => {
                                event.stopPropagation();
                                // navigate(userRoute.zoom, {
                                //   state: {
                                //     sessionId: val.session_id,
                                //   },
                                // });
                                window.open(
                                  ensureHttpsUrl(val.meeting_link),
                                  "_blank"
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </Carousel>
              </div>
            </>
          )
        )}
        <PremiumPackagesView />

        <div className=" top flex justify-between mb-2">
          <p className="comman-black-big">{t("nearby_events")}</p>
          <div className="col-span-1 space-x-3 flex justify-end">
            {eventsList && eventsList.length > 0 && (
              <div
                className="flex space-x-2 cursor"
                onClick={() => navigate(userRoute.events)}
              >
                <p className="comman-black-text pt-1.5 link-color">
                  {t("view_all")}
                </p>
                <div className="h-1 w-5 mt-1.5 link-color">
                  {rightArrowIcon}
                </div>
              </div>
            )}
          </div>
        </div>

        {eventLoading ? (
          <HorizontalScrollRoundedCardSkeleton width={186} height={160} />
        ) : eventsList && eventsList.length > 0 ? (
          <div className="top flex space-x-3 overflow-x-scroll scrolling-space">
            {eventsList.slice(0, 6).map((value, index) => (
              <div
                className="relative comman-black-text"
                key={index}
                onClick={() => {
                  if (!addressData && value.is_paid_event === BIT_VALUE.One) {
                    setShowAddressModel(true);
                    return;
                  }
                  navigate(userRoute.eventDetail, {
                    state: { id: value.id, sp: false },
                  });
                }}
              >
                <div className="home-page-card overflow-hidden border">
                  {value.app_media && value.app_media.length > 0 ? (
                    value.app_media[0].media_type === MEDIA_TYPE.image ? (
                      <ICImage
                        imageUrl={value.app_media[0]?.media_url}
                        alt={value.title}
                        className="w-full rounded-lg aspect-16/9"
                        scaled={false}
                      />
                    ) : (
                      <>
                        {value.app_media.length > 0 && (
                          <VideoPlayer
                            control={[
                              "play",
                              "progress",
                              "current-time",
                              "mute",
                              "fullscreen",
                              "play-large",
                            ]}
                            source={value.app_media[0].media_url}
                          />
                        )}
                      </>
                    )
                  ) : (
                    <ICImage
                      alt={value.title}
                      className="w-full rounded-lg aspect-16/9"
                      scaled={false}
                    />
                  )}
                </div>
                {value.has_subscribed === IS_PREMIUM.Yes ? (
                  <div className="uppercase absolute top-3 left-0.5">
                    <div className="text-subscribed text-skin-on-primary">
                      {t("subscribed")}
                    </div>
                  </div>
                ) : (
                  value.is_paid_event === IS_PREMIUM.Yes && (
                    <div className="favorites absolute top-1 left-1">
                      <div className="h-6 w-6">{premiumIcon}</div>
                    </div>
                  )
                )}
                <div className="mt-[10px]">
                  <ShrinkText text={value.title} maxLength={30} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoData title={t("event")} height={75} width={75} />
        )}

        <div className="top flex justify-between">
          <p className="comman-black-big">{t("free")}</p>
          <div className="col-span-1 space-x-3 flex justify-end">
            {freeServicesList.length > 0 && (
              <div
                className="flex space-x-2 cursor"
                onClick={() =>
                  navigate(userRoute.serviceAll, {
                    state: {
                      heading: "Free Services",
                      type: VIEW_TYPE.FreeService,
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
            )}
          </div>
        </div>

        {freeServiceLoading ? (
          <HorizontalScrollRoundedCardSkeleton
            width={380}
            height={380}
            fontSize={32}
          />
        ) : freeServicesList && freeServicesList.length > 0 ? (
          <div className="top flex overflow-x-scroll scrolling-space">
            {freeServicesList.map((value, index) => (
              <div className=" comman-black-text mr-5" key={index}>
                <div
                  className="home-page-card-trend overflow-hidden border relative"
                  onClick={() =>
                    navigate(userRoute.serviceDetails, {
                      state: { id: value?.id },
                    })
                  }
                >
                  <ICLable label={t("free")} />

                  {value.app_media && value.app_media.length > 0 ? (
                    value.app_media[0].media_type === MEDIA_TYPE.image ? (
                      <ICImage
                        height={194}
                        width={345}
                        imageUrl={value.app_media[0]?.media_url}
                        alt={value.service_title}
                        className="w-full h-full rounded-lg aspect-16/9"
                        scaled={false}
                      />
                    ) : (
                      <>
                        {value.app_media.length > 0 && (
                          <VideoPlayer
                            control={[
                              "play",
                              "progress",
                              "current-time",
                              "mute",
                              "fullscreen",
                              "play-large",
                            ]}
                            source={value.app_media[0].media_url}
                          />
                        )}
                      </>
                    )
                  ) : (
                    <ICImage
                      height={194}
                      width={345}
                      alt={value.service_title}
                      className="w-full h-full rounded-lg aspect-16/9"
                      scaled={false}
                    />
                  )}
                </div>
                <div className="mt-[10px]">{value.service_title}</div>
              </div>
            ))}
          </div>
        ) : (
          <NoData title={t("service")} height={75} width={75} />
        )}

        <div className="top flex justify-between">
          <p className="comman-black-big">{t("trending_now")}</p>
          <div className="col-span-1 space-x-3 flex justify-end">
            {servicesList.length > 0 && (
              <div
                className="flex space-x-2 cursor"
                onClick={() =>
                  navigate(userRoute.serviceAll, {
                    state: { heading: "Trending Services", type: "trending" },
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
            )}
          </div>
        </div>

        {trendLoading ? (
          <HorizontalScrollRoundedCardSkeleton
            width={380}
            height={380}
            fontSize={32}
          />
        ) : servicesList.length > 0 ? (
          <div className="top flex overflow-x-scroll scrolling-space">
            {servicesList &&
              servicesList.map((value, index) => (
                <div className=" comman-black-text mr-5" key={index}>
                  <div
                    className="home-page-card-trend overflow-hidden border relative"
                    onClick={() =>
                      navigate(userRoute.serviceDetails, {
                        state: { id: value?.id },
                      })
                    }
                  >
                    {Number(value.service_cost) === 0 && (
                      <ICLable label={t("free")} />
                    )}
                    {value.app_media && value.app_media.length > 0 ? (
                      value.app_media[0].media_type === MEDIA_TYPE.image ? (
                        <ICImage
                          height={194}
                          width={345}
                          imageUrl={value.app_media[0]?.media_url}
                          alt={value.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      ) : (
                        <>
                          {value.app_media.length > 0 && (
                            <VideoPlayer
                              control={[
                                "play",
                                "progress",
                                "current-time",
                                "mute",
                                "fullscreen",
                                "play-large",
                              ]}
                              source={value.app_media[0].media_url}
                            />
                          )}
                        </>
                      )
                    ) : (
                      <ICImage
                        height={194}
                        width={345}
                        alt={value.service_title}
                        className="w-full h-full rounded-lg aspect-16/9"
                        scaled={false}
                      />
                    )}
                  </div>
                  <div className="mt-[10px]">{value.service_title}</div>
                </div>
              ))}
          </div>
        ) : (
          <NoData title={t("service")} height={75} width={75} />
        )}

        <div className="top flex justify-between">
          <p className="comman-black-big">{t("discover")}</p>
          <div className="col-span-1 space-x-3 flex justify-end">
            {servicesDiscoverList.length > 0 && (
              <div
                className="flex space-x-2 cursor"
                onClick={() =>
                  navigate(userRoute.serviceAll, {
                    state: { heading: "Discover Services", type: "discover" },
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
            )}
          </div>
        </div>

        {discoverLoading ? (
          <HorizontalScrollRoundedCardSkeleton />
        ) : servicesDiscoverList.length > 0 ? (
          <div className="top flex overflow-x-scroll scrolling-space">
            {servicesDiscoverList &&
              servicesDiscoverList.map((value, index) => (
                <div
                  className="comman-black-text mr-5 relative"
                  key={index}
                  onClick={() =>
                    navigate(userRoute.serviceDetails, {
                      state: { id: value?.id },
                    })
                  }
                >
                  {Number(value.service_cost) === 0 && (
                    <ICLable label={t("free")} customFont />
                  )}
                  <div className="home-page-card overflow-hidden border">
                    {value.app_media && value.app_media.length > 0 ? (
                      value.app_media[0].media_type === MEDIA_TYPE.image ? (
                        <ICImage
                          height={113}
                          width={200}
                          imageUrl={value.app_media[0]?.media_url}
                          alt={value.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      ) : (
                        <>
                          {value.app_media.length > 0 && (
                            <VideoPlayer
                              control={[
                                "play",
                                "progress",
                                "current-time",
                                "mute",
                                "fullscreen",
                                "play-large",
                              ]}
                              source={value.app_media[0].media_url}
                            />
                          )}
                        </>
                      )
                    ) : (
                      <ICImage
                        height={113}
                        width={200}
                        alt={value.service_title}
                        className="w-full h-full rounded-lg aspect-16/9"
                        scaled={false}
                      />
                    )}
                  </div>
                  <div className="mt-[10px]">{value.service_title}</div>
                </div>
              ))}
          </div>
        ) : (
          <NoData title={t("service")} height={75} width={75} />
        )}
        <div className="mb-20">
          {servicesByCategoryList &&
            servicesByCategoryList.length > 0 &&
            servicesByCategoryList.map((item, index) => {
              return (
                <ServiceCategory
                  key={index}
                  item={item}
                  serviceByCategoryLoading={serviceByCategoryLoading}
                />
              );
            })}
        </div>
        <BottomNavbar homeActive />
        {showAddressModel && (
          <AddressModel
            modelOpen={showAddressModel}
            setModelOpen={setShowAddressModel}
          />
        )}
      </div>
    </>
  );
};

export default Home;
