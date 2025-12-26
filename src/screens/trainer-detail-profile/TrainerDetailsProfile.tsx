import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  certificateIcon,
  darkStarIcon,
  postIcon,
  StarIcon,
} from "../../assets/icons/SvgIconList";
import {
  ITrainerDetailsProfile,
  ITrainerFeedback,
  addTrainerFeedbackValidationSchema,
  addTranierFeedBack,
  fetchCertificatesApi,
  fetchTrainerProfile,
  getTrainerFeedback,
  initialTrainerFeedbackValues,
} from "./TrainerDetailsProfileController";
import ICImage from "../../core-component/ICImage";
import Post from "../blog-post/BlogPost";
import {
  encryptData,
  prepareMessageFromParams,
  prepareUserId,
} from "../../utils/AppFunctions";
import usePaginationHook from "../../hooks/UsePaginationHook";
import TrainerFeedback from "./TrainerFeedback";
import ICTextArea from "../../core-component/ICTextArea";
import { useFormik } from "formik";
import Loader from "../../components/common/Loader";
import ICCommonModal from "../../components/common/ICCommonModel";
import { USER_TYPE } from "../../utils/AppEnumerations";
import { ITrainerProfileCertificates } from "../trainer-profile/trainer-profile-certificates/TrainerProfileCertificatesController";

const TrainerDetailProfile = () => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [loadPost, setLoadPost] = useState(false);
  const [showFeedbackModal, setFeedbackModal] = useState(false);
  const [trainerProfileToView, setTrainerProfileToView] = useState<
    ITrainerDetailsProfile | undefined
  >();
  const [showForm, setShowForm] = useState(false);
  const [certificateList, setCertificateList] =
    useState<ITrainerProfileCertificates[]>();
  const [activeTab, setActiveTab] = useState("reviews");
  const [trainerFeedbacks, setTrainerFeedbacks] = useState<ITrainerFeedback[]>(
    []
  );
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRatings, setAverageRatings] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(50),
      current_page: 1,
      sort_by: "created_date",
      order_by: "DESC",
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showGiveFeedback, setShowGiveFeedback] = useState(false);
  const trainerId = location?.state?.trainerId;
  // this code is use in future
  //for post const trainerIdToken = "6102f52896d74b978d46303c12ccec5c";
  //for certificates const trainerIdToken = "7256f2b5096a070b8c90d9e4ed86552a";
  const trainerIdToken = encryptData(location?.state?.trainerId.toString());

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const handleCloseForm = (status: boolean) => {
    setShowForm(false);
  };

  const openEditModal = (comment: string, ratings: number) => {
    formik.setFieldValue("comment", comment);
    setStarCount(ratings);
    formik.setFieldValue("ratings", ratings);
    setFeedbackModal(true);
  };

  const fetchall = () =>
    getTrainerFeedback(
      setTrainerFeedbacks,
      setLoading,
      setLoadMore,
      setPagination,
      setTotalRatings,
      setAverageRatings,
      setShowGiveFeedback,
      t,
      pagination,
      trainerFeedbacks,
      trainerId
    );

  useEffect(() => {
    fetchTrainerProfile(setTrainerProfileToView, trainerId, setLoading);
    fetchCertificatesApi(setCertificateList, trainerIdToken, setLoading);
  }, []);

  const fetchMore = () => {
    setPagination({ ...pagination, current_page: currentPage + 1 });
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchall();
    }
  }, [currentPage]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialTrainerFeedbackValues,
    },
    validationSchema: addTrainerFeedbackValidationSchema(t),

    onSubmit: async (values) => {
      if (values && values.ratings === 0) {
        formik.setFieldError(
          "ratings",
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("ratings")],
          ])
        );
        return;
      } else {
        const payload = {
          ratings: starCount,
          comments: values.comment,
          trainer_id: trainerId,
        };
        await addTranierFeedBack(setLoadPost, setTrainerFeedbacks, t, payload);
        setFeedbackModal(false);
        resetValues();
      }
    },
  });

  const resetValues = () => {
    formik.setFieldValue("comment", "");
    setStarCount(0);
    formik.setFieldValue("ratings", 0);
    setPagination({ ...pagination, current_page: 1 });
    setCurrentPage(1);
    fetchall();
  };

  const deleteFeedback = async () => {
    const payload = {
      ratings: starCount,
      trainer_id: trainerId,
      deleted: "1",
    };
    await addTranierFeedBack(setLoadMore, setTrainerFeedbacks, t, payload);
    resetValues();
  };

  const handleStarCount = (i: number) => {
    setStarCount(i + 1);
    formik.setFieldValue("ratings", i + 1);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center p-0">
            <div className="main-identity shadow-2xl w-full sm:w-4/5 md:w-[70%] lg:w-3/5 h-svh sm:h-[calc(100vh-76px)] overflow-hidden flex flex-col">
              <div className="">
                <div className="comman-padding">
                  <BackButton />
                </div>
                <div className=" w-full flex">
                  <div className="profile-width">
                    <div className="flex items-center justify-center">
                      <div className="profile-image border-2 border-custom rounded-full overflow-hidden p-1 ">
                        <ICImage
                          imageUrl={trainerProfileToView?.media_url}
                          fallbackSrc={require("../../assets/image/avatar.png")}
                          className="w-full h-full object-cover rounded-full"
                          isPrivate
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="star flex items-center">
                        {[...Array(5)].map((x, i) =>
                          i > Math.ceil(averageRatings) - 1 ? (
                            <div className="w-5 h-5 m-1 svg-color">
                              {StarIcon}
                            </div>
                          ) : (
                            <div className="w-5 m-1 h-5 svg-color">
                              {darkStarIcon}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center mt-1">
                      <p className="comman-black-text">{totalRatings}</p>
                      <p className="mx-1 comman-black-text">{t("ratings")}</p>
                    </div>
                    {showGiveFeedback && (
                      <p
                        onClick={() => setFeedbackModal(true)}
                        className=" text-center cursor-pointer"
                      >
                        {t("give_feedback")}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <p className="comman-white-xl mt-1">
                      {trainerProfileToView?.full_name}{" "}
                      {trainerId &&
                        `(${prepareUserId(
                          USER_TYPE.Trainer,
                          trainerId.toString()
                        )})`}
                    </p>
                    <p className="comman-white-sm mt-1">
                      {t("languages")}:{" "}
                      {trainerProfileToView?.languages.join(", ")}
                    </p>
                    {trainerProfileToView?.headline && (
                      <p className="comman-white-sm mt-1">
                        {t("headline")}: {trainerProfileToView?.headline}
                      </p>
                    )}
                    <div className="flex items-center space-x-1">
                      {trainerProfileToView?.city_name && (
                        <p className="comman-white-sm mt-1">
                          {t("Preferred location")}:{" "}
                          {trainerProfileToView?.city_name}
                        </p>
                      )}
                    </div>
                    <div
                      className="h-5  w-5 cursor-pointer"
                      onClick={() => setShowForm(true)}
                    >
                      <p>{t("more")}...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-container top comman-padding !pt-0  flex-1 overflow-y-scroll remove-scrollbar-width">
                <div className="text-sm font-medium text-center border-b   border-skin-favorite-color">
                  <ul className="flex justify-around -mb-px list-none p-0 cursor">
                    <li
                      className="me-2"
                      onClick={() => handleTabClick("reviews")}
                    >
                      <p
                        className={`inline-block p-4 cursor-pointer ${
                          activeTab === "reviews"
                            ? "active-text active-border border-b-2 "
                            : ""
                        }  rounded-t-lg   flex`}
                        aria-current="page"
                      >
                        <div className="h-5 w-5 mx-1">{postIcon}</div>
                        {t("reviews")}
                      </p>
                    </li>
                    {/* need to keep this code as will continue it in phase-2 */}
                    {/* <li
                      className="me-2"
                      onClick={() => handleTabClick("posts")}
                    >
                      <p
                        className={`inline-block p-4 cursor-pointer ${
                          activeTab === "posts"
                            ? "active-text active-border border-b-2 "
                            : ""
                        }  rounded-t-lg   flex`}
                        aria-current="page"
                      >
                        <div className="h-5 w-5 mx-1">{postIcon}</div>
                        {t("posts")}
                      </p>
                    </li> */}

                    <li
                      className="me-2"
                      onClick={() => handleTabClick("certificate")}
                    >
                      <p
                        className={`inline-block p-4 cursor-pointer ${
                          activeTab === "certificate"
                            ? "active-text active-border border-b-2 "
                            : ""
                        }  rounded-t-lg   flex`}
                        aria-current="page"
                      >
                        <div className="h-5 w-5 mx-1">{certificateIcon}</div>
                        {t("certificates")}
                      </p>
                    </li>
                  </ul>
                </div>
                <div>
                  {activeTab === "reviews" && (
                    <div className="top space-y-3 ">
                      {trainerFeedbacks &&
                        trainerFeedbacks.map((i: ITrainerFeedback) => (
                          <TrainerFeedback
                            trainerFeedbacks={i}
                            openEditModal={openEditModal}
                            deleteFeedback={deleteFeedback}
                          />
                        ))}
                      {trainerFeedbacks &&
                      pagination.total_count > trainerFeedbacks.length &&
                      trainerFeedbacks.length > 0 &&
                      !loadMore ? (
                        <div
                          onClick={fetchMore}
                          className="self-center justify-center cursor"
                        >
                          <p className="font-bold text-lg text-center mb-8">
                            {t("load_more_feedbacks")}
                          </p>
                        </div>
                      ) : null}
                      {loadMore ? (
                        <div className="mx-auto">
                          <img
                            className="mb-4"
                            src={require("../../assets/image/loader-1.gif")}
                            alt="Lodding"
                          />
                        </div>
                      ) : (
                        <div className="self-center justify-center ">
                          {trainerFeedbacks.length === 0 && !loadMore && (
                            <p className="font-bold text-lg text-center mb-8">
                              {t("add_first_feedback")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "posts" && (
                    <div className="top posts  overflow-y-scroll">
                      <div className="image">
                        <Post
                          trainerIdToken={trainerIdToken}
                          showTrainer={true}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "certificate" && (
                    <div className="mt-6  space-y-3  overflow-y-scroll remove-scrollbar-width">
                      {certificateList &&
                        certificateList.length > 0 &&
                        certificateList.map((cert, index) => (
                          <div key={index} className="mb-4 review-helth">
                            <div className="flex items-center justify-center aspect-16/9 object-contain w-full">
                              <ICImage
                                imageUrl={
                                  cert?.app_media[0]?.media_url
                                    ? cert?.app_media[0]?.media_url
                                    : cert?.cert_image_url
                                }
                                scaled={false}
                                className="aspect-16/9 w-full object-contain"
                                isPrivate
                              />
                            </div>
                            <div className="mt-2">{cert?.category_title}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showForm && (
            <ICCommonModal
              title={t("")}
              content={
                <div className="space-y-2">
                  <div className=" comman-black-big font-medium">
                    <p>{t("skill_set")}</p>
                  </div>
                  <ul className="list-none">
                    <li>
                      <div className="time flex flex-wrap m-1">
                        {trainerProfileToView?.skill_set.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center m-1 justify-center time-container services-bg comman-grey"
                          >
                            <p>{item}</p>
                          </div>
                        ))}
                      </div>
                    </li>
                  </ul>
                  {trainerProfileToView?.bio && (
                    <div className="comman-black-big text-justify">
                      <div className="top font-medium">
                        <p>{t("bio")}</p>
                      </div>
                      <ul className="comman-grey">
                        {trainerProfileToView?.bio}
                      </ul>
                    </div>
                  )}
                </div>
              }
              isModalShow={showForm}
              setIsModalShow={setShowForm}
            />
          )}
          {showForm && <div className="model-disable"></div>}
          {showFeedbackModal ? (
            <div
              className={`modal-overlay-model backdrop-blur-sm !bg-black !bg-opacity-80 `}
            >
              <div className="modal-custom w-4/5 sm:w-3/4 md:w-3/5 lg:w-1/2">
                <p className="top">{t("give_ratings")}</p>
                <div className="mt-2 mb-2 flex items-center -ml-1">
                  <div className="stars flex">
                    {[...Array(5)].map((x, i) =>
                      i > starCount - 1 ? (
                        <div
                          key={i}
                          className="w-5 h-5 mr-1 ml-1 svg-color cursor"
                          onClick={() => handleStarCount(i)}
                        >
                          {StarIcon}
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStarCount(i)}
                          className="w-5 mr-1 ml-1 h-5 svg-color cursor"
                        >
                          {darkStarIcon}
                        </div>
                      )
                    )}
                  </div>
                  <div className="ml-2">
                    <p className="comman-bkack-text">{starCount}/5</p>
                  </div>
                </div>
                {formik.errors.ratings ? (
                  <div className="text-red-400">{formik.errors.ratings}</div>
                ) : null}

                <div className="top light-grey">
                  <p>{t("write_review")}</p>
                </div>

                <div className="mt-2 light-grey">
                  <ICTextArea
                    maxLength={1000}
                    name={"comment"}
                    placeholder={t("feedback_review")}
                    errorMessage={
                      formik.touched.comment ? formik.errors.comment : undefined
                    }
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="flex justify-evenly top items-center">
                  {!loadPost ? (
                    <>
                      <button
                        className="cursor bg-skin-primary-button text-lg rounded-full  w-fit text-skin-on-primary p-2 pl-4 pr-4 "
                        onClick={() => formik.handleSubmit()}
                      >
                        {t("post")}
                      </button>
                      <button
                        className="cursor text-lg rounded-full  w-fit  p-2 pl-4 pr-4 "
                        onClick={() => setFeedbackModal(false)}
                      >
                        {t("cancel")}
                      </button>
                    </>
                  ) : (
                    <div className="mx-auto">
                      <img
                        className="mb-4"
                        src={require("../../assets/image/loader-1.gif")}
                        alt="Lodding"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default TrainerDetailProfile;
