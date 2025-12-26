import { serviceMaker } from "..";
import { IPagination } from "../../data/AppInterface";
import { IBlogPost } from "../../screens/blog-post/BlogFormController";
import { ISearch } from "../../screens/blog-post/BlogPostController";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";

export const GET_ALL_BLOG_POSTS = (
  payload: IPagination,
  id?: number | null,
  search?: ISearch
) =>
  serviceMaker(
    API_ENDPOINTS.get_all_blog_posts.url +
      `?ad=true${
        search?.enterpriseSearch
          ? `&query=${encodeURIComponent(search?.enterpriseSearch)}`
          : ""
      }${id ? `&cid=${id}` : ""}&currentPage=${
        payload.current_page
      }&perPageRows=${payload.per_page_rows}&sortBy=${
        payload.sort_by
      }&orderBy=${payload.order_by} `,
    API_ENDPOINTS.get_all_blog_posts.method
  );
export const GET_MY_BLOG_POSTS = (payload: IPagination) =>
  serviceMaker(
    API_ENDPOINTS.get_my_blog_posts.url +
      "?ad=true" +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by,
    API_ENDPOINTS.get_all_blog_posts.method
  );
export const GET_ALL_FEED_POSTS = (payload: IPagination, token: string) =>
  serviceMaker(
    API_ENDPOINTS.get_all_blog_post_public.url +
      "?ad=true" +
      `&perPageRows=` +
      payload.per_page_rows +
      `&currentPage=` +
      payload.current_page +
      `&orderBy=` +
      payload.order_by +
      `&sortBy=` +
      payload.sort_by +
      `&t=${token ? token : ""}`,
    API_ENDPOINTS.get_all_blog_post_public.method
  );
export const GET_BLOG_POST_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_blog_posts.url + `/${id}`,
    API_ENDPOINTS.get_all_blog_posts.method
  );

export const CREATE_BLOG_POST = (payload: IBlogPost) =>
  serviceMaker(
    API_ENDPOINTS.create_post_for_trainer.url,
    API_ENDPOINTS.create_post_for_trainer.method,
    payload
  );
export const DELETE_BLOG_POST = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.delete_blog_post.url + `/${id}`,
    API_ENDPOINTS.delete_blog_post.method
  );

export const UPDATE_BLOG_POST = (payload: IBlogPost, id: number) =>
  serviceMaker(
    API_ENDPOINTS.update_blog_post.url + `/${id}`,
    API_ENDPOINTS.update_blog_post.method,
    payload
  );

export const LIKE_BLOG_POST_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.update_like_by_id.url + `/${id}/review`,
    API_ENDPOINTS.update_like_by_id.method
  );
export const GET_ALL_BLOGS_CATEGORY = () => {
  return serviceMaker(
    API_ENDPOINTS.get_all_blogs_category.url,
    API_ENDPOINTS.get_all_blogs_category.method
  );
};
