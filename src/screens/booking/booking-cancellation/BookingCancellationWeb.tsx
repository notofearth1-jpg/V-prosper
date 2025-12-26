import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackButton from "../../../components/common/BackButton";
import {
  convertTimeStringToTime,
  dateFormat,
  prepareMessageFromParams,
  prepareUserId,
  sweetAlertError,
} from "../../../utils/AppFunctions";
import "react-responsive-modal/styles.css";
import { useLocation } from "react-router-dom";
import {
  StarIcon,
  calendarIcon,
  darkStarIcon,
  rightArrowIcon,
  rupeeIcon,
  vpServiceIcon,
} from "../../../assets/icons/SvgIconList";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  IBookingDetails,
  bookingCancelApiCall,
  bookingCancelChargeApiCall,
  calculateEndTimeDate,
  fetchBookingByIdApi,
} from "./BookingCancellationController";
import { userRoute } from "../../../routes/RouteUser";
import ICButton from "../../../core-component/ICButton";
import Loader from "../../../components/common/Loader";
import PwaCarousel from "../../../components/common/PwaCarousel";
import CustomEditor from "../../product-services/Web/CustomEditor";
import Swal from "sweetalert2";
import ICImage from "../../../core-component/ICImage";
import {
  BIT_VALUE,
  BOOKING_STATUS,
  DETAILS_TYPE,
  FEEDBACK_GIVEN,
  IS_OFFLINE_VALUES,
  USER_TYPE,
} from "../../../utils/AppEnumerations";
import { getLocalDate } from "../../../utils/AppFunctions";
import Feedback from "../../feedback/Feedback";
import ICCommonModal from "../../../components/common/ICCommonModel";
import {
  IRatingsAndReviews,
  getServiceRatingsAndReviews,
} from "../../feedback/FeedbackController";
import CourseContent from "../../../components/common/CourseContent";
import NoData from "../../../components/common/NoData";
import ICAccordion from "../../../core-component/ICAccordion";
import { calculateEndTime } from "../BookingController";

const BookingCancellationWeb = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<IBookingDetails>();
  const [loading, setLoading] = useState(false);
  const [bookingChargeLoading, setBookingChargeLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [review, setReviews] = useState<IRatingsAndReviews | null>(null);
  const bookingId = location?.state?.bookingId;
  const [activeTab, setActiveTab] = useState<string>(DETAILS_TYPE.Service);

  const handleAccordionClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingByIdApi(setLoading, setBookingDetails, bookingId);
    } else {
      navigate(userRoute.bookingList);
    }
  }, []);

  const handleCancellationBooking = async () => {
    await bookingCancelChargeApiCall(
      setBookingChargeLoading,
      handleOpenModal,
      bookingId
    );
  };

  const handleOpenModal = (
    refundPercentage: number,
    refundableAmount: number
  ) => {
    Swal.fire({
      title: t(
        refundPercentage === 0
          ? "zero_refund_message"
          : "confirm_cancel_booking_message"
      ),
      html: `
        <div class="p-0 w-full grid justify-items-start space-y-2">
          ${
            refundPercentage !== 0 &&
            bookingDetails &&
            Number(bookingDetails.service_cost) !== 0
              ? `<p><strong>Service Refund Percentage:</strong> ${refundPercentage}</p><p><strong>Service Refundable Amount:</strong> ${refundableAmount}</p>`
              : ""
          }
          <p><strong>${t("cancel_reason")}:</strong></p>        
        </div>
      `,
      input: "textarea",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: "text-xl font-bold",
      },
      preConfirm: (inputValue) => {
        if (!inputValue || inputValue.trim().length === 0) {
          Swal.showValidationMessage(
            t(
              prepareMessageFromParams(t("error_message_required"), [
                ["fieldName", t("reason_required")],
              ])
            )
          );
          return false;
        }
      },
    }).then(function (result) {
      if (result.value) {
        const cancelBooking = async () => {
          await bookingCancelApiCall(result.value, bookingId, navigate);
        };
        cancelBooking();
      }
    });
  };

  const isCancelable = () => {
    if (bookingDetails) {
      const currentTime = getLocalDate();
      const scheduleDateTime = getLocalDate(
        `${bookingDetails.schedule_date}T${bookingDetails.schedule_time}`
      );
      const cutoffTime = getLocalDate(scheduleDateTime);
      bookingDetails?.service.cancellation_cutoff_time_hours
        ? cutoffTime.setHours(
            cutoffTime.getHours() -
              bookingDetails?.service.cancellation_cutoff_time_hours
          )
        : cutoffTime.setHours(
            cutoffTime.getHours() -
              Number(bookingDetails?.cancellation_cutoff_hours)
          );
      if (currentTime < cutoffTime) {
        return true;
      } else {
        return false;
      }
    }
  };

  const canProvideFeedback = () => {
    if (bookingDetails) {
      const serviceEndTime = calculateEndTimeDate(
        bookingDetails?.schedule_date,
        bookingDetails?.schedule_time,
        bookingDetails?.service.unit_type_text,
        bookingDetails?.service.service_duration
      );
      const currentTime = getLocalDate();

      if (currentTime >= serviceEndTime) {
        return true;
      } else {
        return false;
      }
    }
  };
  useEffect(() => {
    bookingDetails?.service.id &&
      getServiceRatingsAndReviews(
        setLoading,
        setReviews,
        t,
        bookingDetails?.service.id
      );
  }, [bookingDetails?.service.id]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        bookingDetails && (
          <div className="container mx-auto overflow-hidden h-svh md:h-[calc(100vh-76px)]">
            <div className=" h-full flex flex-col">
              <div className="comman-padding">
                <BackButton />
              </div>
              <div className="overflow-y-scroll remove-scrollbar-width flex-1">
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-0 md:gap-4 overflow-x-scroll items-center">
                    <div className="flex xl:justify-start lg:justify-start col-span-2 justify-center items-center rounded w-full md:p-4">
                      {bookingDetails &&
                        bookingDetails.service.app_media &&
                        bookingDetails.service.app_media.length > 0 && (
                          <PwaCarousel
                            carouselItems={bookingDetails.service.app_media}
                            autoPlaySpeed={4000}
                            autoPlay={
                              bookingDetails.service.app_media.length > 1
                                ? true
                                : false
                            }
                            infinite={
                              bookingDetails.service.app_media.length > 1
                                ? true
                                : false
                            }
                            arrows={false}
                          />
                        )}
                    </div>
                    <div className="w-full flex flex-col col-span-3 justify-center xl:p-5 comman-padding">
                      <div className="flex justify-between">
                        <div className="flex items-center p-1 xl:p-0 border-r-2 w-full">
                          <div className="w-[34px] h-[30px] mr-1 pb-0.5 grid place-items-center svg-color">
                            {vpServiceIcon}
                          </div>
                          <p className="w-full comman-black-lg">
                            {bookingDetails?.service.service_title}
                          </p>
                        </div>
                        <div className="flex items-center px-2 justify-center border-r-2 w-full">
                          <div className="w-5 h-5 mr-1">{calendarIcon}</div>
                          {bookingDetails.service && (
                            <div className="w-fit comman-black-lg">
                              {bookingDetails?.service.service_duration}&nbsp;
                              {bookingDetails?.service.service_duration > 1
                                ? t("days")
                                : t("day")}
                            </div>
                          )}
                        </div>
                        {bookingDetails.service && (
                          <div className="flex items-center justify-center w-full">
                            <div>
                              <div>
                                {bookingDetails?.service_discounted_price ? (
                                  <div className="flex">
                                    <div className="w-6 mx-2 h-6 mt-1">
                                      {rupeeIcon}
                                    </div>
                                    <div>
                                      <p className="comman-black-lg">
                                        {`${bookingDetails.service_discounted_price}`}
                                      </p>
                                      <p className="comman-grey line-through">
                                        {`${bookingDetails.service_cost}`}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex">
                                    <div className="w-3 mx-2 h-3 mt-0.5">
                                      {rupeeIcon}
                                    </div>
                                    <p className="comman-black-lg">
                                      {`${bookingDetails?.service_cost}`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="top flex overflow-x-scroll scrolling-space remove-scrollbar-width comman-black-text">
                        {bookingDetails?.session_duration && (
                          <div className="flex items-center justify-center w-fit  text-nowrap pr-3">
                            {t("session_duration")}:&nbsp;
                            {bookingDetails?.session_duration} {t("min")}
                          </div>
                        )}

                        {bookingDetails?.is_gender_specific ===
                          BIT_VALUE.One && (
                          <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                            {t("gender_specific")}
                          </div>
                        )}
                        {bookingDetails?.is_peer_to_peer === BIT_VALUE.One && (
                          <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                            {t("one_to_one")}
                          </div>
                        )}
                        <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                          {bookingDetails?.is_offline === BIT_VALUE.One
                            ? t(IS_OFFLINE_VALUES.Offline)
                            : t(IS_OFFLINE_VALUES.Online)}
                        </div>
                      </div>
                      {bookingDetails && (
                        <div className="top comman-border w-full comman-padding">
                          <div className="flex items-center">
                            <p className="comman-black-big !font-bold">
                              {t("booking_number")}:
                            </p>
                            <p className="ml-2 comman-black-text">
                              {bookingDetails.booking_number}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <p className="comman-black-big !font-bold">
                              {t("booking_status")}:
                            </p>
                            <p className="ml-2 comman-black-text">
                              {bookingDetails.booking_status_label}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <p className="comman-black-big !font-bold">
                              {t("booking_date")}:
                            </p>
                            <p className="ml-2 comman-black-text">
                              {dateFormat(
                                getLocalDate(bookingDetails.booking_date)
                              )}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <p className="comman-black-big !font-bold">
                              {t("schedule_date")}:
                            </p>
                            <p className="ml-2 comman-black-text">
                              {dateFormat(
                                getLocalDate(bookingDetails.schedule_date)
                              )}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <p className="comman-black-big !font-bold">
                              {t("schedule_time")}:
                            </p>
                            <p className="ml-2 comman-black-text">
                              {convertTimeStringToTime(
                                bookingDetails.schedule_time
                              )}
                              &nbsp; -&nbsp;
                              {calculateEndTime(
                                bookingDetails.schedule_time,
                                bookingDetails.session_duration
                              )}
                            </p>
                          </div>
                          {bookingDetails.booking_cancellation_date && (
                            <div className="flex items-center mt-2">
                              <p className="comman-black-big !font-bold">
                                {t("booking_cancellation_date")}:
                              </p>
                              <p className="ml-2 comman-black-text">
                                {dateFormat(
                                  getLocalDate(
                                    bookingDetails.booking_cancellation_date
                                  )
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex justify-between top">
                        <div>
                          <div className="flex mr-8 items-center">
                            {[...Array(5)].map((x, i) =>
                              i >
                              parseInt(
                                review?.average_rating
                                  ? review?.average_rating
                                  : "0"
                              ) -
                                1 ? (
                                <div className="w-4 h-4 m-0.5 svg-color">
                                  {StarIcon}
                                </div>
                              ) : (
                                <div className="w-4 h-4 m-0.5 svg-color">
                                  {darkStarIcon}
                                </div>
                              )
                            )}
                          </div>

                          <div className="flex items-end">
                            <span className="mr-1 !font-bold comman-black-big flex items-center justify-center ml-1">
                              {review?.total_reviews}
                            </span>
                            <div> {t("ratings")}</div>
                          </div>
                        </div>
                        <div className="w-full flex justify-end items-center">
                          {bookingDetails?.booking_status ===
                            BOOKING_STATUS.BookingConfirmed &&
                            isCancelable() && (
                              <ICButton
                                type="button"
                                children={
                                  <>
                                    <div className="text-nowrap">
                                      {t("cancel_booking")}
                                    </div>
                                  </>
                                }
                                loading={bookingChargeLoading}
                                className="!bg-skin-cancel-button me-2 flex justify-center !w-3/4 md:!w-2/5 cursor"
                                onClick={handleCancellationBooking}
                                disabled={bookingChargeLoading}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <>
                    {bookingDetails?.service?.service_params &&
                      bookingDetails?.service?.service_params.length > 0 && (
                        <div className="flex overflow-x-scroll remove-scrollbar-width comman-padding space-x-4">
                          {bookingDetails?.service?.service_params.map(
                            (
                              param: { [key: string]: string },
                              index: number
                            ) => {
                              const key = Object.keys(param)[0];
                              const value = param[key];
                              return (
                                <div
                                  className="w-fit  services-bg rounded-xl flex  flex-col p-5"
                                  key={index}
                                >
                                  <p className="mb-2.5 comman-grey text-nowrap">
                                    {key}
                                  </p>
                                  <p className="comman-black-big text-nowrap">
                                    {value}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    {bookingDetails?.service &&
                      bookingDetails?.service.service_tags &&
                      bookingDetails?.service.service_tags.length > 0 && (
                        <div className="flex overflow-x-scroll remove-scrollbar-width comman-padding space-x-3">
                          {bookingDetails?.service.service_tags.map(
                            (value, index) => (
                              <div
                                className="comman-grey inline-flex w-fit text-nowrap items-center bread-crumb-border text-skin-library-tags-box text-sm font-medium rounded-full px-3 py-1 mr-2 mb-2"
                                key={index}
                              >
                                {`#${value}`}
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </>
                  <div className="text-lg font-medium text-center flex remove-scrollbar-width">
                    <ul className="flex justify-between lg:justify-start cursor-pointer overflow-x-auto">
                      <li
                        className={`me-2 list-none cursor ${
                          activeTab === DETAILS_TYPE.Service
                            ? "active-text active-border border-b-2 "
                            : ""
                        }`}
                        onClick={() => handleTabClick(DETAILS_TYPE.Service)}
                      >
                        <div
                          className={`p-4 text whitespace-nowrap rounded-t-lg border-skin-product-service flex `}
                          aria-current="page"
                        >
                          <p
                            className={`${
                              activeTab === DETAILS_TYPE.Service
                                ? "active-text"
                                : "inactive-text"
                            }`}
                          >
                            {t("details")}
                          </p>
                        </div>
                      </li>
                      {bookingDetails.service.SCC.length > 0 && (
                        <li
                          className={`me-2 list-none cursor ${
                            activeTab === DETAILS_TYPE.CourseContent
                              ? "active-text active-border border-b-2"
                              : ""
                          }`}
                          onClick={() =>
                            handleTabClick(DETAILS_TYPE.CourseContent)
                          }
                        >
                          <div
                            className={`p-4 text whitespace-nowrap rounded-t-lg border-skin-product-service flex `}
                            aria-current="page"
                          >
                            <p
                              className={`${
                                activeTab === DETAILS_TYPE.CourseContent
                                  ? "active-text"
                                  : "inactive-text"
                              }`}
                            >
                              {t("course_content")}
                            </p>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                  {activeTab === DETAILS_TYPE.Service && (
                    <>
                      <div className="flex flex-col comman-padding">
                        <div>
                          {bookingDetails?.service?.service_desc &&
                            bookingDetails?.service?.service_desc.length >
                              0 && (
                              <div>
                                {bookingDetails?.service?.service_desc && (
                                  <>
                                    <h1 className="comman-black-big !font-bold">
                                      {t("description")}
                                    </h1>
                                    <div className="p-3 text-justify">
                                      <p className="comman-grey">
                                        <CustomEditor
                                          serviceDesc={
                                            bookingDetails?.service
                                              ?.service_desc
                                          }
                                        />
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                        </div>
                        {bookingDetails?.service?.service_pros &&
                          bookingDetails?.service?.service_pros.length > 0 && (
                            <div>
                              <h1 className="!font-bold comman-black-big">
                                {t("benefits")}
                              </h1>
                              {bookingDetails?.service?.service_pros && (
                                <ul>
                                  {bookingDetails?.service?.service_pros.map(
                                    (data, index) => (
                                      <li className="comman-grey" key={index}>
                                        {data}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          )}
                        {bookingDetails?.service?.service_precautions &&
                          bookingDetails?.service?.service_precautions.length >
                            0 && (
                            <div>
                              <h1 className="comman-black-big !font-bold">
                                {t("precautions")}
                              </h1>
                              {bookingDetails?.service?.service_precautions && (
                                <ul>
                                  {bookingDetails?.service?.service_precautions.map(
                                    (data, index) => (
                                      <li className="comman-grey" key={index}>
                                        {data}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          )}
                        <div>
                          {bookingDetails?.service?.service_other_notes &&
                            bookingDetails?.service?.service_other_notes
                              .length > 0 && (
                              <>
                                <h1 className="comman-black-big !font-bold">
                                  {t("notes")}
                                </h1>
                                <ul>
                                  {bookingDetails?.service
                                    ?.service_other_notes &&
                                    bookingDetails?.service?.service_other_notes
                                      .length > 0 &&
                                    bookingDetails?.service?.service_other_notes.map(
                                      (data, index) => (
                                        <li className="comman-grey" key={index}>
                                          {data}
                                        </li>
                                      )
                                    )}
                                </ul>
                              </>
                            )}
                        </div>
                      </div>
                      <div className="comman-padding">
                        {bookingDetails?.service_faqs &&
                          bookingDetails.service_faqs.length > 0 && (
                            <>
                              <h1 className="comman-black-big">{t("faqs")}</h1>
                              {bookingDetails.service_faqs.map(
                                (item, index) => (
                                  <div className="mt-4" key={index}>
                                    <ICAccordion
                                      title={item.question}
                                      content={
                                        <>
                                          <div className="comman-grey !leading-relaxed mb-0.5">
                                            {item.answer}
                                          </div>
                                          <p className="link-color comman-grey">
                                            {item.reference_links.map(
                                              (link, index) => (
                                                <a
                                                  key={index}
                                                  href={link}
                                                  target="_blank"
                                                >
                                                  {link}
                                                </a>
                                              )
                                            )}
                                          </p>
                                        </>
                                      }
                                    />
                                  </div>
                                )
                              )}
                              {/* <ul className="accordion-list">
                                {bookingDetails.service_faqs.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className={
                                        activeIndex === index ? "active " : ""
                                      }
                                      onClick={() =>
                                        handleAccordionClick(index)
                                      }
                                    >
                                      <div className="question">
                                        <h3 className="comman-black-text !font-medium">
                                          {item.question}
                                        </h3>
                                      </div>
                                      <div
                                        className="answer text-justify !mt-2"
                                        style={{
                                          maxHeight:
                                            activeIndex === index
                                              ? "1000px"
                                              : "0",
                                        }}
                                      >
                                        {item.answer}
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul> */}
                            </>
                          )}
                      </div>
                    </>
                  )}
                </>
                {activeTab === DETAILS_TYPE.CourseContent && (
                  <div className="comman-padding">
                    {bookingDetails &&
                    bookingDetails.service &&
                    bookingDetails.service.SCC &&
                    bookingDetails.service.SCC.length > 0 ? (
                      <CourseContent
                        content={bookingDetails.service.SCC}
                        hideContent={
                          bookingDetails?.booking_status ===
                          BOOKING_STATUS.BookingConfirmed
                            ? false
                            : true
                        }
                      />
                    ) : (
                      <NoData
                        title={t("course_content")}
                        height={150}
                        width={150}
                      />
                    )}
                  </div>
                )}
                {bookingDetails?.trainer?.id && (
                  <div
                    className={`comman-padding md:flex justify-${
                      canProvideFeedback() &&
                      bookingDetails.feedback_given === FEEDBACK_GIVEN.No
                        ? "between"
                        : "center"
                    }`}
                  >
                    <ICButton
                      className="xl:!w-1/3 md:!w-1/2 w-full cursor"
                      onClick={() =>
                        navigate(userRoute.trainerDetailsProfile, {
                          state: { trainerId: bookingDetails?.trainer?.id },
                        })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid content-center overflow-hidden p-1">
                          <ICImage
                            imageUrl={bookingDetails.trainer.trainer_url}
                            fallbackSrc={require("../../../assets/image/avatar.png")}
                            isPrivate
                            className="w-[41px] h-[41px] object-cover rounded-full"
                          />
                        </div>
                        <p className="comman-white-text">
                          {bookingDetails?.trainer?.trainer_name} (
                          {bookingDetails?.trainer?.id &&
                            prepareUserId(
                              USER_TYPE.Trainer,
                              bookingDetails.trainer.id.toString()
                            )}
                          )
                        </p>
                        <div className="h-6 w-6 grid content-center">
                          {rightArrowIcon}
                        </div>
                      </div>
                    </ICButton>

                    {bookingDetails.feedback_given === FEEDBACK_GIVEN.No &&
                      canProvideFeedback() && (
                        <ICButton
                          children={t("give_feedback")}
                          className="xl:!w-1/3 md:!w-1/2 w-full h-[73px] mt-2 md:mt-0 cursor"
                          onClick={() => setShowFeedbackModal(true)}
                        />
                      )}
                  </div>
                )}
              </div>
            </div>
            {showFeedbackModal && (
              <ICCommonModal
                title={t("review_and_feedback")}
                content={
                  <Feedback
                    serviceId={bookingDetails?.service.id}
                    bookingId={bookingDetails?.id}
                  />
                }
                isModalShow={showFeedbackModal}
                setIsModalShow={setShowFeedbackModal}
              />
            )}
          </div>
        )
      )}
    </>
  );
};

export default BookingCancellationWeb;
