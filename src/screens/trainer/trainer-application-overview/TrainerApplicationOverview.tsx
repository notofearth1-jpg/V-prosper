import React, { useEffect, useRef, useState } from "react";
import { TReactSetState } from "../../../data/AppType";
import { ITrainerDetails, fetchTrainerDetails } from "../trainerController";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { errorIcon, lockIcon } from "../../../assets/icons/SvgIconList";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  IReview,
  ISectionReviewStatus,
  fetchTrainerReview,
  profileQuestions,
} from "./TrainerApplicationOverviewController";
import { sweetAlertInfo } from "../../../utils/AppFunctions";
import {
  PROFILE_OVERVIEW,
  TRAINER_APPLICATION_DOCUMENT_SECTION,
  TRAINER_ON_BOARD,
} from "../../../utils/AppEnumerations";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import { userRoute } from "../../../routes/RouteUser";

interface ITrainerCity {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerProfileOverview: React.FC<ITrainerCity> = ({
  setCurrentIndex,
}) => {
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [trainerReviewDetails, setTrainerReviewDetails] = useState<
    IReview | undefined
  >();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const userId = localStorageUtils.getUserId();
  const navigate = useNavigate();
  const { t } = UseTranslationHook();

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(location.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchTrainerReview(
        setTrainerReviewDetails,
        Number(userId),
        setLoading,
        t
      );
      const storedDetails = await localStorageUtils.getTrainerDetails();

      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setTrainerDetails(updatedDetails);
      }
    };
    fetchData();
  }, []);

  const getQuestionStatusClass = (questionNumber: number) => {
    if (trainerDetails && trainerDetails.overview_section_status) {
      if (
        trainerDetails.overview_section_status.completed.includes(
          questionNumber
        )
      ) {
        return "application-overview-complete cursor";
      } else if (
        trainerDetails.overview_section_status.in_progress.includes(
          questionNumber
        )
      ) {
        return "application-overview-progress cursor";
      } else {
        return "application-overview-pending";
      }
    }
    return "application-overview-pending";
  };

  const handleClick = (questionNumber: number) => {
    if (
      trainerDetails &&
      trainerDetails.overview_section_status &&
      (trainerDetails.overview_section_status.completed.includes(
        questionNumber
      ) ||
        trainerDetails.overview_section_status.in_progress.includes(
          questionNumber
        ))
    ) {
      switch (questionNumber) {
        case 1:
          setCurrentIndex(TRAINER_ON_BOARD.TrainerAgreement);
          updateQueryStringParameter("fa", 1);
          break;
        case 2:
          setCurrentIndex(TRAINER_ON_BOARD.TrainerCategory);
          updateQueryStringParameter("qa", 1);
          break;
        case 3:
          setCurrentIndex(TRAINER_ON_BOARD.TrainerIdentity);
          updateQueryStringParameter("ud", 1);
          break;
        case 4:
          if (
            !trainerReviewDetails?.section_review_status ||
            trainerReviewDetails?.section_review_status?.find(
              (review) =>
                review.section === PROFILE_OVERVIEW.UploadDocuments &&
                review.status ===
                  TRAINER_APPLICATION_DOCUMENT_SECTION.AddressVerification
            )
          ) {
            setCurrentIndex(TRAINER_ON_BOARD.TrainerVerification);
            updateQueryStringParameter("id", 1);
          } else {
            sweetAlertInfo(t("identity_verification_completed"));
          }
          break;
        case 5:
          setCurrentIndex(TRAINER_ON_BOARD.TrainerReviewApplication);
          updateQueryStringParameter("ra", 1);
          break;
        default:
          break;
      }
    } else {
      switch (questionNumber) {
        case 1:
          setCurrentIndex(TRAINER_ON_BOARD.TrainerAgreement);
          break;
      }
    }
  };

  // Function to determine if icon should be displayed for a question based on section review status
  const applicationSectionInvalid = (
    questionNumber: number,
    sectionReviewStatus: ISectionReviewStatus[]
  ) => {
    // Check if there is a matching section and number combination

    return sectionReviewStatus.some((status) => {
      return (
        (status.section ===
          TRAINER_APPLICATION_DOCUMENT_SECTION.IdentityVerification &&
          questionNumber === PROFILE_OVERVIEW.UploadDocuments) ||
        (status.section ===
          TRAINER_APPLICATION_DOCUMENT_SECTION.AddressVerification &&
          questionNumber === PROFILE_OVERVIEW.Questionnaire) ||
        (status.section ===
          TRAINER_APPLICATION_DOCUMENT_SECTION.KeycodeVerification &&
          questionNumber === PROFILE_OVERVIEW.IdentityVerification)
      );
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const handleInfoIconClick = (
    event: React.MouseEvent<HTMLDivElement>,
    reason: string
  ) => {
    // Prevent the event from propagating to the parent div
    event.stopPropagation();

    // Show SweetAlert with the reason
    sweetAlertInfo(reason);
  };

  useEffect(() => {
    fetchTrainerDetails(setTrainerDetails, Number(userId), setLoading, t);
  }, []);

  if (trainerDetails) {
    const serializedDetails = JSON.stringify(trainerDetails);
    localStorageUtils.setTrainerDetails(serializedDetails);
  }

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  return (
    <>
      <div
        ref={mainBgRef}
        className={`${isFullHeight ? "h-[96vh]" : "h-auto"}`}
      >
        <div className="grid grid-cols-1 gap-0 lg:gap-5">
          <div className="flex justify-center">
            <div>
              <div className="">
                <BackButton />
                <p className="alt-mobile">{t("profile_overview")}</p>
              </div>

              {profileQuestions.map((question, index) => (
                <div
                  className="profile-container top w-full"
                  key={index}
                  onClick={() => {
                    handleClick(question.number);
                  }}
                >
                  <div
                    className={`profile-question flex ${getQuestionStatusClass(
                      question.number
                    )}`}
                  >
                    <div className="profile-number text-skin-trainer flex items-center justify-center">
                      <p>{question.number}</p>
                    </div>
                    <div className="profile-question-text ml-5">
                      <p className="comman-question-text">{question.text}</p>
                      <p className="comman-black-text flex items-center">
                        {question.time}
                        {applicationSectionInvalid(
                          question.number,
                          trainerReviewDetails?.section_review_status || []
                        ) && (
                          <>
                            {trainerReviewDetails?.section_review_status?.map(
                              (status, index) =>
                                status.reason && // Check if reason is provided
                                ((status.section ===
                                  TRAINER_APPLICATION_DOCUMENT_SECTION.IdentityVerification &&
                                  question.number ===
                                    PROFILE_OVERVIEW.UploadDocuments) ||
                                  (status.section ===
                                    TRAINER_APPLICATION_DOCUMENT_SECTION.AddressVerification &&
                                    question.number ===
                                      PROFILE_OVERVIEW.Questionnaire) ||
                                  (status.section ===
                                    TRAINER_APPLICATION_DOCUMENT_SECTION.KeycodeVerification &&
                                    question.number ===
                                      PROFILE_OVERVIEW.IdentityVerification)) && (
                                  <div
                                    key={index}
                                    className="w-5 h-5 mx-2 text-skin-trainer-validation"
                                    onClick={(event) =>
                                      handleInfoIconClick(event, status.reason)
                                    }
                                  >
                                    {errorIcon}
                                  </div>
                                )
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="top">
                <div className="flex">
                  <div className="w-8 h-8">{lockIcon}</div>
                  <div className="div ml-5 flex items-center">
                    <p className="comman-SubFont">
                      {t("data_protection_privacy")}
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
              <div className="top">
                <div
                  className="comman-blue comman-SubFont cursor"
                  onClick={() => navigate(userRoute.helpCenter)}
                >
                  {t("get_support")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerProfileOverview;
