import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addFeedbackValidationSchema,
  addReview,
  getFeedbackTags,
  initialFeedbackValues,
  IReview,
} from "./FeedbackController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { darkStarIcon, StarIcon } from "../../assets/icons/SvgIconList";
import ICTextInput from "../../core-component/ICTextInput";
import ICTextArea from "../../core-component/ICTextArea";
import { prepareMessageFromParams } from "../../utils/AppFunctions";
import ICButton from "../../core-component/ICButton";
import Loader from "../../components/common/Loader";

interface IFeedback {
  serviceId: number;
  bookingId: number;
}

const Feedback: React.FC<IFeedback> = ({ serviceId, bookingId }) => {
  const [starCount, setStarCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedbackTagsLikes, setFeedbackLikes] = useState<string[]>([]);
  const [feedbackTagsNotLikes, setFeedbackNotLikes] = useState<string[]>([]);
  const { t } = UseTranslationHook();
  const [likesArr, setLikeArr] = useState<string[]>([]);
  const [notLikesArr, setNotLikeArr] = useState<string[]>([]);

  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialFeedbackValues,
    },
    validationSchema: addFeedbackValidationSchema(t),

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
        const payload: IReview = {
          comment: values.comment,
          likes:
            values.likes.length > 0 ? values.likes : JSON.stringify(likesArr),
          notlikes:
            values.notLikes.length > 0
              ? values.notLikes
              : JSON.stringify(notLikesArr),
          ratings: starCount,
          insights: values.insights,
          service_id: serviceId,
          booking_id: bookingId,
        };
        await addReview(setLoading, navigate, t, payload);
      }
    },
  });

  useEffect(() => {
    getFeedbackTags(
      setLoading,
      setFeedbackLikes,
      setFeedbackNotLikes,
      t,
      serviceId
    );
  }, []);

  useEffect(() => {
    if (
      formik?.values &&
      formik.values.likes &&
      formik.values.likes.length > 0
    ) {
      setFeedbackLikes([...feedbackTagsLikes, ...likesArr]);
      setLikeArr([]);
    }
  }, [formik.values.likes]);

  useEffect(() => {
    if (
      formik?.values &&
      formik.values.notLikes &&
      formik.values.notLikes.length > 0
    ) {
      setFeedbackNotLikes([...feedbackTagsNotLikes, ...notLikesArr]);
      setNotLikeArr([]);
    }
  }, [formik.values.notLikes]);

  const handleStarCount = (i: number) => {
    setStarCount(i + 1);
    formik.setFieldValue("ratings", i + 1);
  };

  const addLikeOrDislikes = (str: string, type = 1) => {
    if (type === 1) {
      if (formik.values && formik.values.likes.length > 0) return;
      const res = likesArr.findIndex((i: string) => i === str);
      if (res < 0) {
        setLikeArr([...likesArr, str]);
        setFeedbackLikes(feedbackTagsLikes.filter((i: string) => i !== str));
      } else {
        setLikeArr(likesArr.filter((i: string) => i !== str));
        setFeedbackLikes([...feedbackTagsLikes, str]);
      }
    } else {
      if (formik.values && formik.values.notLikes.length > 0) return;
      const res = notLikesArr.findIndex((i: string) => i === str);
      if (res < 0) {
        setNotLikeArr([...notLikesArr, str]);
        setFeedbackNotLikes(
          feedbackTagsNotLikes.filter((i: string) => i !== str)
        );
      } else {
        setNotLikeArr(notLikesArr.filter((i: string) => i !== str));
        setFeedbackNotLikes([...feedbackTagsNotLikes, str]);
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="pl-3">
          <div className="top comman-black-text">
            <p>{t("rate_experiance")}</p>
          </div>

          <div className=" mt-2 flex items-center">
            <div className="flex">
              {[...Array(5)].map((x, i) =>
                i > starCount - 1 ? (
                  <div
                    key={i}
                    className="w-5 h-5 m-1 svg-color cursor"
                    onClick={() => handleStarCount(i)}
                  >
                    {StarIcon}
                  </div>
                ) : (
                  <div
                    onClick={() => handleStarCount(i)}
                    className="w-5 m-1 h-5 svg-color cursor"
                  >
                    {darkStarIcon}
                  </div>
                )
              )}
            </div>
            <div className="ml-5">
              <p className="comman-bkack-text">{starCount}/5</p>
            </div>
          </div>
          {formik.errors.ratings ? (
            <div className="text-red-400">{formik.errors.ratings}</div>
          ) : null}

          <div className="top comman-black-text">
            <p>{t("what_did_you_like")}</p>
          </div>

          <div className="">
            <div className="flex flex-wrap space-between">
              {likesArr &&
                likesArr.map((i, index) => (
                  <div
                    key={index}
                    className="mt-2 tag-box mx-1 cursor"
                    onClick={() => addLikeOrDislikes(i)}
                  >
                    <p className="comman-black-text">{i}</p>
                  </div>
                ))}
            </div>
            <ICTextInput
              placeholder={t("search_tags")}
              name="likes"
              value={formik.values.likes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="flex flex-wrap space-between">
            {feedbackTagsLikes &&
              feedbackTagsLikes.map((i, index) => (
                <div
                  key={index}
                  className="mt-2 tag-box mx-1 cursor"
                  onClick={() => addLikeOrDislikes(i)}
                >
                  <p className="comman-black-text">{i}</p>
                </div>
              ))}
          </div>

          <div className="top comman-black-text">
            <p>{t("what_did_you_notlike")}</p>
          </div>

          <div className="">
            <div className="flex flex-wrap space-between">
              {notLikesArr &&
                notLikesArr.map((i, index) => (
                  <div
                    key={index}
                    className="mt-2 tag-box mr-1 cursor"
                    onClick={() => addLikeOrDislikes(i, 2)}
                  >
                    <p className="comman-black-text">{i}</p>
                  </div>
                ))}
            </div>
            <ICTextInput
              placeholder={t("search_tags")}
              name="notLikes"
              value={formik.values.notLikes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></ICTextInput>
          </div>

          <div className="flex flex-wrap space-between">
            {feedbackTagsNotLikes &&
              feedbackTagsNotLikes.map((i, index) => (
                <div
                  key={index}
                  className="mt-2 tag-box mx-1 cursor"
                  onClick={() => addLikeOrDislikes(i, 2)}
                >
                  <p className="comman-black-text">{i}</p>
                </div>
              ))}
          </div>

          <div className="top light-grey">
            <p>{t("write_review")}</p>
          </div>

          <div className="mt-3 light-grey">
            <ICTextArea
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
          <div className="top light-grey">
            <p>{t("insights")}</p>
          </div>

          <div className="mt-3 light-grey">
            <ICTextArea
              name={"insights"}
              placeholder={t("insights_review")}
              errorMessage={
                formik.touched.insights ? formik.errors.insights : undefined
              }
              value={formik.values.insights}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full mb-10 top">
            <ICButton ClassName="w-full" onClick={() => formik.handleSubmit()}>
              <p className="comman-white-text">{t("submit")}</p>
            </ICButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
