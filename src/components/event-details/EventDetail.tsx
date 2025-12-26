import React, { useCallback, useEffect, useState } from "react";
import {
  IEvent,
  fetchEventById,
} from "../../screens/header/home-page/HomePageController";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackButton from "../common/BackButton";
import { RWebShare } from "react-web-share";
import {
  premiumIcon,
  rupeeIcon,
  shareItemIcon,
} from "../../assets/icons/SvgIconList";
import PwaCarousel from "../common/PwaCarousel";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  BIT_VALUE,
  ENTITY_TYPE,
  IS_PAID_EVENT,
  IS_SUBSCRIBED,
} from "../../utils/AppEnumerations";
import ICButton from "../../core-component/ICButton";
import {
  IOrderPremiumPackage,
  submitPremiumPackageBooking,
} from "../../screens/premium-package/PremiumPackagesController";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import {
  decryptData,
  handleNumericInput,
  prepareMessageFromParams,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import {
  APP_HOST_URL,
  CALLING_CODE,
  RP_COMPANY_NAME,
  RP_KEY_ID,
} from "../../config/AppConfig";
import { userRoute } from "../../routes/RouteUser";
import ICCustomModal from "../common/ICCustomModal";
import ICTextInput from "../../core-component/ICTextInput";
import {
  handleSubmitRegistrationForm,
  initialValuesEventForm,
  registrationFormValidationSchema,
} from "./EventDetailControler";
import { useFormik } from "formik";
import EventDetailSkeleton from "./event-details-skeleton/EventDetailSkeleton";
import PackageDetails from "../common/PackageDetails";
import ICMap from "../common/ICMap";
import { publicRoute } from "../../routes/RoutePublic";
import {
  IEditUser,
  getUserData,
} from "../../screens/header/profile/EditProfileController";

const EventDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const sp = location?.state?.sp;
  const [eventsList, setEventList] = useState<IEvent>();
  const [loadingForEvent, setLoadingForEvent] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { t } = UseTranslationHook();
  const [userData, setUserData] = useState<IEditUser | undefined>();

  useEffect(() => {
    fetchEventById(setEventList, setLoadingForEvent, t, id, sp);
  }, [id]);

  useEffect(() => {
    getUserData(setUserData, setLoading);
  }, []);

  const handleOrderDetails = async (
    id: number,
    entityType: number
  ): Promise<IOrderPremiumPackage | undefined> => {
    const orderDetailsPayload = {
      entity_type: entityType,
      entity_record_id: id,
    };
    const fetchedOrderDetails = await submitPremiumPackageBooking(
      orderDetailsPayload,
      setLoading
    );

    return fetchedOrderDetails;
  };

  const [Razorpay] = useRazorpay();

  const handlePremiumPackagePayment = useCallback(
    async (id: number, entityType: number) => {
      setPaymentLoading(true);
      const orderDetails = await handleOrderDetails(id, entityType);

      if (!orderDetails) {
        sweetAlertError(t("order_not_found"));
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
            sweetAlertSuccess(t("event_booked"));
            navigate(userRoute.home);
          } else {
            sweetAlertError(t("something_want_wrong"));
            navigate(userRoute.home);
          }
        },
      };
      setPaymentLoading(false);
      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, handleOrderDetails]
  );

  const formik = useFormik({
    validationSchema: registrationFormValidationSchema(t),
    enableReinitialize: true,
    initialValues: initialValuesEventForm(id, userData ? userData : undefined),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await handleSubmitRegistrationForm(values, setShowRegistrationModal);
      formik.setSubmitting(false);
      formik.resetForm();
      fetchEventById(setEventList, setLoadingForEvent, t, id, sp);
      setShowRegistrationModal(false);
    },
  });

  const registerEventForm = (
    <>
      <div className="mt-5">
        <ICTextInput
          name={"first_name"}
          placeholder={t("first_name")}
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.first_name ? formik.errors.first_name : undefined
          }
        />
      </div>
      <div className="mt-5">
        <ICTextInput
          name={"last_name"}
          placeholder={t("last_name")}
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.last_name ? formik.errors.last_name : undefined
          }
        />
      </div>
      <div className="mt-5">
        <ICTextInput
          name={"participant_age"}
          placeholder={t("participant_age")}
          type="text"
          inputMode="numeric"
          value={formik.values.participant_age}
          onChange={(event) => {
            handleNumericInput(event);
            formik.setFieldValue(
              "participant_age",
              event.target.value ? Number(event.target.value) : undefined
            );
          }}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.participant_age
              ? formik.errors.participant_age
              : undefined
          }
        />
      </div>
      <div className="mt-5">
        <ICTextInput
          name={"email_address"}
          placeholder={t("email")}
          type="email"
          value={formik.values.email_address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.email_address
              ? formik.errors.email_address
              : undefined
          }
        />
      </div>
      <div className="text-center  mt-5">OR</div>
      <div className="">
        <ICTextInput
          name={"mobile_number"}
          placeholder={t("mobile_number")}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formik.values.mobile_number}
          onChange={(event) => {
            handleNumericInput(event);
            formik.setFieldValue(
              "mobile_number",
              event.target.value ? Number(event.target.value) : undefined
            );
          }}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.mobile_number
              ? formik.errors.mobile_number
              : undefined
          }
        />
      </div>
    </>
  );

  return (
    <div className="flex flex-col overflow-hidden h-svh md:h-[calc(100vh-76px)]">
      <div className="flex justify-between items-center comman-padding">
        <BackButton />
        <RWebShare
          data={{
            text: prepareMessageFromParams(t("event_share_text"), [
              ["title", `${eventsList?.title}`],
            ]),
            url: `${APP_HOST_URL}/${userRoute.events}`,
            title: eventsList?.title,
          }}
        >
          <div className="w-5 h-5">{shareItemIcon}</div>
        </RWebShare>
      </div>

      {!loadingForEvent ? (
        <div className="flex-1 overflow-y-scroll remove-scrollbar-width flex flex-col">
          <div className="w-full flex flex-col justify-center items-center flex-1">
            {eventsList && (
              <>
                <div className="w-full xl:w-1/2">
                  {eventsList && (
                    <PwaCarousel
                      carouselItems={eventsList.app_media}
                      autoPlaySpeed={4000}
                      autoPlay={false}
                      infinite={eventsList.app_media.length > 1 ? true : false}
                      arrows={false}
                    />
                  )}
                </div>
                <div className="event-description flex flex-col w-full xl:w-1/2 comman-padding top flex-1">
                  <div>
                    <div className="flex items-center comman-black-big justify-between">
                      <div className="flex w-full mr-5">
                        <div>
                          {eventsList.has_subscribed === IS_SUBSCRIBED.No &&
                          eventsList.is_paid_event === IS_PAID_EVENT.isTrue ? (
                            <div className="h-6 w-6">{premiumIcon}</div>
                          ) : (
                            eventsList.has_subscribed === IS_SUBSCRIBED.Yes &&
                            eventsList.is_paid_event ===
                              IS_PAID_EVENT.isTrue && (
                              <div className="text-subscribed text-skin-on-primary">
                                {t("subscribed")}
                              </div>
                            )
                          )}
                          {eventsList?.title}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        {eventsList.is_paid_event === IS_PAID_EVENT.isTrue && (
                          <>
                            <div className="h-5 w-4 m-1">{rupeeIcon}</div>
                            <div>{eventsList.registration_fee}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="top comman-black-big flex flex-col relative justify-between">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        {t("description")}
                      </div>
                      <div className="flex justify-end">
                        {eventsList.is_paid_event === IS_PAID_EVENT.isTrue
                          ? eventsList.has_subscribed === IS_SUBSCRIBED.No && (
                              <ICButton
                                type="button"
                                children={t("subscribe")}
                                loading={loading}
                                onClick={() => setShowPaymentModal(true)}
                                className="!bg-skin-event-details hover:!bg-skin-event-detail-hover !w-fit !text-sm mb-2"
                              />
                            )
                          : eventsList.registration_required ===
                              IS_SUBSCRIBED.Yes && (
                              <ICButton
                                type="button"
                                onClick={() => setShowRegistrationModal(true)}
                                className="!bg-skin-event-details hover:!bg-skin-event-detail-hover !w-fit !text-sm mb-2"
                              >
                                {t("register")}
                              </ICButton>
                            )}
                      </div>
                    </div>
                    <div className=" comman-grey text-justify">
                      <p>{eventsList?.description}</p>
                    </div>
                    <div className="top comman-grey">
                      {eventsList.event_start_date && (
                        <p>
                          {t("event_start_date")} :{" "}
                          {eventsList.event_start_date.slice(0, 10)}
                        </p>
                      )}

                      {eventsList.event_end_date && (
                        <p>
                          {t("event_end_date")} :{" "}
                          {eventsList.event_end_date.slice(0, 10)}
                        </p>
                      )}

                      {eventsList.event_start_time &&
                        eventsList.event_end_time && (
                          <p>
                            {t("time")} :{" "}
                            {eventsList.event_start_time.slice(0, 5)} -{" "}
                            {eventsList.event_end_time.slice(0, 5)}
                          </p>
                        )}

                      {!eventsList.event_start_time &&
                        !eventsList.event_end_time && (
                          <p>
                            {t("event_start_date")} :{" "}
                            {eventsList.event_start_date.slice(0, 10)} -{" "}
                            {eventsList.event_end_date.slice(0, 10)}
                          </p>
                        )}
                    </div>
                    <div className="top comman-grey">
                      {eventsList &&
                      eventsList.is_paid_event === IS_PAID_EVENT.isTrue ? (
                        eventsList.has_subscribed === IS_SUBSCRIBED.Yes &&
                        eventsList.meeting_link && (
                          <div>
                            {t("event_link")} :&nbsp;
                            <Link
                              to={eventsList.meeting_link}
                              target="_blank"
                              className="link-color"
                            >
                              {eventsList.meeting_link}
                            </Link>
                          </div>
                        )
                      ) : eventsList.registration_required === BIT_VALUE.One &&
                        eventsList.is_register === BIT_VALUE.One &&
                        eventsList.meeting_link ? (
                        <div>
                          {t("event_link")} :&nbsp;
                          <Link
                            to={eventsList.meeting_link}
                            target="_blank"
                            className="link-color"
                          >
                            {eventsList.meeting_link}
                          </Link>
                        </div>
                      ) : (
                        eventsList.registration_required === BIT_VALUE.Zero &&
                        eventsList.meeting_link && (
                          <div>
                            {t("event_link")} :&nbsp;
                            <Link
                              to={eventsList.meeting_link}
                              target="_blank"
                              className="link-color"
                            >
                              {eventsList.meeting_link}
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                    <div className="mt-0.5 comman-grey">
                      <div>
                        {t("venue")} : {eventsList.venue}
                      </div>
                    </div>
                    <div className="top">
                      {eventsList &&
                        eventsList.venue_long &&
                        eventsList.venue_lat && (
                          <ICMap
                            lat={Number(eventsList.venue_lat)}
                            lng={Number(eventsList.venue_long)}
                            zoom={12}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {registerEventForm && showRegistrationModal && (
            <ICCustomModal
              title={t("registration_form")}
              content={registerEventForm}
              buttonTitle={t("submit")}
              isModalShow={showRegistrationModal}
              setIsModalShow={setShowRegistrationModal}
              handleSubmitButton={() => {
                formik.handleSubmit();
              }}
            />
          )}
        </div>
      ) : (
        <EventDetailSkeleton />
      )}

      {showPaymentModal && eventsList && eventsList.payment_summary && (
        <ICCustomModal
          title={`${t("registration_for")} ${eventsList.title}`}
          content={
            <PackageDetails
              package_title={eventsList.title}
              package_description={eventsList.description}
              cost_label={t("registration_fee")}
              package_discounted_price={
                eventsList.payment_summary.discount_cost
              }
              package_price={eventsList.payment_summary.cost}
              transaction_charge={eventsList.payment_summary.transaction_charge}
              tax={eventsList.payment_summary.tax}
              total_amount={eventsList.payment_summary.total_amount}
            />
          }
          buttonTitle={t("register")}
          isModalShow={showPaymentModal}
          setIsModalShow={setShowPaymentModal}
          handleSubmitButton={() => {
            handlePremiumPackagePayment(eventsList.id, ENTITY_TYPE.Event);
          }}
          handleCloseButton={() => setShowPaymentModal(false)}
          disabled={paymentLoading}
        />
      )}
    </div>
  );
};

export default EventDetail;
