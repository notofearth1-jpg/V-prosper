import { NavigateFunction, useNavigate } from "react-router-dom";
import { SweetAlertError } from "../../components/common/sweetAlertError";
import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { CREATE_BLOG_POST, UPDATE_BLOG_POST } from "../../services/Endpoints";
import * as Yup from "yup";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  getLocalDate,
  prepareMessageFromParams,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import { IMediaItemImage } from "./trainer-create-blog-post/TrainerCreateBlogPost";
import { BLOG_DATA_PUBLISHED } from "../../utils/AppEnumerations";
import { routeTrainer } from "../../routes/RouteTrainer";
export interface IBlogPost {
  id?: number;
  blog_title: string;
  blog_meta_title: string;
  slug: string;
  blog_content: string;
  post_anonymously: string;
  hash_tags: string[];
  blogs_media: IMediaItemImage[];
  cover_image: string;
  publish_date: string;
  expiry_date?: string;
  published: string;
}
export const getBlogPostInitialValues = (): IBlogPost => {
  return {
    blog_meta_title: "",
    blog_title: "",
    slug: "",
    blog_content: "",
    hash_tags: [],
    blogs_media: [],
    cover_image: "",
    post_anonymously: "0",
    publish_date: getLocalDate().toISOString(),
    published: "",
  };
};
export const createSlug = (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
export const removeSpecialCharacters = (input: string) => {
  return input.replace(/[^\w\s]/gi, "");
};
export const blogValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    blog_title: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("blog_title")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("blog_title")],
          ["max", "50"],
        ])
      ),
    blog_content: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("blog_content")],
        ])
      )
      .max(
        300,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("blog_content")],
          ["max", "300"],
        ])
      ),
  });
export const handleSubmitBlog = async (
  values: IBlogPost,
  setLoading: TReactSetState<boolean>,
  navigate: NavigateFunction,
  t: TUseTranslationTfn,
  id?: number | undefined
) => {
  setLoading(true);
  try {
    let resultBlogs;
    if (!id) {
      resultBlogs = await CREATE_BLOG_POST(values);
      if (resultBlogs.code === DEFAULT_STATUS_CODE_SUCCESS) {
        sweetAlertSuccess(resultBlogs.message);
        navigate(routeTrainer.community);
      }
    } else {
      resultBlogs = await UPDATE_BLOG_POST(values, id);
      navigate(-2);
    }
    if (resultBlogs && resultBlogs.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (id) {
        sweetAlertSuccess(
          prepareMessageFromParams(t("update_data_successfully"), [
            ["updatedName", t("blog")],
          ])
        );
      } else if (resultBlogs.data.published === BLOG_DATA_PUBLISHED.isFalse) {
        sweetAlertSuccess(
          prepareMessageFromParams(t("add_data_to_draft_successfully"), [
            ["addName", t("blog")],
          ])
        );
      } else {
        sweetAlertSuccess(
          prepareMessageFromParams(t("add_data_successfully"), [
            ["addName", t("blog")],
          ])
        );
      }
    } else {
      sweetAlertError(resultBlogs?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (e: any) {
    SweetAlertError(e?.resultBlogs?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
