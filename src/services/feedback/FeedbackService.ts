import { serviceMaker } from "..";
import { IReview } from "../../screens/feedback/FeedbackController";

import { API_ENDPOINTS } from "../../utils/ApiEndPoint" ;

export const ADD_REVIEW = (payload: IReview) =>
  serviceMaker(
    API_ENDPOINTS.add_review.url,
    API_ENDPOINTS.add_review.method,
    payload
  );

  export const GET_FEEDBACK_TAG = (serviceId: number) =>
    serviceMaker(
      API_ENDPOINTS.get_feedback_tags.url+serviceId+'/feedback-tags',
      API_ENDPOINTS.get_feedback_tags.method,
    );

    export const GET_SERVICE_RATINGS = (serviceId: number) =>
      serviceMaker(
        API_ENDPOINTS.get_service_ratings.url+serviceId,
        API_ENDPOINTS.get_service_ratings.method,
      );