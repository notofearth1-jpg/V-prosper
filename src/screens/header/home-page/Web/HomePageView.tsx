import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StoryModal from "../../../../components/common/StoryModel";
import { IStory, fetchHighlightsApi } from "../StoryController";
import ShrinkText from "../../../../components/common/ShrinkText";
import UseTranslationHook from "../../../../hooks/UseTranslationHook";
import {
  IEvent,
  fetchEventsApi,
  fetchServiceApi,
  fetchServiceDiscoverApi,
  fetchUpComingBookingsApi,
  carouselResponsive,
  fetchFreeServiceList,
  getAllServiceByCategory,
  IServiceByCategory,
} from "../HomePageController";
import { IServiceForSubCategory } from "../../../product-services/Web/ProductServiceDetailsWebController";
import { IBookingList } from "../../../booking/booking-list/BookingListController";
import {
  leftArrow,
  leftArrowIcon,
  premiumIcon,
  rightArrowIcon,
} from "../../../../assets/icons/SvgIconList";
import ICImage from "../../../../core-component/ICImage";
import { userRoute } from "../../../../routes/RouteUser";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  BIT_VALUE,
  BOOKING_STATUS,
  CAROUSEL_NEXT_PREV_BUTTON_VALUE,
  CAROUSEL_SLIDE_PRE_CLICK,
  IS_PREMIUM,
  IS_SUBSCRIBED,
  MEDIA_TYPE,
  VIEW_TYPE,
} from "../../../../utils/AppEnumerations";
import PremiumPackagesView from "../../../premium-package/PremiumPackagesView";
import VideoPlayer from "../../../../components/common/VideoPlayer";
import {
  ensureHttpsUrl,
  updateRootStyles,
} from "../../../../utils/AppFunctions";
import { IThemeConfiguration } from "../../profile/EditProfileController";
import useTheme from "../../../../hooks/useThemeHook";
import HighlightsSkeleton from "../home-page-skeleton/HighlightsSkeleton";
import HorizontalScrollRoundedCardSkeleton from "../../../../components/common/skeletons/HorizontalScrollRoundedCardSkeleton";
import {
  handlePushNotification,
  requestNotificationPermission,
} from "../../../../utils/firebaseNotification";
import ScrollActionBtn from "../../../../components/common/ScrollActionBtn";
import NoData from "../../../../components/common/NoData";
import BookingJoinButton from "../../../booking/booking-list/BookingJoinButton";
import UpcomingBookingsSkeleton from "../home-page-skeleton/UpcomingBookingsSkeleton";
import ICLable from "../../../../core-component/ICLable";
import ServiceCategory from "../../../../components/common/ServiceByCategory";
import { useAddressContext } from "../../../../context/AddressContext";
import AddressModel from "../../../address/AddressModel";

const Home = () => {
  const { t } = UseTranslationHook();
  const carouselRef = useRef<Carousel>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);
  const freeServiceRef = useRef<HTMLDivElement>(null);
  const [highlightLoading, setHighlightLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [freeServiceLoading, setFreeServiceLoading] = useState(true);
  const [upComingBookingLoading, setUpComingBookingLoading] = useState(true);
  const [serviceByCategoryLoading, setServiceByCategoryLoading] =
    useState(true);
  const [highlightList, setHighlightList] = useState<IStory[]>([]);
  const [upComingBookingsList, setUpComingBookingsList] = useState<
    IBookingList[]
  >([]);
  const [servicesList, setServicesList] = useState<IServiceForSubCategory[]>(
    []
  );
  const [freeServicesList, setFreeServicesList] = useState<
    IServiceForSubCategory[]
  >([]);
  const [servicesByCategoryList, setServicesByCategoryList] = useState<
    IServiceByCategory[]
  >([]);
  const [eventsList, setEventLists] = useState<IEvent[]>([]);
  const [servicesDiscoverList, setServicesDiscoverList] = useState<
    IServiceForSubCategory[]
  >([]);
  const [open, setOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(-1);
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchHighlightsApi(setHighlightList, setHighlightLoading);
    fetchServiceApi(setServicesList, setTrendLoading, t);
    fetchFreeServiceList(setFreeServicesList, setFreeServiceLoading, t);
    fetchServiceDiscoverApi(setServicesDiscoverList, setDiscoverLoading, t);
    fetchEventsApi(setEventLists, setEventLoading, t, true);
    fetchUpComingBookingsApi(
      setUpComingBookingsList,
      setUpComingBookingLoading
    );
    getAllServiceByCategory(
      setServicesByCategoryList,
      setServiceByCategoryLoading
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

  const location = useLocation();

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
      <div className="container mx-auto">
        <div>
          {highlightList && highlightList.length > 0 && (
            <div className="top">
              <p className="comman-black-big ml-5">{t("highlights")}</p>
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
                <div className="flex overflow-x-scroll mx-5">
                  {highlightList.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 flex flex-col items-center mr-5 cursor rounded-full"
                      onClick={() => openStory(index)}
                    >
                      <div className="story-image border-2 border-custom rounded-full overflow-hidden p-1 ">
                        <ICImage
                          src={
                            item?.app_media[0]?.media_type === "v"
                              ? require("../../../../assets/image/video1.png")
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
                  ))}
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
            <div className="top grid grid-cols-3 space-x-4 comman-padding !pr-0">
              {[...Array(3)].map((x, index) => (
                <UpcomingBookingsSkeleton />
              ))}
            </div>
          ) : (
            upComingBookingsList &&
            upComingBookingsList.length > 0 && (
              <div>
                <div className="top flex justify-between mx-5">
                  <div className="comman-black-big">
                    {t("upcoming_bookings")}
                  </div>
                  <div className="flex cursor">
                    {upComingBookingsList &&
                      upComingBookingsList.length > 1 && (
                        <>
                          <div
                            className="border cursor p-2 px-3 flex justify-center background-green text-white rounded-l-2xl"
                            onClick={() =>
                              handleCarouselSlide(
                                CAROUSEL_NEXT_PREV_BUTTON_VALUE.Previous
                              )
                            }
                          >
                            <div className="h-3 w-3">{leftArrow}</div>
                          </div>
                          <div
                            className="border cursor p-2 px-3 flex justify-center background-green text-white rounded-r-2xl"
                            onClick={() =>
                              handleCarouselSlide(
                                CAROUSEL_NEXT_PREV_BUTTON_VALUE.Next
                              )
                            }
                          >
                            <div className="h-3 w-3">{leftArrowIcon}</div>
                          </div>
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
                        <div key={index}>
                          <div className="p-4">
                            <div className="flex p-2  justify-between items-center bg-skin-highlighted-web rounded-lg">
                              <div className=" flex ">
                                <div className="comman-btn-home w-20 aspect-16/9 2xl:w-32 xl:w-32 lg:w-36">
                                  <ICImage
                                    imageUrl={val.service_media_url}
                                    alt={val.service_title}
                                    className="w-20  2xl:w-32 xl:w-32 lg:w-36 aspect-16/9 rounded-lg"
                                    scaled={false}
                                  />
                                </div>
                              </div>
                              <div className="w-full ml-2 comman-black-text">
                                {val.service_title}
                              </div>
                              <div className="w-full flex justify-end">
                                {val.booking_status ===
                                  BOOKING_STATUS.BookingConfirmed && (
                                  <BookingJoinButton
                                    session_id={val.session_id}
                                    isOffline={val.is_offline}
                                    schedule_time={val.schedule_time}
                                    schedule_start_date={
                                      val.schedule_start_date
                                    }
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
                          </div>
                        </div>
                      ))}
                  </Carousel>
                </div>
              </div>
            )
          )}
          <PremiumPackagesView />

          <div className="grid grid-cols-2 comman-padding top">
            <div className="col-span-1 comman-black-lg flex items-center">
              {t("nearby_events")}
            </div>
            {eventsList && eventsList.length > 0 && (
              <div className="col-span-1 space-x-3 flex justify-end">
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

                <ScrollActionBtn
                  Ref={eventRef}
                  scrollLength={308}
                  leftArrowId={"left-arrow-event"}
                  rightArrowId={"right-arrow-event"}
                />
              </div>
            )}
          </div>
          {eventLoading ? (
            <HorizontalScrollRoundedCardSkeleton height={196} width={280} />
          ) : (
            <div
              className="flex overflow-x-scroll px-4 space-x-4 remove-scrollbar-width"
              ref={eventRef}
            >
              {eventsList && eventsList.length > 0 ? (
                eventsList.slice(0, 6).map((value, index) => (
                  <div key={index}>
                    <div
                      className="home-page-card-web flex justify-center border-library relative cursor overflow-hidden"
                      onClick={() => {
                        if (
                          !addressData &&
                          value.is_paid_event === BIT_VALUE.One
                        ) {
                          setShowAddressModel(true);
                          return;
                        }
                        navigate(userRoute.eventDetail, {
                          state: { id: value.id, sp: false },
                        });
                      }}
                    >
                      {value.app_media && value.app_media.length > 0 ? (
                        value.app_media[0].media_type === MEDIA_TYPE.image ? (
                          <ICImage
                            height={162}
                            width={288}
                            imageUrl={value.app_media[0]?.media_url}
                            alt={value.title}
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
                          height={162}
                          width={288}
                          alt={value.title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      )}

                      {value.is_paid_event === IS_PREMIUM.Yes &&
                      value.has_subscribed === IS_SUBSCRIBED.Yes ? (
                        <div className="uppercase absolute top-3 left-0">
                          <div className="text-subscribed text-skin-on-primary">
                            {t("subscribed")}
                          </div>
                        </div>
                      ) : (
                        value.is_paid_event === IS_PREMIUM.Yes &&
                        value.has_subscribed === IS_SUBSCRIBED.No && (
                          <div className="favorites absolute top-1 left-1">
                            <div className="h-6 w-6 ">{premiumIcon}</div>
                          </div>
                        )
                      )}
                    </div>
                    <p className="comman-black-text mt-[10px]">
                      <ShrinkText text={value.title} maxLength={30} />
                    </p>
                  </div>
                ))
              ) : (
                <NoData title={t("event")} height={100} width={100} />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 comman-padding top">
            <div className="col-span-1 comman-black-lg flex items-center">
              {t("free")}
            </div>
            {freeServicesList.length > 0 && (
              <div className="col-span-1 space-x-3 flex justify-end">
                <div
                  className="flex space-x-2 cursor "
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

                <ScrollActionBtn
                  Ref={freeServiceRef}
                  scrollLength={308}
                  leftArrowId={"left-arrow-event"}
                  rightArrowId={"right-arrow-event"}
                />
              </div>
            )}
          </div>
          {freeServiceLoading ? (
            <HorizontalScrollRoundedCardSkeleton
              height={240}
              width={256}
              fontSize={32}
            />
          ) : (
            <div
              className="flex overflow-x-scroll px-4 space-x-4 remove-scrollbar-width"
              ref={freeServiceRef}
            >
              {freeServicesList && freeServicesList.length > 0 ? (
                freeServicesList.map((value, index) => (
                  <div key={index}>
                    <div
                      className="home-page-card-web flex justify-center border-library relative overflow-hidden cursor"
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
                            height={162}
                            width={288}
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
                          height={162}
                          width={288}
                          alt={value.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      )}
                    </div>
                    <p className="comman-black-text mt-[10px]">
                      <ShrinkText text={value.service_title} maxLength={30} />
                    </p>
                  </div>
                ))
              ) : (
                <NoData title={t("service")} height={100} width={100} />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 comman-padding top">
            <div className="col-span-1 comman-black-lg flex items-center">
              {t("trending_now")}
            </div>
            {servicesList.length > 0 && (
              <div className="col-span-1 space-x-3 flex justify-end">
                <div
                  className="flex space-x-2 cursor "
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

                <ScrollActionBtn
                  Ref={trendRef}
                  scrollLength={308}
                  leftArrowId={"left-arrow-event"}
                  rightArrowId={"right-arrow-event"}
                />
              </div>
            )}
          </div>
          {trendLoading ? (
            <HorizontalScrollRoundedCardSkeleton
              height={240}
              width={256}
              fontSize={32}
            />
          ) : (
            <div
              className="flex overflow-x-scroll px-4 space-x-4 remove-scrollbar-width"
              ref={trendRef}
            >
              {servicesList && servicesList.length > 0 ? (
                servicesList.map((value, index) => (
                  <div key={index}>
                    <div
                      className="home-page-card-web flex justify-center border-library relative overflow-hidden cursor"
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
                            height={162}
                            width={288}
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
                          height={162}
                          width={288}
                          alt={value.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      )}
                    </div>
                    <p className="comman-black-text mt-[10px]">
                      <ShrinkText text={value.service_title} maxLength={30} />
                    </p>
                  </div>
                ))
              ) : (
                <NoData title={t("service")} height={100} width={100} />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 comman-padding top">
            <div className="col-span-1 comman-black-lg flex items-center">
              {t("discover")}
            </div>
            {servicesDiscoverList.length > 0 && (
              <div className="col-span-1 space-x-3 flex justify-end">
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

                <ScrollActionBtn
                  Ref={discoverRef}
                  scrollLength={308}
                  leftArrowId={"left-arrow-event"}
                  rightArrowId={"right-arrow-event"}
                />
              </div>
            )}
          </div>
          {discoverLoading ? (
            <HorizontalScrollRoundedCardSkeleton height={240} width={256} />
          ) : (
            <div
              className="flex overflow-x-scroll px-4 space-x-4 remove-scrollbar-width mb-4"
              ref={discoverRef}
            >
              {servicesDiscoverList && servicesDiscoverList.length > 0 ? (
                servicesDiscoverList.map((value, index) => (
                  <div key={index}>
                    <div
                      className="home-page-card-web flex justify-center border-library relative overflow-hidden cursor"
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
                            height={162}
                            width={288}
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
                          height={162}
                          width={288}
                          alt={value.service_title}
                          className="w-full h-full rounded-lg aspect-16/9"
                          scaled={false}
                        />
                      )}
                    </div>
                    <p className="comman-black-text mt-[10px]">
                      <ShrinkText text={value.service_title} maxLength={30} />
                    </p>
                  </div>
                ))
              ) : (
                <NoData title={t("service")} height={100} width={100} />
              )}
            </div>
          )}

          <div className="mb-5">
            {servicesByCategoryList &&
              servicesByCategoryList.length > 0 &&
              servicesByCategoryList.map((item, index) => {
                return (
                  <ServiceCategory
                    key={index}
                    item={item}
                    serviceByCategoryLoading={serviceByCategoryLoading}
                    showScollBotton
                  />
                );
              })}
          </div>

          {showAddressModel && (
            <AddressModel
              modelOpen={showAddressModel}
              setModelOpen={setShowAddressModel}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
