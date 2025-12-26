import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { RWebShare } from "react-web-share";
import CustomEditor from "./Web/CustomEditor";
import PwaCarousel from "../../components/common/PwaCarousel";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  ICheckFreeBookingAttempts,
  IFaqs,
  IServiceForSubCategory,
  checkFreeBooking,
  fetchFaqsApi,
  fetchServiceForSubCategoryApi,
  getAllRelatedService,
} from "./Web/ProductServiceDetailsWebController";
import {
  StarIcon,
  darkStarIcon,
  vpServiceIcon,
  rupeeIcon,
  shareItemIcon,
  calendarIcon,
} from "../../assets/icons/SvgIconList";
import ICButton from "../../core-component/ICButton";
import { userRoute } from "../../routes/RouteUser";
import {
  getServiceRatingsAndReviews,
  IRatingsAndReviews,
} from "../feedback/FeedbackController";
import {
  dateFormat,
  getStarColors,
  showConfirmationDialog,
} from "../../utils/AppFunctions";
import ProductServiceDetailSkeleton from "./product-services-skeleton/ProductServiceDetailSkeleton";
import CourseContent from "../../components/common/CourseContent";
import NoData from "../../components/common/NoData";
import {
  BIT_VALUE,
  DETAILS_TYPE,
  IS_OFFLINE_VALUES,
} from "../../utils/AppEnumerations";
import ICAccordion from "../../core-component/ICAccordion";
import { APP_HOST_URL } from "../../config/AppConfig";
import ICCommonModal from "../../components/common/ICCommonModel";
import RelatedServices from "../../components/common/RelatedServices";
import { useAddressContext } from "../../context/AddressContext";
import AddressModel from "../address/AddressModel";

const ProductServicesDetails = () => {
  const { t } = UseTranslationHook();
  const [getServiceForSubCategory, setGetServiceForSubCategory] =
    useState<IServiceForSubCategory | null>(null);
  const [getFaqs, setGetFaqs] = useState<IFaqs[]>([]);
  const [review, setReviews] = useState<IRatingsAndReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const id: number = location?.state?.id;
  const [activeTab, setActiveTab] = useState<string>(DETAILS_TYPE.Service);
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [reletedServiceList, setReletedServiceList] = useState<
    IServiceForSubCategory[]
  >([]);
  const [freeAttempt, setFreeAttempt] =
    useState<ICheckFreeBookingAttempts | null>(null);
  const [relatedServiceLoading, setRelatedServiceLoading] = useState(true);
  const { addressData } = useAddressContext();
  const [showAddressModel, setShowAddressModel] = useState(false);

  useEffect(() => {
    fetchFaqsApi(setGetFaqs, setLoading, id, t);
    fetchServiceForSubCategoryApi(
      setGetServiceForSubCategory,
      setLoading,
      id,
      t
    );
  }, [id]);

  useEffect(() => {
    getServiceRatingsAndReviews(setLoading, setReviews, t, id);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

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
      {loading ? (
        <ProductServiceDetailSkeleton />
      ) : (
        <div className="bg-defult w-full h-svh overflow-y-scroll relative flex flex-col">
          <div>
            <div className="flex justify-between comman-padding items-center w-full absolute z-20">
              <BackButton />
              <div>
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
            </div>

            <div className="flex xl:justify-start lg:justify-start col-span-2 justify-center rounded">
              {getServiceForSubCategory && (
                <PwaCarousel
                  carouselItems={getServiceForSubCategory.app_media}
                  autoPlaySpeed={4000}
                  autoPlay={
                    getServiceForSubCategory.app_media.length > 1 ? true : false
                  }
                  infinite={
                    getServiceForSubCategory.app_media.length > 1 ? true : false
                  }
                  arrows={false}
                />
              )}
            </div>
          </div>
          <div className="service-description !rounded-none comman-padding flex-1">
            <div className="w-full flex space-x-2">
              <div className="w-8 h-8 pt-0.5">{vpServiceIcon}</div>
              <p className="mx-1 comman-black-lg w-full">
                {getServiceForSubCategory?.service_title}
              </p>
            </div>
            <div className="flex justify-between top">
              <div className="flex w-full justify-start">
                <div className="w-[15px] mr-1">{calendarIcon}</div>
                {getServiceForSubCategory && (
                  <div className="w-fit comman-black-lg">
                    {getServiceForSubCategory?.service_duration}&nbsp;
                    {getServiceForSubCategory?.service_duration > 1
                      ? t("days")
                      : t("day")}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end w-full">
                <div className="w-[12px] h-[12px] pb-[14px]">{rupeeIcon}</div>
                <div className="flex">
                  {getServiceForSubCategory?.service_discounted_price ? (
                    <>
                      <p className="mx-2 comman-black-big">
                        {`${getServiceForSubCategory.service_discounted_price}`}
                      </p>
                      <p className="mx-1 mt-1 comman-grey line-through">
                        {`${getServiceForSubCategory.service_cost}`}
                      </p>
                    </>
                  ) : (
                    <p className="mx-2 comman-black-big">
                      {`${getServiceForSubCategory?.service_cost}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="top flex overflow-x-scroll scrolling-space remove-scrollbar-width comman-black-text">
              {getServiceForSubCategory?.session_duration && (
                <div className="flex items-center justify-center w-fit  text-nowrap pr-3">
                  {t("session_duration")}:{" "}
                  {getServiceForSubCategory?.session_duration} {t("min")}
                </div>
              )}

              {getServiceForSubCategory?.is_gender_specific ===
                BIT_VALUE.One && (
                <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                  {t("gender_specific")}
                </div>
              )}
              {getServiceForSubCategory?.is_peer_to_peer === BIT_VALUE.One && (
                <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                  {t("one_to_one")}
                </div>
              )}
              <div className="flex items-center justify-center w-fit border-l-2 text-nowrap px-3">
                {getServiceForSubCategory?.is_offline === BIT_VALUE.One
                  ? t(IS_OFFLINE_VALUES.Offline)
                  : t(IS_OFFLINE_VALUES.Online)}
              </div>
            </div>
            <div className="top">
              <div className="w-full flex">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {[...Array(5)].map((x, i) =>
                      i >
                      parseInt(
                        review?.average_rating ? review?.average_rating : "0"
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
                    <span className="mr-1 comman-black-big flex items-center justify-center ml-1">
                      {review?.total_reviews}
                    </span>
                    {review?.total_reviews && <div> {t("ratings")}</div>}
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <ICButton
                    type="button"
                    children={t("book_slot")}
                    className=" me-2 flex justify-center !w-3/5 md:!w-2/5"
                    onClick={() => {
                      if (
                        !(
                          addressData &&
                          addressData.address_line_1 &&
                          addressData.address_line_2 &&
                          addressData.city
                        ) &&
                        getServiceForSubCategory?.is_offline === BIT_VALUE.One
                      ) {
                        handleNavigate();
                        return;
                      } else if (
                        !addressData &&
                        Number(
                          getServiceForSubCategory &&
                            getServiceForSubCategory.service_cost
                        ) > 0
                      ) {
                        setShowAddressModel(true);
                        return;
                      }

                      if (
                        getServiceForSubCategory &&
                        Number(getServiceForSubCategory.service_cost) === 0
                      ) {
                        checkFreeBookingAttemps();
                      } else {
                        navigate(userRoute.slotBooking, {
                          state: { id: id },
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {getServiceForSubCategory?.service_params &&
              getServiceForSubCategory?.service_params.length > 0 && (
                <div className="flex items-center w-full overflow-x-scroll">
                  {getServiceForSubCategory.service_params.map(
                    (param: { [key: string]: string }, index: number) => {
                      const key = Object.keys(param)[0];
                      const value = param[key];
                      return (
                        <div
                          className="w-fit top mr-5 services-bg rounded-xl flex  flex-col p-5"
                          key={index}
                        >
                          <p className="mb-2.5 comman-grey text-nowrap">
                            {key}
                          </p>
                          <p className="comman-black-lg text-nowrap">{value}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            {getServiceForSubCategory?.service_tags &&
              getServiceForSubCategory?.service_tags.length > 0 && (
                <div className="flex overflow-x-scroll remove-scrollbar-width scrolling-space top">
                  {getServiceForSubCategory?.service_tags.map(
                    (value, index) => (
                      <div
                        className="comman-grey w-fit text-nowrap inline-flex items-center bread-crumb-border  text-sm font-medium rounded-full px-3 py-1 mr-2 mb-2"
                        key={index}
                      >
                        {`#${value}`}
                      </div>
                    )
                  )}
                </div>
              )}

            <div className="text-lg font-medium text-center flex remove-scrollbar-width">
              <ul className="flex justify-between lg:justify-start p-0 cursor-pointer overflow-x-auto top">
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
                {getServiceForSubCategory &&
                  getServiceForSubCategory.SCC &&
                  getServiceForSubCategory.SCC.length > 0 && (
                    <li
                      className={`me-2 list-none ${
                        activeTab === DETAILS_TYPE.CourseContent
                          ? "active-text active-border border-b-2 "
                          : ""
                      }`}
                      onClick={() => handleTabClick(DETAILS_TYPE.CourseContent)}
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
                {getServiceForSubCategory?.service_desc &&
                  getServiceForSubCategory?.service_desc.length > 0 && (
                    <div>
                      <div className="top font-medium text-justify ">
                        <p className="comman-black-lg !font-medium">
                          {t("description")}
                        </p>
                      </div>
                      <div className="comman-grey text-justify my-3">
                        <p>
                          <CustomEditor
                            serviceDesc={getServiceForSubCategory?.service_desc}
                          />
                        </p>
                      </div>
                    </div>
                  )}

                {getServiceForSubCategory?.service_pros &&
                  getServiceForSubCategory?.service_pros.length > 0 && (
                    <>
                      <div className="top comman-black-lg !font-medium">
                        <p>{t("benefits")}</p>
                      </div>
                      <ul>
                        {getServiceForSubCategory?.service_pros?.map(
                          (data: string, index: number) => (
                            <li key={index} className="comman-grey">
                              {data}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}

                {getServiceForSubCategory?.service_precautions &&
                  getServiceForSubCategory?.service_precautions.length > 0 && (
                    <div>
                      <p className="comman-black-lg !font-medium">
                        {t("precautions")}
                      </p>
                      {getServiceForSubCategory?.service_precautions && (
                        <ul>
                          {getServiceForSubCategory?.service_precautions.map(
                            (data, index) => (
                              <li key={index} className="comman-grey">
                                {data}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  )}

                {getServiceForSubCategory?.service_other_notes &&
                  getServiceForSubCategory?.service_other_notes.length > 0 && (
                    <>
                      <p className="comman-black-lg !font-medium">
                        {t("notes")}
                      </p>
                      <ul>
                        {getServiceForSubCategory?.service_other_notes.map(
                          (data, index) => (
                            <li key={index} className="comman-grey">
                              {" "}
                              {data}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}

                <div className="top">
                  {getFaqs && getFaqs.length > 0 && (
                    <>
                      <p className="comman-black-lg">{t("faqs")}</p>
                      {getFaqs.map((item, index) => (
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
                                    <a key={index} href={link} target="_blank">
                                      {link}
                                    </a>
                                  ))}
                                </p>
                              </>
                            }
                          />
                        </div>
                      ))}
                      {/* <ul className="accordion-list">
                          {getFaqs.map((item, index) => (
                            <li
                              key={index}
                              className={
                                activeIndex === index ? "active space-y-2" : ""
                              }
                            >
                              <div
                                className="question"
                                onClick={() => handleAccordionClick(index)}
                              >
                                <h3 className="!font-semibold comman-black-big">
                                  {item.question}
                                </h3>
                              </div>
                              <div
                                className="answer text-justify"
                                style={{
                                  maxHeight:
                                    activeIndex === index ? "1000px" : "0",
                                }}
                              >
                                {item.answer}
                                <p>
                                  {item.reference_links.length > 0 &&
                                    item.reference_links.map((link, index) => (
                                      <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                      >
                                        {link}
                                      </a>
                                    ))}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul> */}
                    </>
                  )}
                </div>
                <div>
                  {review && review.total_reviews > 0 && (
                    <>
                      <p className="comman-black-text top">{t("reviews")}</p>
                      {review?.star_wise_review &&
                        review?.star_wise_review.map((i, index) => (
                          <div
                            className="flex items-center justify-start"
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
                      <br />
                      {review?.review_comments &&
                        review?.review_comments.map((i: any, index: number) => (
                          <div key={index} className="top">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="!font-bold comman-black-big">
                                  {i.review_given_by}
                                </p>
                                <p className="!text-xs comman-grey">
                                  {dateFormat(new Date(i.review_date))}
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
                        ))}
                    </>
                  )}
                </div>
              </>
            )}

            {activeTab === DETAILS_TYPE.CourseContent && (
              <div>
                {getServiceForSubCategory &&
                getServiceForSubCategory.SCC &&
                getServiceForSubCategory.SCC.length > 0 ? (
                  <CourseContent
                    content={getServiceForSubCategory.SCC}
                    hideContent
                  />
                ) : (
                  <div className="flex justify-center items-center mt-5">
                    <NoData
                      title={t("course_content")}
                      height={150}
                      width={150}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
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

export default ProductServicesDetails;
