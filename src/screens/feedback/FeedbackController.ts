import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import * as Yup from "yup";
import { prepareMessageFromParams, toastError } from "../../utils/AppFunctions";
import { NavigateFunction } from "react-router-dom";
import { DEFAULT_STATUS_CODE_SUCCESS, MESSAGE_UNKNOWN_ERROR_OCCURRED } from "../../utils/AppConstants";
import { ADD_REVIEW, GET_FEEDBACK_TAG, GET_SERVICE_RATINGS } from "../../services/feedback/FeedbackEndpoint";

export const initialFeedbackValues = {
    ratings: 0,
    comment: "",
    insights: "",
    likes: '',
    notLikes:''
  };
  

  export interface ILikes {
    value: string;
    selecteda: number
  }

  export const addFeedbackValidationSchema = (t: TUseTranslationTfn) =>
    Yup.object().shape({
      comment: Yup.string()
        .max(
          1000,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("review")],
            ["max", "1000"],
          ])
        ),
      insights: Yup.string()
        .max(
          1000,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("insights")],
            ["max", "1000"],
          ])
        ),
    });

    export interface IReview{
        comment:string|null;
        likes:string|null;
        notlikes:string |null;
        ratings:number;
        insights:string|null;
        service_id:number;
        booking_id:number;
    }

    export interface IRatingsAndReviews{
      total_reviews:number;
      average_rating:string ;
      star_wise_review: {
        no_of_ratings:number;
        rating:number;
      }[] | null;
      review_comments:{
        review_given_by:string | null;
        ratings:number;
        review_date:Date;
        comments:string|null;
      }[] | null;
    }

    export const addReview = async (
        setLoading: TReactSetState<boolean>,
        navigation: NavigateFunction,
        t: TUseTranslationTfn,
        reviews: IReview
      ) => {
        try {
          setLoading(true);
          const resFeedback = await ADD_REVIEW(reviews);
          if (resFeedback && resFeedback.code === DEFAULT_STATUS_CODE_SUCCESS) {
            navigation(-1);
          } else {
            toastError(resFeedback.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
          }
        } catch (error: any) {
          toastError(error?.resFeedback?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
        } finally {
          setLoading(false);
        }
      };


      export const getFeedbackTags = async (
        setLoading: TReactSetState<boolean>,
        setFeedbackTagsLikes: TReactSetState<
          any
        >,
        setFeedbackTagsNotLikes: TReactSetState<
          any
        >,
        t: TUseTranslationTfn,
        serviceId: number
      ) => {
        try {
          setLoading(true);
          const resTags = await GET_FEEDBACK_TAG(serviceId);
          if (resTags && resTags.code === DEFAULT_STATUS_CODE_SUCCESS) {
            if(resTags.data.findService.feedback_tags)
                {
                    setFeedbackTagsLikes(resTags.data.findService.feedback_tags);
                    setFeedbackTagsNotLikes(resTags.data.findService.feedback_tags);
                }           
          } else {
            toastError(resTags.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
          }
        } catch (error: any) {
          toastError(error?.resTags?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
        } finally {
          setLoading(false);
        }
      };

      export const getServiceRatingsAndReviews =async (
        setLoading: TReactSetState<boolean>,
        setReviews: TReactSetState<
          IRatingsAndReviews | null
        >,
        t: TUseTranslationTfn,
        serviceId: number
      ) =>{
        try {
          setLoading(true);
          const reviews = await GET_SERVICE_RATINGS(serviceId);
          if (reviews && reviews.code === DEFAULT_STATUS_CODE_SUCCESS) {
            if(reviews.data)
            { 
               setReviews(reviews.data[0])
            }
          } else {
            toastError(reviews.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
          }
        } catch (error: any) {
          toastError(error?.reviews?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
        } finally {
          setLoading(false);
        }
      }