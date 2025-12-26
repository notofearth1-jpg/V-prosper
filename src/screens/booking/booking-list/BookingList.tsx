import React, { useEffect, useRef, useState } from "react";
import {
  convertTimeStringToTime,
  dateFormat,
  ensureHttpsUrl,
  getLocalDate,
  isMobileDevice,
} from "../../../utils/AppFunctions";
import { exitArrow, rupeeIcon } from "../../../assets/icons/SvgIconList";
import { IBookingList, fetchBookingListApi } from "./BookingListController";
import ICImage from "../../../core-component/ICImage";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import usePaginationHook from "../../../hooks/UsePaginationHook";
import VerticalBuffer from "../../../components/common/VerticalBuffer";
import { IPagination } from "../../../data/AppInterface";
import { PAGINATION_PER_PAGE_ROWS } from "../../../utils/AppConstants";
import { TReactSetState, TScrollEvent } from "../../../data/AppType";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../../routes/RouteUser";
import { BOOKING_STATUS } from "../../../utils/AppEnumerations";
import BookingListSkeleton from "./booking-skeleton/BookingListSkeleton";
import NoData from "../../../components/common/NoData";
import BookingJoinButton from "./BookingJoinButton";

const BookingList: React.FC = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bufferLoading, setLBufferLoading] = useState(false);
  const [overAllBookingSpend, setOverAllBookingSpend] = useState<string>("");
  const [bookingList, setBookingList] = useState<IBookingList[]>([]);
  let timer: NodeJS.Timeout;
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: PAGINATION_PER_PAGE_ROWS.Twenty,
      current_page: 1,
      sort_by: "",
      order_by: "DESC",
    },
  });
  const listInnerRef = useRef<HTMLDivElement>(null);
  const fetchBookingList = async (
    objPagination: IPagination,
    setLoading: TReactSetState<boolean>
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await fetchBookingListApi(
        setOverAllBookingSpend,
        setLoading,
        setBookingList,
        setPagination,
        objPagination,
        bookingList
      );
    }, 500);
  };

  useEffect(() => {
    fetchBookingList(pagination, setLoading);
  }, []);

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 1 >= scrollHeight;
      if (
        !loading &&
        isNearBottom &&
        bookingList &&
        pagination.total_count > bookingList.length
      ) {
        fetchBookingList(
          {
            ...pagination,
            current_page: pagination.current_page + 1,
          },
          setLBufferLoading
        );
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener(
        "scroll",
        onScroll as unknown as EventListener
      );
    }

    return () => {
      if (listInnerElement)
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
    };
  }, [pagination]);

  const isBookingExpired = (schedule_end_date: string) =>
    getLocalDate() > getLocalDate(schedule_end_date + "T23:59:59");

  return (
    <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
      <div className="flex justify-between">
        <div
          className="w-7 cursor-pointer"
          onClick={() =>
            navigate(isMobileDevice() ? userRoute.profile : userRoute.home)
          }
        >
          {exitArrow}
        </div>
        <div className="comman-black-big flex justify-items-end space-x-1">
          <div>{t("total_spend")}:</div>
          <div className="h-3 w-3 pt-[5px]"> {rupeeIcon}</div>
          <div>{overAllBookingSpend}</div>
        </div>
      </div>
      <div
        className="flex overflow-y-scroll flex-1 top justify-center"
        ref={listInnerRef}
      >
        <div className="w-full lg:w-9/12 cursor-pointer">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div key={index}>
                <BookingListSkeleton />
              </div>
            ))
          ) : (
            <>
              {bookingList && bookingList && bookingList.length > 0 ? (
                bookingList?.map((val) => (
                  <div
                    className="booking-card mb-4 pb-4"
                    key={val.id}
                    onClick={() => {
                      navigate(userRoute.bookingDetails, {
                        state: { bookingId: val.id },
                      });
                    }}
                  >
                    <div className="flex p-2 items-center justify-center">
                      <div className="h-[80px] w-[80px] mr-3">
                        <ICImage
                          imageUrl={val.service_media_url}
                          alt={val.service_title}
                          className="!h-80px !w-[80px] !rounded-full aspect-[1/1] object-cover"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between">
                          <div className="text-wrap">
                            <div className="comman-black-text !text-[16px]">
                              {val.service_title}
                            </div>
                            <div className="comman-grey !text-[12px] flex space-x-2">
                              <div>
                                {dateFormat(
                                  getLocalDate(
                                    val.schedule_start_date
                                      ? val.schedule_start_date
                                      : ""
                                  )
                                )}
                              </div>
                              <div>
                                {convertTimeStringToTime(val.schedule_time)}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-2.5 h-2.5 pt-1">{rupeeIcon}</div>
                            <div className="">
                              {val?.service_discounted_price ? (
                                <>
                                  <p className="mx-1 comman-black-text text-[16px]">
                                    {`${val.service_discounted_price}`.replace(
                                      "$",
                                      ""
                                    )}
                                  </p>
                                  <p className="mx-1 comman-grey !text-[12px] line-through">
                                    {`${val.service_cost}`.replace("$", "")}
                                  </p>
                                </>
                              ) : (
                                <p className="mx-1 comman-black-text text-[16px]">
                                  {`${val?.service_cost}`.replace("$", "")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2">
                          <div
                            className={`text-[14px] flex items-center ${
                              val.booking_status ===
                                BOOKING_STATUS.BookingConfirmed &&
                              "text-skin-payment-successful"
                            } ${
                              val.booking_status ===
                                BOOKING_STATUS.AwaitingConfirmation &&
                              "text-skin-payment-waiting"
                            } ${
                              val.booking_status === BOOKING_STATUS.Cancelled ||
                              (val.booking_status === BOOKING_STATUS.Failed &&
                                "text-skin-payment-cancelled")
                            }`}
                          >
                            {val.booking_status_label}
                          </div>

                          {val.booking_status ===
                            BOOKING_STATUS.BookingConfirmed &&
                            !isBookingExpired(val.schedule_end_date) && (
                              <div>
                                <BookingJoinButton
                                  isOffline={val.is_offline}
                                  schedule_time={val.schedule_time}
                                  schedule_start_date={val.schedule_start_date}
                                  schedule_end_date={val.schedule_end_date}
                                  session_id={val.session_id}
                                  handleJoinButton={(event) => {
                                    event.stopPropagation();
                                    // we need this for zoom meeting
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
                              </div>
                            )}
                          {/* this code is useful for updates */}
                          {/* <div> 
                              {val.booking_status ===
                                BOOKING_STATUS.BookingConfirmed &&
                              calculateDaysLeft(val.schedule_start_date) > 0 ? (
                                <div className="bg-skin-primary-button text-xs rounded-full py-1 px-2 w-fit text-skin-on-primary">{`${calculateDaysLeft(
                                  val.schedule_start_date
                                )} ${
                                  calculateDaysLeft(val.schedule_start_date) > 1
                                    ? t("days_left")
                                    : t("day_left")
                                }`}</div>
                              ) : (
                                <>
                                  {!isBookingExpired(val.schedule_end_date) &&
                                    val.booking_status ===
                                      BOOKING_STATUS.BookingConfirmed &&
                                    val.session_id &&
                                    (val.is_offline === IS_OFFLINE.No ? (
                                      <div
                                        className="bg-skin-primary-button text-xs rounded-full py-1 px-2 w-fit text-skin-on-primary"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          navigate(userRoute.zoom, {
                                            state: {
                                              sessionId: val.session_id,
                                            },
                                          });
                                        }}
                                      >
                                        {t("join_now")}
                                      </div>
                                    ) : (
                                      <div className="comman-border text-xs !rounded-full py-1 px-2 w-fit ">
                                        {t(IS_OFFLINE_VALUES.Offline)}
                                      </div>
                                    ))}
                                </>
                              )}
                            </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <NoData title={t("booking")} height={200} width={200} />
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
    </div>
  );
};

export default BookingList;
