import { IPagination } from "../../data/AppInterface";
import {
  TReactSetState,
  TSetPaginationFn,
  TUseTranslationTfn,
} from "../../data/AppType";
import {
  ADD_UPDATE_TRAINER_FEEDBACK,
  GET_ALL_TRAINER_CERTIFICATES_PUBLIC,
  GET_TRAINER_FEEDBACK,
  GET_TRAINER_INFO_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  decryptData,
  generatePaginationFromApiRes,
  prepareMessageFromParams,
  resetPaginationWithPpr,
  toastError,
} from "../../utils/AppFunctions";
import * as Yup from "yup";
import { ITrainerProfileCertificates } from "../trainer-profile/trainer-profile-certificates/TrainerProfileCertificatesController";
export interface ITrainerDetailsProfile {
  headline: string;
  bio: string;
  full_name: string;
  languages: string[];
  media_url: string;
  skill_set: string[];
  city_name: string;
}

export const initialTrainerFeedbackValues = {
  ratings: 0,
  comment: "",
};

export const addTrainerFeedbackValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    comment: Yup.string().max(
      1000,
      prepareMessageFromParams(t("error_message_max_length"), [
        ["fieldName", t("review")],
        ["max", "1000"],
      ])
    ),
  });

export interface ITrainerCertificates {
  cert_image_url: string;
}

export const fetchTrainerProfile = async (
  setTrainerProfileToView: TReactSetState<ITrainerDetailsProfile | undefined>,
  trainerId: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerInfoList = await GET_TRAINER_INFO_BY_ID(trainerId);

    if (
      trainerInfoList &&
      trainerInfoList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      const trainerData =  JSON.parse(decryptData(trainerInfoList.data))
      setTrainerProfileToView(trainerData);
    } else {
      toastError(trainerInfoList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchCertificatesApi = async (
  setCertificateList: TReactSetState<ITrainerProfileCertificates[] | undefined>,
  trainerIdToken: string,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerCertificatesList = await GET_ALL_TRAINER_CERTIFICATES_PUBLIC(
      trainerIdToken
    );

    if (
      trainerCertificatesList &&
      trainerCertificatesList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setCertificateList(trainerCertificatesList.data);
    } else {
      toastError(
        trainerCertificatesList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export interface ITrainerFeedback {
  id: number;
  user_name: string | null;
  modified_date: Date | null;
  trainer_name: string | null;
  comments: string | null;
  ratings: number;
  created_date: Date;
  user_id: number;
}

export const getTrainerFeedback = async (
  setTrainerFeedbacks: TReactSetState<ITrainerFeedback[]>,
  setLoading: TReactSetState<boolean>,
  setLoadMore: TReactSetState<boolean>,
  setPagination: TSetPaginationFn,
  setTotalRatings: TReactSetState<number>,
  setAverageRatings: TReactSetState<number>,
  setShowGiveFeedback: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  pagination: IPagination,
  trainerFeedbacks: ITrainerFeedback[],
  trainerId: number
) => {
  try {
    if (!trainerFeedbacks) setLoading(true);
    else setLoadMore(true);
    const feedback_list: any = await GET_TRAINER_FEEDBACK(
      pagination,
      trainerId
    );
    if (feedback_list && feedback_list.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setTotalRatings(feedback_list?.data?.totalRatings);
      setAverageRatings(feedback_list?.data?.avgRatings.avg_rating);
      if (pagination.current_page > 1) {
        setTrainerFeedbacks([
          ...trainerFeedbacks,
          ...feedback_list?.data?.item,
        ]);
      } else {
        setTrainerFeedbacks(feedback_list?.data?.item);
      }
      setShowGiveFeedback(feedback_list?.data?.isFeedbackGiven);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(feedback_list.data.pagination),
      });
    } else {
      setTrainerFeedbacks([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
      toastError(feedback_list?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.feedback_list?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
    setLoadMore(false);
  }
};

export interface IAddTrainerFeedback {
  trainer_id: number;
  ratings: number;
  comments?: string | null;
  deleted?: string | null;
}

export const addTranierFeedBack = async (
  setLoading: TReactSetState<boolean>,
  setTrainerFeedbacks: TReactSetState<ITrainerFeedback[]>,
  t: TUseTranslationTfn,
  payload: IAddTrainerFeedback
) => {
  try {
    setLoading(true);
    const resFeedback = await ADD_UPDATE_TRAINER_FEEDBACK(payload);
    if (resFeedback && resFeedback.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setTrainerFeedbacks([]);
    } else {
      toastError(resFeedback.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resFeedback?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
