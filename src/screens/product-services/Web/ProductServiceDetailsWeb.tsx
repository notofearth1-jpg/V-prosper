import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  ICheckFreeBookingAttempts,
  IFaqs,
  IServiceForSubCategory,
  checkFreeBooking,
  fetchFaqsApi,
  fetchServiceForSubCategoryApi,
  getAllRelatedService,
} from "./ProductServiceDetailsWebController";
import CustomEditor from "./CustomEditor";
import PwaCarousel from "../../../components/common/PwaCarousel";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  StarIcon,
  darkStarIcon,
  vpServiceIcon,
  rupeeIcon,
  shareItemIcon,
  calendarIcon,
} from "../../../assets/icons/SvgIconList";
import { RWebShare } from "react-web-share";
import ICButton from "../../../core-component/ICButton";
import { userRoute } from "../../../routes/RouteUser";
import ProductServiceDetailsWebSkeleton from "../product-services-skeleton/ProductServiceDetailsWebSkeleton";
import {
  getServiceRatingsAndReviews,
  IRatingsAndReviews,
} from "../../feedback/FeedbackController";
import {
  dateFormat,
  getLocalDate,
  getStarColors,
  showConfirmationDialog,
} from "../../../utils/AppFunctions";
import CourseContent from "../../../components/common/CourseContent";
import NoData from "../../../components/common/NoData";
import {
  BIT_VALUE,
  DETAILS_TYPE,
  IS_OFFLINE_VALUES,
} from "../../../utils/AppEnumerations";
import { APP_HOST_URL } from "../../../config/AppConfig";
import ICAccordion from "../../../core-component/ICAccordion";
import Swal from "sweetalert2";
import RelatedServices from "../../../components/common/RelatedServices";
import ReactDOM from "react-dom";
import ICCommonModal from "../../../components/common/ICCommonModel";
import { IServiceByCategory } from "../../header/home-page/HomePageController";
import ICSweetAlertModal from "../../../core-component/ICSweetAlertModal";
import { useAddressContext } from "../../../context/AddressContext";
import AddressModel from "../../address/AddressModel";

const ProductServiceDetailsWeb = () => {
  const { t } = UseTranslationHook();
  const [serviceForSubCategoryList, setServiceForSubCategoryList] =
    useState<IServiceForSubCategory | null>(null);
  const [FaqList, setFaqList] = useState<IFaqs[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedServiceLoading, setRelatedServiceLoading] = useState(true);
  const [review, setReviews] = useState<IRatingsAndReviews | null>(null);
  const [activeTab, setActiveTab] = useState<string>("service");
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [reletedServiceList, setReletedServiceList] = useState<
    IServiceForSubCategory[]
  >([]);
  const [freeAttempt, setFreeAttempt] =
    useState<ICheckFreeBookingAttempts | null>(null);
  const { addressData } = useAddressContext();
  const [showAddressModel, setShowAddressModel] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const id: number = location?.state?.id;
  useEffect(() => {
    fetchFaqsApi(setFaqList, setLoading, id, t);
    fetchServiceForSubCategoryApi(
      setServiceForSubCategoryList,
      setLoading,
      id,
      t
    );
  }, [id]);

  useEffect(() => {
    getServiceRatingsAndReviews(setLoading, setReviews, t, id);
  }, []);

  const checkFreeBookingAttemps = async () => {
    await checkFreeBooking(setFreeAttempt, navigate, setLoading, id);
    await getAllRelatedService(
      setReletedServiceList,
      setRelatedServiceLoading,
      id
    );
    setIsBottomDivVisible(true);
  };

  const handleNavigate = () => {
    showConfirmationDialog({
      title: t("address_require"),
      text: t("address_not_added"),
      onConfirm: () => {
        navigate(userRoute.locations);
      },
      buttonText: t("add_address"),
    });
  };

  return (
    <>
      <div className="container mx-auto w-full comman-padding overflow-hidden md:h-[calc(100vh-76px)] flex flex-col">
        {!loading ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <BackButton />
              <RWebShare
                data={{
                  text: t("join_vprosper"),
                  url: APP_HOST_URL,
                  title: t("discover_wellness"),
                }}
              >
                <div className="w-5 h-5 cursor">{shareItemIcon}</div>
              </RWebShare>
            </div>
            <div className="flex-1 overflow-y-scroll remove-scrollbar-width">
              <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 place-items-center">
                <div className="col-span-2  rounded-lg aspect-16/9 w-full overflow-hidden">
                  {serviceForSubCategoryList && (
                    <PwaCarousel
                      carouselItems={serviceForSubCategoryList.app_media}
                      autoPlaySpeed={4000}
                      autoPlay={
                        serviceForSubCategoryList.app_media.length > 1
                          ? true
                          : false
                      }
                      infinite={
                        serviceForSubCategoryList.app_media.length > 1
                          ? true
                          : false
                      }
                      arrows={false}
                    />
                  )}
                </div>
                <div className="w-full flex flex-col col-span-3 justify-center px-4">
                  <div className="flex items-center">
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
                      <div className="flex">
                        <span className="comman-black mr-1 !font-semibold flex items-center justify-center ml-1">
                          {review?.total_reviews}
                        </span>
                        {review?.total_reviews && review?.total_reviews > 0 && (
                          <div> {t("ratings")}</div>
                        )}
                      </div>
                    </div>
                    <div
                      className="w-full flex justify-end cursor"
                      onClick={() => {
                        if (
                          !(
                            addressData &&
                            addressData.address_line_1 &&
                            addressData.address_line_2 &&
                            addressData.city
                          ) &&
                          serviceForSubCategoryList?.is_offline ===
                            BIT_VALUE.One
                        ) {
                          handleNavigate();
                          return;
                        } else if (
                          !addressData &&
                          Number(
                            serviceForSubCategoryList &&
                              serviceForSubCategoryList.service_cost
                          ) > 0
                        ) {
                          setShowAddressModel(true);
                          return;
                        }

                        if (
                          serviceForSubCategoryList &&
                          Number(serviceForSubCategoryList.service_cost) === 0
                        ) {
                          checkFreeBookingAttemps();
                        } else {
                          navigate(userRoute.slotBooking, {
                            state: { id: id },
                          });
                        }
                      }}
                    >
                      <ICButton
                        children={t("book_slot")}
                        className="text-nowrap me-2 flex justify-center !w-2/3 md:!w-2/5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between top w-full">
                    <div className="flex items-center p-1 xl:p-0 border-r-2 w-full">
                      <div className="w-8 h-8 mr-1.5 pt-1.5">
                        {vpServiceIcon}
                      </div>
                      <p className="w-full comman-black-lg">
                        {serviceForSubCategoryList?.service_title}
                      </p>
                    </div>
                    {serviceForSubCategoryList?.service_duration && (
                      <div className="flex items-center p-3 justify-center border-r-2 w-full">
                        <div className="w-5 h-5 mr-1.5 ">{calendarIcon}</div>
                        <div className="w-fit comman-black-lg">
                          {serviceForSubCategoryList?.service_duration}&nbsp;
                          {serviceForSubCategoryList?.service_duration > 1
                            ? t("days")
                            : t("day")}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <div className="w-[12px] h-[12px] pb-[14px]">
                        {rupeeIcon}
                      </div>
                      <div className="flex">
                        {serviceForSubCategoryList?.service_discounted_price ? (
                          <>
                            <p className="mx-2 comman-black-big">
                              {`${serviceForSubCategoryList.service_discounted_price}`.replace(
                                "$",
                                ""
                              )}
                            </p>
                            <p className="mx-1 mt-1 comman-grey line-through">
                              {`${serviceForSubCategoryList.service_cost}`.replace(
                                "$",
                                ""
                              )}
                            </p>
                          </>
                        ) : (
                          <p className="mx-2 comman-black-big">
                            {`${serviceForSubCategoryList?.service_cost}`.replace(
                              "$",
                              ""
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="top flex overflow-x-scroll scrolling-space remove-scrollbar-width comman-black-text">
                    {serviceForSubCategoryList?.session_duration && (
                      <div className="flex items-center justify-center w-fit  text-nowrap pr-3 ">
                        {t("session_duration")}:&nbsp;
                        {serviceForSubCategoryList?.session_duration} {t("min")}
                      </div>
                    )}

                    {serviceForSubCategoryList?.is_gender_specific ===
                      BIT_VALUE.One && (
                      <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                        {t("gender_specific")}
                      </div>
                    )}
                    {serviceForSubCategoryList?.is_peer_to_peer ===
                      BIT_VALUE.One && (
                      <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                        {t("one_to_one")}
                      </div>
                    )}
                    <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                      {serviceForSubCategoryList?.is_offline === BIT_VALUE.One
                        ? t(IS_OFFLINE_VALUES.Offline)
                        : t(IS_OFFLINE_VALUES.Online)}
                    </div>
                  </div>
                  <div className="flex overflow-x-scroll remove-scrollbar-width top">
                    {serviceForSubCategoryList?.service_params &&
                      serviceForSubCategoryList?.service_params.length > 0 &&
                      serviceForSubCategoryList.service_params.map(
                        (param: { [key: string]: string }, index: number) => {
                          const key = Object.keys(param)[0];
                          const value = param[key];
                          return (
                            <div
                              className="w-fit mr-5 services-bg rounded-xl flex  flex-col p-2.5"
                              key={index}
                            >
                              <p className="mb-1.5 comman-grey text-nowrap">
                                {key}
                              </p>
                              <p className="comman-black-big !text-lg text-nowrap">
                                {value}
                              </p>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-scroll remove-scrollbar-width mt-4">
                {serviceForSubCategoryList?.service_tags.map((value, index) => (
                  <>
                    <div
                      className="comman-grey inline-flex w-fit text-nowrap items-center bread-crumb-border text-skin-library-tags-box text-sm font-medium rounded-full px-3 py-1 mr-2 mb-2"
                      key={index}
                    >
                      {`#${value}`}
                    </div>
                  </>
                ))}
              </div>
              <div className="text-lg font-medium text-center flex">
                <ul className="flex justify-between lg:justify-start cursor-pointer p-0">
                  <li
                    className={`me-2 list-none ${
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
                  {serviceForSubCategoryList &&
                    serviceForSubCategoryList.SCC &&
                    serviceForSubCategoryList.SCC.length > 0 && (
                      <li
                        className={`me-2 list-none ${
                          activeTab === DETAILS_TYPE.CourseContent
                            ? "active-text active-border border-b-2 "
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
                  <div className="flex flex-col top">
                    <div>
                      {serviceForSubCategoryList?.service_desc &&
                        serviceForSubCategoryList?.service_desc.length > 0 && (
                          <div>
                            {serviceForSubCategoryList?.service_desc && (
                              <>
                                <h1 className="comman-black-lg !font-bold">
                                  {t("description")}
                                </h1>
                                <div className="p-3">
                                  <p className="comman-grey text-justify">
                                    <CustomEditor
                                      containerClassName="!leading-relaxed"
                                      serviceDesc={
                                        serviceForSubCategoryList?.service_desc
                                      }
                                    />
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                    </div>
                    {serviceForSubCategoryList?.service_pros &&
                      serviceForSubCategoryList?.service_pros.length > 0 && (
                        <div>
                          <h1 className="comman-black-lg !font-bold">
                            {t("benefits")}
                          </h1>
                          {serviceForSubCategoryList?.service_pros && (
                            <ul>
                              {serviceForSubCategoryList?.service_pros.map(
                                (data, index) => (
                                  <li
                                    key={index}
                                    className="comman-grey !leading-relaxed"
                                  >
                                    {data}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                    {serviceForSubCategoryList?.service_precautions &&
                      serviceForSubCategoryList?.service_precautions.length >
                        0 && (
                        <div>
                          <h1 className="comman-black-lg !font-bold">
                            {t("precautions")}
                          </h1>
                          {serviceForSubCategoryList?.service_precautions && (
                            <ul>
                              {serviceForSubCategoryList?.service_precautions.map(
                                (data, index) => (
                                  <li
                                    key={index}
                                    className="comman-grey !leading-relaxed"
                                  >
                                    {" "}
                                    {data}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                    <div>
                      {serviceForSubCategoryList?.service_other_notes &&
                        serviceForSubCategoryList?.service_other_notes.length >
                          0 && (
                          <>
                            <h1 className="comman-black-lg !font-bold">
                              {t("notes")}
                            </h1>
                            <ul>
                              {serviceForSubCategoryList?.service_other_notes.map(
                                (data, index) => (
                                  <li
                                    key={index}
                                    className="comman-grey !leading-relaxed"
                                  >
                                    {data}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                    </div>
                  </div>
                  <div>
                    {FaqList.length > 0 && (
                      <>
                        <h1 className="comman-black-lg !font-bold">
                          {t("faqs")}
                        </h1>
                        {FaqList.map((item, index) => (
                          <div className="mt-4" key={index}>
                            <ICAccordion
                              title={item.question}
                              content={
                                <>
                                  <div className="comman-grey !leading-relaxed mb-0.5">
                                    {item.answer}
                                  </div>
                                  <p className="link-color comman-grey">
                                    {item.reference_links.map((link, index) => (
                                      <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                      >
                                        {link}
                                      </a>
                                    ))}
                                  </p>
                                </>
                              }
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  {review && review.total_reviews > 0 && (
                    <>
                      <p className="comman-black-text">{t("reviews")}</p>
                      <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2 p-4">
                          {review?.star_wise_review &&
                            review?.star_wise_review.map((i, index) => (
                              <div
                                className=" w-full flex items-center justify-start"
                                key={index}
                              >
                                <div className="w-5 h-5 m-1 svg-color">
                                  {StarIcon}
                                </div>
                                <p className="comman-black-text">{i.rating}</p>
                                <div className="w-3/4 mr-4 ml-4  h-2 ">
                                  <div
                                    style={{
                                      width: `${
                                        (i.no_of_ratings * 100) /
                                        review.total_reviews
                                      }%`,
                                    }}
                                    className={`w-custom bg-black h-2`}
                                  />
                                </div>
                                <p className="comman-black-text">
                                  {i.no_of_ratings}
                                </p>
                              </div>
                            ))}
                        </div>
                        <br />
                        <div className="w-full lg:w-1/2 p-4">
                          {review?.review_comments &&
                            review?.review_comments.map(
                              (i: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="!font-bold comman-black-big">
                                        {i.review_given_by}
                                      </p>
                                      <p className="!text-xs comman-grey">
                                        {dateFormat(
                                          getLocalDate(i.review_date)
                                        )}
                                      </p>
                                    </div>
                                    <div
                                      className={`flex items-center p-1 border rounded-md bg-gre justify-center ${getStarColors(
                                        i.ratings
                                      )}`}
                                    >
                                      <div className="w-4 h-4  mr-1 svg-color">
                                        {StarIcon}
                                      </div>
                                      <p className="text-lg  text-white mr-1">
                                        {i.ratings}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="comman-black-text !text-sm text-justify">
                                    {i.comments}
                                  </p>
                                  <div className="h-px w-full  booking-card mt-4"></div>
                                  <br />
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {activeTab === DETAILS_TYPE.CourseContent && (
                <div>
                  {serviceForSubCategoryList &&
                  serviceForSubCategoryList.SCC &&
                  serviceForSubCategoryList.SCC.length > 0 ? (
                    <CourseContent
                      content={serviceForSubCategoryList.SCC}
                      hideContent
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
            </div>
          </>
        ) : (
          <ProductServiceDetailsWebSkeleton />
        )}
      </div>

      <ICCommonModal
        title={t(freeAttempt ? freeAttempt.message : "")}
        content={
          <RelatedServices
            services={reletedServiceList}
            navigate={navigate}
            closeModal={() => setIsBottomDivVisible(false)}
          />
        }
        isModalShow={isBottomDivVisible}
        setIsModalShow={setIsBottomDivVisible}
        customWidth
      />

      {showAddressModel && (
        <AddressModel
          modelOpen={showAddressModel}
          setModelOpen={setShowAddressModel}
        />
      )}
    </>
  );
};

export default ProductServiceDetailsWeb;
