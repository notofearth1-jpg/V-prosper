import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { GET_TRAINER_DETAILS_BY_ID } from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { decryptData, toastError } from "../../../utils/AppFunctions";

export interface ISectionReviewStatus {
  section: number;
  status: number;
  reason: string;
}

export interface IReview {
  review_date: string;
  review_comment: string;
  section_review_status: ISectionReviewStatus[];
}

export const fetchTrainerReview = async (
  setTrainerData: TReactSetState<IReview | undefined>,
  userId: number,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const trainerList = await GET_TRAINER_DETAILS_BY_ID(userId);
    if (trainerList && trainerList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const trainerDetail = JSON.parse(decryptData(trainerList.data))
      setTrainerData(trainerDetail.review);
    } else {
      toastError(trainerList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.trainerList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const profileQuestions = [
  {
    number: 1,
    text: "Framework Agreement",
    time: "(5 minutes)",
    status: "application-overview-complete",
  },
  {
    number: 2,
    text: "Questionnaire",
    time: "(3 minutes)",
    status: "application-overview-progress",
  },
  { number: 3, text: "Upload Documents", time: "(3 minutes)" },
  {
    number: 4,
    text: "Identity Verification",
    time: "(5 minutes)",
    status: "profile-overview-pending",
  },
  { number: 5, text: "Review Application", time: "(30 minutes)" },
];
