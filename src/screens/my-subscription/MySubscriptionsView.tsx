import React, { useEffect, useRef, useState } from "react";
import {
  IMySubscription,
  getAllLibraryPackages,
  getAllMyEventPackages,
  getAllMyPremiumPackages,
} from "./MySubscriptionsController";
import BackButton from "../../components/common/BackButton";
import { SUBSCRIPTION_TABS, USER_ROLE } from "../../utils/AppEnumerations";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import VerticalBuffer from "../../components/common/VerticalBuffer";
import { rupeeIcon } from "../../assets/icons/SvgIconList";
import { getLocalDate } from "../../utils/AppFunctions";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { IPagination } from "../../data/AppInterface";
import { TReactSetState, TScrollEvent } from "../../data/AppType";
import MySubscriptionViewSkeleton from "./my-subscription-skeleton/MySubscriptionViewSkeleton";
import NoData from "../../components/common/NoData";
import { userRoute } from "../../routes/RouteUser";
import { useNavigate } from "react-router-dom";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import {
  IPremiumPackage,
  getPremiumPackageById,
} from "../premium-package/PremiumPackagesController";
import { ILibrary } from "../library/LibraryController";
import PremiumPackagePayment from "../premium-package/PremiumPackagePayment";

const MySubscriptionsView = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);
  let timer: NodeJS.Timeout;
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const savedTab = sessionStorage.getItem("subScriptionActiveTab");
  const userRole = Number(localStorageUtils.getRole());
  const [activeTab, setActiveTab] = useState<number>(() => {
    return savedTab ? parseInt(savedTab, 10) : SUBSCRIPTION_TABS.PremiumPackage;
  });
  const [myPremiumPackageList, setMyPremiumPackageList] = useState<
    IMySubscription[]
  >([]);
  const [myEventPackageList, setMyEventPackageList] = useState<
    IMySubscription[]
  >([]);
  const [myLibraryPackageList, setMyLibraryPackageList] = useState<
    IMySubscription[]
  >([]);
  const [bufferLoading, setBufferLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [premiumPackageLoading, setPremiumPackageLoading] = useState(false);

  const [premiumPackage, setPremiumPackage] = useState<IPremiumPackage>();
  const [showPremiumPackagePaymentModal, setShowPremiumPackagePaymentModal] =
    useState(false);
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const {
    pagination: premiumPackagePagination,
    setPagination: setPremiumPackagePagination,
  } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });
  const {
    pagination: eventPackagePagination,
    setPagination: setEventPackagePagination,
  } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });
  const {
    pagination: libraryPackagePagination,
    setPagination: setLibraryPackagePagination,
  } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });

  useEffect(() => {
    sessionStorage.setItem("subScriptionActiveTab", activeTab.toString());
  }, [activeTab]);
  useEffect(() => {
    if (
      myPremiumPackageList.length < 1 &&
      activeTab === SUBSCRIPTION_TABS.PremiumPackage
    ) {
      fetchPremiumPackage(setLoading, premiumPackagePagination);
    } else if (
      myEventPackageList.length < 1 &&
      activeTab === SUBSCRIPTION_TABS.Event
    ) {
      fetchEventPackage(setLoading, eventPackagePagination);
    } else if (
      myLibraryPackageList.length < 1 &&
      activeTab === SUBSCRIPTION_TABS.Library
    ) {
      fetchLibraryPackage(setLoading, libraryPackagePagination);
    }
  }, [activeTab]);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  const fetchPremiumPackage = (
    setLoading: TReactSetState<boolean>,
    payloadPremiumPackagePagination: IPagination
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      getAllMyPremiumPackages(
        setLoading,
        myPremiumPackageList,
        setMyPremiumPackageList,
        setPremiumPackagePagination,
        payloadPremiumPackagePagination
      );
    }, 500);
  };
  const fetchEventPackage = (
    setLoading: TReactSetState<boolean>,
    payloadEventPackagePagination: IPagination
  ) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      getAllMyEventPackages(
        setLoading,
        myEventPackageList,
        setMyEventPackageList,
        setEventPackagePagination,
        payloadEventPackagePagination
      );
    }, 500);
  };
  const fetchLibraryPackage = (
    setLoading: TReactSetState<boolean>,
    payloadLibraryPackagePagination: IPagination
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      getAllLibraryPackages(
        setLoading,
        myLibraryPackageList,
        setMyLibraryPackageList,
        setLibraryPackagePagination,
        payloadLibraryPackagePagination
      );
    }, 500);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 5 >= scrollHeight;

      if (
        isNearBottom &&
        myPremiumPackageList &&
        myEventPackageList &&
        myLibraryPackageList
      ) {
        activeTab === SUBSCRIPTION_TABS.PremiumPackage &&
        myPremiumPackageList.length > 0 &&
        premiumPackagePagination.total_count > myPremiumPackageList.length
          ? fetchPremiumPackage(setBufferLoading, {
              ...premiumPackagePagination,
              current_page: premiumPackagePagination.current_page + 1,
            })
          : activeTab === SUBSCRIPTION_TABS.Event &&
            myEventPackageList.length > 0 &&
            eventPackagePagination.total_count > myEventPackageList.length
          ? fetchEventPackage(setBufferLoading, {
              ...eventPackagePagination,
              current_page: eventPackagePagination.current_page + 1,
            })
          : activeTab === SUBSCRIPTION_TABS.Library &&
            myLibraryPackageList.length > 0 &&
            libraryPackagePagination.total_count >
              myLibraryPackageList.length &&
            fetchLibraryPackage(setBufferLoading, {
              ...libraryPackagePagination,
              current_page: libraryPackagePagination.current_page + 1,
            });

        event.preventDefault();
      }
    }
  };
  const fetchPremiumPackageById = async (id: number) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      !loading &&
        getPremiumPackageById(
          id,
          setPremiumPackage,
          setPremiumPackageLoading,
          setShowPremiumPackagePaymentModal,
          setLibraryList,
          true
        );
    }, 500);
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener(
        "scroll",
        onScroll as unknown as EventListener
      );
      return () => {
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
      };
    }
  }, [
    activeTab,
    myLibraryPackageList,
    myEventPackageList,
    myPremiumPackageList,
  ]);

  const isExpired = (expirationDate: string): boolean => {
    const currentDate = getLocalDate();
    const expiration = getLocalDate(expirationDate);
    return expiration < currentDate;
  };

  const listComponent = (
    mediaUrl: string,
    title: string,
    purchaseDate: string,
    expireDate: string,
    price: string,
    discountPrice: string,
    subscriptionType: number
  ) => (
    <div
      className={`${
        premiumPackageLoading ? "cursor-wait" : ""
      } flex p-2 space-x-2.5 items-center`}
    >
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-wrap">
            <div className="comman-black-text subscription-list-title-font-size">
              {title}
            </div>
            <div className={`comman-grey subscription-list-subtitle-font-size`}>
              {t("subscribed_on")}: {getLocalDate(purchaseDate).toDateString()}
            </div>
            {subscriptionType === SUBSCRIPTION_TABS.PremiumPackage && (
              <div
                className={`comman-grey subscription-list-subtitle-font-size ${
                  isExpired(expireDate) ? "!text-skin-payment-cancelled" : ""
                }`}
              >
                {expireDate !== null ? (
                  <>
                    {t("expire")}: {getLocalDate(expireDate).toDateString()}
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <div className="flex">
            <div className="subscription-rupee">{rupeeIcon}</div>
            <div className="">
              {discountPrice ? (
                <>
                  <p className="mx-1 comman-black-text subscription-list-title-font-size">
                    {`${discountPrice}`}
                  </p>
                  <p className="mx-1 comman-grey subscription-list-subtitle-font-size line-through">
                    {`${price}`}
                  </p>
                </>
              ) : (
                <p className="mx-1 comman-black-text subscription-list-title-font-size">
                  {`${price}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col  overflow-hidden h-svh md:h-[calc(100vh-76px)] comman-padding">
      <div>
        <div>
          <BackButton />
        </div>

        <div className="text-sm font-medium text-center  border-b   border-skin-favorite-color top">
          <ul className="flex overflow-x-scroll remove-scrollbar-width scrolling-space -mb-px favorites-list text-nowrap">
            <li
              className="me-2 cursor"
              onClick={() => handleTabClick(SUBSCRIPTION_TABS.PremiumPackage)}
            >
              <div
                className={`inline-block p-4 ${
                  activeTab === SUBSCRIPTION_TABS.PremiumPackage
                    ? "active-text active-border border-b-2 "
                    : ""
                }  rounded-t-lg active text-skin-favorite-label  flex`}
                aria-current="page"
              >
                {t("premium_package")}
              </div>
            </li>

            {userRole === USER_ROLE.Customer && (
              <li
                className="me-2 cursor"
                onClick={() => handleTabClick(SUBSCRIPTION_TABS.Event)}
              >
                <div
                  className={`inline-block p-4 ${
                    activeTab === SUBSCRIPTION_TABS.Event
                      ? "active-text active-border border-b-2"
                      : ""
                  }  rounded-t-lg active text-skin-favorite-label  flex`}
                  aria-current="page"
                >
                  {t("event")}
                </div>
              </li>
            )}

            <li
              className="me-2 cursor"
              onClick={() => handleTabClick(SUBSCRIPTION_TABS.Library)}
            >
              <div
                className={`inline-block p-4 ${
                  activeTab === SUBSCRIPTION_TABS.Library
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
      </div>
      <div
        className="flex flex-1 justify-center w-full  overflow-y-scroll h-full"
        ref={listInnerRef}
      >
        <div className="mt-3 w-full md:w-3/4 xl:w-1/2  cursor-pointer">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div key={index}>
                <MySubscriptionViewSkeleton />
              </div>
            ))
          ) : (
            <>
              {activeTab === SUBSCRIPTION_TABS.PremiumPackage &&
              myPremiumPackageList &&
              myPremiumPackageList.length > 0
                ? myPremiumPackageList?.map((val, index) => (
                    <div
                      className="booking-card cursor mb-4 pb-4 "
                      key={index}
                      onClick={() => {
                        fetchPremiumPackageById(val.entity_record_id);
                      }}
                    >
                      <>
                        {listComponent(
                          val.media_url,
                          val.entity_name,
                          val.subscription_date,
                          val.expiry_date,
                          val.subscription_price,
                          val.subscription_discounted_price,
                          SUBSCRIPTION_TABS.PremiumPackage
                        )}
                      </>
                    </div>
                  ))
                : activeTab === SUBSCRIPTION_TABS.PremiumPackage && (
                    <NoData
                      title={t("subscriptions")}
                      height={200}
                      width={200}
                    />
                  )}

              {activeTab === SUBSCRIPTION_TABS.Event &&
              myEventPackageList &&
              myEventPackageList.length > 0
                ? myEventPackageList?.map((val, index) => (
                    <div
                      className="booking-card cursor mb-4 pb-4 "
                      key={index}
                      onClick={() =>
                        navigate(userRoute.eventDetail, {
                          state: { id: val.entity_record_id, sp: true },
                        })
                      }
                    >
                      {listComponent(
                        val.media_url,
                        val.entity_name,
                        val.subscription_date,
                        val.expiry_date,
                        val.subscription_price,
                        val.subscription_discounted_price,
                        SUBSCRIPTION_TABS.Event
                      )}
                    </div>
                  ))
                : activeTab === SUBSCRIPTION_TABS.Event && (
                    <NoData
                      title={t("subscriptions")}
                      height={200}
                      width={200}
                    />
                  )}

              {activeTab === SUBSCRIPTION_TABS.Library &&
              myLibraryPackageList &&
              myLibraryPackageList.length > 0
                ? myLibraryPackageList?.map((val, index) => (
                    <div
                      className="booking-card mb-4 pb-4 cursor"
                      key={index}
                      onClick={() => {
                        navigate(
                          userRole === USER_ROLE.Trainer
                            ? val.entity_type === 3
                              ? routeTrainer.folderDetail
                              : routeTrainer.libraryDetails
                            : val.entity_type === 3
                            ? userRoute.folderDetail
                            : userRoute.libraryDetails,
                          {
                            state: {
                              id: val.entity_record_id,
                              heading: val.entity_name,
                              sp: true,
                            },
                          }
                        );
                      }}
                    >
                      {listComponent(
                        val.media_url,
                        val.entity_name,
                        val.subscription_date,
                        val.expiry_date,
                        val.subscription_price,
                        val.subscription_discounted_price,
                        SUBSCRIPTION_TABS.Library
                      )}
                    </div>
                  ))
                : activeTab === SUBSCRIPTION_TABS.Library && (
                    <NoData
                      title={t("subscriptions")}
                      height={200}
                      width={200}
                    />
                  )}
              {bufferLoading && (
                <div className="flex justify-center items-center">
                  <VerticalBuffer />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showPremiumPackagePaymentModal && premiumPackage && (
        <PremiumPackagePayment
          isSpecialPackage={true}
          libraryList={libraryList}
          setLibraryList={setLibraryList}
          premiumPackage={premiumPackage}
          setShowPremiumPackagePaymentModal={setShowPremiumPackagePaymentModal}
        />
      )}
    </div>
  );
};

export default MySubscriptionsView;
