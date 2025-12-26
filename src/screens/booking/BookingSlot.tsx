import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { leftArrow, rightArrow } from "../../assets/icons/SvgIconList";
import {
  IBookingSummary,
  IOrder,
  ISlotDate,
  calculateEndDate,
  calculateEndTime,
  fetchBookingSummary,
  fetchServiceDate,
  getDayOfWeek,
  getScheduleByDate,
  serviceBooking,
} from "./BookingController";
import {
  decryptData,
  financialStr,
  getLocalDate,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  IServiceForSubCategory,
  fetchServiceForSubCategoryApi,
} from "../product-services/Web/ProductServiceDetailsWebController";
import PwaCarousel from "../../components/common/PwaCarousel";
import Loader from "../../components/common/Loader";
import moment from "moment";
import ICButton from "../../core-component/ICButton";
import VerticalBuffer from "../../components/common/VerticalBuffer";
import { RazorpayOptions } from "react-razorpay";
import {
  CALLING_CODE,
  RP_COMPANY_NAME,
  RP_KEY_ID,
} from "../../config/AppConfig";
import useRazorpay from "react-razorpay";
import { userRoute } from "../../routes/RouteUser";
import Swal from "sweetalert2";
import ICCustomModal from "../../components/common/ICCustomModal";

const BookingSlot = () => {
  let timer: NodeJS.Timeout;
  const location = useLocation();
  const id: number = location?.state?.id;
  const [Razorpay] = useRazorpay();
  const { t } = UseTranslationHook();
  const [slot, setSlot] = useState<string[] | undefined>([]);
  const [shortedSlot, setShortedSlot] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [innerLoading, setInnerLoading] = useState(false);
  const [serviceForSubCategory, setServiceForSubCategory] =
    useState<IServiceForSubCategory | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<string>("");
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<IBookingSummary>();
  const [summaryLoading, setSummaryLoading] = useState(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [chunkedDates, setChunkedDates] = useState<ISlotDate[][]>([]);

  useEffect(() => {
    fetchBookingDate();
    fetchServiceForSubCategoryApi(setServiceForSubCategory, setLoading, id, t);
  }, []);

  const fetchBookingDate = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      await fetchServiceDate(
        setChunkedDates,
        setSelectedDate,
        id,
        setInnerLoading
      );
    }, 500);
  };

  // Effect for change slot when selected date change
  useEffect(() => {
    if (selectedDate) {
      setSlot(getScheduleByDate(chunkedDates, selectedDate)?.schedule_time);
    } else {
      setSlot([]);
    }
  }, [selectedDate]);

  const handleOrderSummary = () => {
    setIsBottomDivVisible(true);
    fetchBookingSummary(setBookingSummary, id, setSummaryLoading);
  };

  const handleSlotClick = (index: number | null, item: string) => {
    setActiveIndex(index);
    setActiveSlot(item);
  };

  useEffect(() => {
    if (isBottomDivVisible) {
      // Scroll to the top
      window.scrollTo(0, 0);
      document.body.classList.add("no-scroll");
    } else {
      // Scroll to the bottom
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [isBottomDivVisible]);

  const handleOpenModal = (message: string) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_book"),
    }).then((result) => {
      if (result.isConfirmed) {
        handlePayment(true);
      }
    });
  };

  const handleOpenModalForFreeService = (message: string) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_book"),
    }).then((result) => {
      if (result.isConfirmed) {
        handelBookFreeService(true);
      }
    });
  };

  const handleOrderDetails = async (
    hasConsent: boolean = false
  ): Promise<IOrder | undefined> => {
    try {
      const orderDetailsPayload = {
        service_id: id,
        date: moment(selectedDate).format("DD/MM/YYYY"),
        slot: activeSlot ? activeSlot : "",
        ...(hasConsent ? { slot_conflict_consent: "1" } : {}),
      };

      const fetchedOrderDetails = await serviceBooking(
        orderDetailsPayload,
        setLoading
      );

      if (fetchedOrderDetails?.order_id) {
        return fetchedOrderDetails;
      } else if (fetchedOrderDetails.data === "BookingSlotConflict") {
        handleOpenModal(fetchedOrderDetails.message);
        return;
      } else {
        sweetAlertError(fetchedOrderDetails.message);
      }
    } catch (error: any) {
      return error;
    }
  };

  const handelBookFreeService = async (hasConsent: boolean = false) => {
    const orderDetailsPayload = {
      service_id: id,
      date: moment(selectedDate).format("DD/MM/YYYY"),
      slot: activeSlot ? activeSlot : "",
      ...(hasConsent ? { slot_conflict_consent: "1" } : {}),
    };

    const bookService = await serviceBooking(orderDetailsPayload, setLoading);

    if (!bookService) {
      sweetAlertSuccess(t("slot_booked"));
      navigate(userRoute.home);
    } else if (bookService.data === "BookingSlotConflict") {
      handleOpenModalForFreeService(bookService.message);
      return;
    } else {
      sweetAlertError(bookService?.message || t("something_want_wrong"));
      navigate(userRoute.home);
    }
  };

  const handlePayment = useCallback(
    async (hasConsent: boolean) => {
      setIsBottomDivVisible(false);
      const orderDetails = await handleOrderDetails(hasConsent);

      if (!orderDetails) {
        return;
      }

      const options: RazorpayOptions = {
        prefill: {
          contact: CALLING_CODE + decryptData(orderDetails.contact_number),
        },
        key: RP_KEY_ID,
        amount: orderDetails.amount.toString(),
        currency: orderDetails.currency,
        name: RP_COMPANY_NAME,
        description: orderDetails.description,
        order_id: orderDetails.order_id,
        handler: (res) => {
          if (res.razorpay_payment_id) {
            sweetAlertSuccess(t("slot_booked"));
            navigate(userRoute.home);
          } else {
            sweetAlertError(t("something_want_wrong"));
            navigate(userRoute.home);
          }
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, handleOrderDetails]
  );

  useEffect(() => {
    if (slot && slot.length > 0) {
      const sortedSlots = slot.slice().sort((a, b) => {
        const [hourA, minuteA, periodA] = a.split(/:| /);
        const [hourB, minuteB, periodB] = b.split(/:| /);

        // Convert to 24-hour format
        const hour24A = periodA === "PM" ? +hourA + 12 : +hourA;
        const hour24B = periodB === "PM" ? +hourB + 12 : +hourB;

        // Compare hours
        if (hour24A !== hour24B) {
          return hour24A - hour24B;
        }

        // If hours are the same, compare minutes
        return +minuteA - +minuteB;
      });
      setShortedSlot(sortedSlots);
      setActiveIndex(null);
      setActiveSlot("");
    }
  }, [slot]);

  const transactionSummary = (
    <div>
      {summaryLoading ? (
        <div className="flex justify-center items-center">
          <VerticalBuffer />
        </div>
      ) : (
        <>
          {bookingSummary && (
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full items-center mt-3">
                <div className="comman-black-lg">{t("service_cost")}</div>
                <div className="flex items-center">
                  {bookingSummary.discount_cost &&
                  bookingSummary.discount_cost > 0 ? (
                    <div className="comman-grey mr-2 line-through">
                      {financialStr(bookingSummary.cost)}
                    </div>
                  ) : (
                    <div className="font-bold">{bookingSummary.cost}</div>
                  )}

                  {bookingSummary.discount_cost &&
                  bookingSummary.discount_cost > 0 ? (
                    <div className="font-bold">
                      {financialStr(bookingSummary.discount_cost)}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {bookingSummary.transaction_charge &&
              bookingSummary.transaction_charge > 0 ? (
                <div className="top flex justify-between w-full items-center">
                  <div className="comman-black-lg">
                    {t("transaction_charge")}
                  </div>
                  <div className="font-bold">
                    {financialStr(bookingSummary.transaction_charge)}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {bookingSummary.tax && bookingSummary.tax > 0 ? (
                <div className="top flex justify-between w-full items-center">
                  <div className="comman-black-lg">{t("tax")}</div>
                  <div className="font-bold">
                    {financialStr(bookingSummary.tax)}
                  </div>
                </div>
              ) : (
                <></>
              )}

              {bookingSummary.total_amount &&
              bookingSummary.total_amount > 0 ? (
                <div className="flex justify-between w-full items-center top">
                  <div className="comman-black-lg">{t("total")}</div>
                  <div className="font-bold">
                    {financialStr(bookingSummary.total_amount)}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-defult overflow-scroll remove-scrollbar-width relative ">
          <div className="comman-padding absolute z-10">
            <BackButton />
          </div>
          <div className="flex flex-col items-center flex-1 h-svh md:h-[calc(100svh-76px)] overflow-y-scroll remove-scrollbar-width">
            <div className="md:w-3/4 lg:w-1/2 w-full">
              <div className="image">
                <div className="service-detail-pic flex xl:justify-start lg:justify-start col-span-2 justify-center rounded">
                  {serviceForSubCategory && (
                    <PwaCarousel
                      carouselItems={serviceForSubCategory.app_media}
                      autoPlaySpeed={4000}
                      autoPlay={
                        serviceForSubCategory.app_media.length > 1
                          ? true
                          : false
                      }
                      infinite={
                        serviceForSubCategory.app_media.length > 1
                          ? true
                          : false
                      }
                      arrows={false}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="service-description comman-padding md:w-3/4 lg:w-1/2 w-full flex-1">
              <div>
                <div className="flex items-center justify-center">
                  <div
                    className={`w-5 h-5  ${
                      currentIndex > 0 && "cursor"
                    } svg-color`}
                    onClick={() => {
                      currentIndex > 0 && setCurrentIndex(currentIndex - 1);
                      currentIndex > 0 &&
                        setSelectedDate(
                          chunkedDates[currentIndex - 1][0].schedule_date
                        );
                    }}
                  >
                    {currentIndex > 0 && leftArrow}
                  </div>

                  <p className="comman-black-text margin-all">
                    {selectedDate && moment(selectedDate).format("MMM YYYY")}
                  </p>

                  <div
                    className={`w-5 h-5 ${
                      chunkedDates.length !== 0 &&
                      currentIndex + 1 !== chunkedDates.length &&
                      "cursor"
                    } svg-color`}
                    onClick={() => {
                      chunkedDates.length > 0 &&
                        currentIndex + 1 !== chunkedDates.length &&
                        setCurrentIndex(currentIndex + 1);
                      chunkedDates.length > 0 &&
                        currentIndex + 1 !== chunkedDates.length &&
                        setSelectedDate(
                          chunkedDates[currentIndex + 1][0].schedule_date
                        );
                    }}
                  >
                    {chunkedDates.length !== 0 &&
                      currentIndex + 1 !== chunkedDates.length &&
                      rightArrow}
                  </div>
                </div>
                <div className="top">
                  {chunkedDates && chunkedDates.length > 0 && (
                    <div className="flex overflow-x-scroll scrolling-space remove-scrollbar-width justify-center">
                      {chunkedDates[currentIndex].map((dateString, index) => {
                        const date: Date = getLocalDate(
                          dateString.schedule_date
                        );
                        const dayOfWeek: string = getDayOfWeek(
                          dateString.schedule_date
                        );
                        const dayOfMonth: number = date.getDate();

                        return (
                          <div
                            key={index}
                            className={`flex-shrink-0 date-container services-bg mr-3 !rounded cursor-pointer ${
                              dateString.schedule_date === selectedDate
                                ? "active "
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedDate(dateString.schedule_date);
                            }}
                          >
                            <p
                              className={`comman-black-text ${
                                dateString.schedule_date === selectedDate
                                  ? "!text-white"
                                  : ""
                              }`}
                            >
                              {dayOfWeek}
                            </p>
                            <p
                              className={`mt-3 comman-black-text  ${
                                dateString.schedule_date === selectedDate
                                  ? "!text-white"
                                  : ""
                              }`}
                            >
                              {dayOfMonth}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {innerLoading ? (
                  <div className="flex justify-center items-center">
                    <VerticalBuffer />
                  </div>
                ) : (
                  <>
                    {slot && slot.length > 0 ? (
                      <div className="cursor">
                        <div className="text-center top comman-black-text">
                          <p>{t("time_slot")}</p>
                        </div>
                        {shortedSlot && shortedSlot.length > 0 && (
                          <div className="overflow-x-auto top">
                            <div className="flex flex-wrap justify-evenly">
                              {shortedSlot.map((item, index) => (
                                <div
                                  className={`cursor flex items-center justify-center time-container services-bg mr-2 mb-2 ${
                                    index === activeIndex ? "active" : ""
                                  }`}
                                  key={index}
                                  onClick={() => handleSlotClick(index, item)}
                                >
                                  <p className="m-0">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center comman-grey top">
                        {t("no_slot")}
                      </div>
                    )}
                  </>
                )}

                {slot && slot.length > 0 && (
                  <div className="top comman-black-text">
                    <p>{t("booking_information")}</p>
                  </div>
                )}

                {serviceForSubCategory && (
                  <div className="top">
                    <div className="booking-info services-bg">
                      <p className="comman-black-big">
                        {serviceForSubCategory?.service_title}
                      </p>

                      {serviceForSubCategory && selectedDate && (
                        <p className="comman-black-big top">
                          {`${moment(selectedDate).format(
                            "D MMMM YYYY"
                          )} - ${calculateEndDate(
                            selectedDate,
                            serviceForSubCategory?.service_duration
                          )}`}
                        </p>
                      )}

                      {slot && slot.length > 0 && activeSlot && (
                        <p className="comman-black-big top">
                          {activeSlot && serviceForSubCategory.session_duration
                            ? `${activeSlot} - ${calculateEndTime(
                                activeSlot,
                                serviceForSubCategory.session_duration
                              )} `
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {bookingSummary && (
                  <ICCustomModal
                    title={t("payment_summary")}
                    content={transactionSummary}
                    buttonTitle={
                      <React.Fragment>
                        <div className="flex items-center justify-center">
                          <p>{t(`pay`)}</p>
                          <p className="ml-2">₹{bookingSummary.total_amount}</p>
                        </div>
                      </React.Fragment>
                    }
                    isModalShow={isBottomDivVisible}
                    setIsModalShow={setIsBottomDivVisible}
                    handleSubmitButton={() => {
                      handlePayment(false);
                    }}
                  />
                )}

                <div className="w-full top">
                  {serviceForSubCategory &&
                  Number(serviceForSubCategory.service_cost) === 0 ? (
                    <ICButton
                      type="button"
                      className={`px-6 py-3 text-sm font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca] focus:outline-none w-full ${
                        (slot && slot.length === 0) || activeSlot === ""
                          ? "cursor-not-allowed comman-disablebtn"
                          : "comman-btn"
                      }`}
                      disabled={
                        (slot && slot.length === 0) || activeSlot === ""
                      }
                      onClick={() => {
                        handelBookFreeService(false);
                      }}
                    >
                      <p className="comman-white-text">
                        {t("confirm_booking")}
                      </p>
                    </ICButton>
                  ) : slot && slot.length > 0 ? (
                    <ICButton
                      type="button"
                      className={`px-6 py-3 text-sm font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca] focus:outline-none w-full ${
                        (slot && slot.length === 0) || activeSlot === ""
                          ? "cursor-not-allowed comman-disablebtn"
                          : "comman-btn"
                      }`}
                      disabled={
                        (slot && slot.length === 0) || activeSlot === ""
                      }
                      onClick={handleOrderSummary}
                    >
                      <p className="comman-white-text">
                        {t("proceed_for_Payment")}
                      </p>
                    </ICButton>
                  ) : (
                    <></>
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

export default BookingSlot;
