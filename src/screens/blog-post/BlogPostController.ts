import {
  TReactSetState,
  TSetPaginationFn,
  TUseTranslationTfn,
} from "../../data/AppType";
import {
  getLocalDate,
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
  generatePaginationFromApiRes,
  resetPaginationWithPpr,
} from "../../utils/AppFunctions";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  DELETE_BLOG_POST,
  GET_ALL_BLOG_POSTS,
  GET_ALL_FEED_POSTS,
  GET_BLOG_POST_BY_ID,
  GET_MY_BLOG_POSTS,
  GLOBAL_DROP_DOWN,
  LIKE_BLOG_POST_BY_ID,
} from "../../services/Endpoints";
import { NavigateFunction, Navigation } from "react-router-dom";
import { IBlogPost } from "./BlogFormController";
import { IPagination } from "../../data/AppInterface";
import { GET_ALL_BLOGS_CATEGORY } from "../../services/community/CommunityService";
export interface IBlog {
  id: number;
  created_by_user: number;
  blog_title: string;
  blog_content: string;
  blog_categories: [];
  post_anonymously: string;
  cover_image: string;
  blog_tags: [];
  blog_meta_title: string;
  slug: string;
  created_by: string;
  profile_url: string;
  blog_liked: "0" | "1" | null;
  total_reviews: string;
  app_media: [
    {
      media_type: string;
      media_url: string;
    }
  ];
  published: string;
  expiry_date: string;
  publish_date: string;
  is_admin: string;
}
export interface IBlogLiked {
  liked: string;
}

export interface IDDL {
  data_value: number;
  display_value: string;
}
export interface IBlogsCategory {
  id: number;
  category_title: string;
  category_meta_title: string;
  parent_category_id?: number;
  slug: string;
  is_active?: string;
  deleted?: string;
}

export interface ISearch {
  enterpriseSearch?: string;
  deleteAll?: boolean;
}
export const anonymousUser = [
  {
    anonymous_user: "A1",
    imageUrl: require("../../assets/image/anonnymous-user-image/icons8-account-94.png"),
  },
  {
    anonymous_user: "BCD",
    imageUrl: require("../../assets/image/anonnymous-user-image/2753360_379727-PCCEG7-675.jpg"),
  },
  {
    anonymous_user: "EFG",
    imageUrl: require("../../assets/image/anonnymous-user-image/icons8-account-96.png"),
  },
];

export const getRandomAnonymousUser = () => {
  const randomIndex = Math.floor(Math.random() * anonymousUser.length);
  return anonymousUser[randomIndex];
};

export const fetchBlogsApi = async (
  isAppend: boolean,
  setBlogPostList: TReactSetState<IBlog[]>,
  setLoading: TReactSetState<boolean>,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  blogPost: IBlog[],
  setLoader: TReactSetState<boolean>,
  trainerIdToken?: string,
  search?: ISearch,
  id?: number | null
) => {
  try {
    setLoader(true);
    let blogPostList;
    if (!trainerIdToken) {
      blogPostList = await GET_ALL_BLOG_POSTS(pagination, id, search);
    } else {
      blogPostList = await GET_ALL_FEED_POSTS(pagination, trainerIdToken);
    }

    if (blogPostList && blogPostList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (isAppend) {
        setBlogPostList([...blogPost, ...blogPostList?.data?.item]);
      } else setBlogPostList(blogPostList?.data?.item);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(blogPostList.data.pagination),
      });
    } else {
      setBlogPostList([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
    }
  } catch (error: any) {
    toastError(error?.blogPostList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
    setLoader(false);
  }
};
export const fetchMyBlogs = async (
  setBlogPostList: TReactSetState<IBlog[]>,
  setLoading: TReactSetState<boolean>,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  blogPost: IBlog[],
  setLoader: TReactSetState<boolean>,
  trainerIdToken?: string
) => {
  try {
    if (!blogPost) setLoading(true);
    else {
      setLoader(true);
      let blogPostList;
      if (!trainerIdToken) {
        blogPostList = await GET_MY_BLOG_POSTS(pagination);
      } else {
        blogPostList = await GET_ALL_FEED_POSTS(pagination, trainerIdToken);
      }

      if (blogPostList && blogPostList.code === DEFAULT_STATUS_CODE_SUCCESS) {
        if (blogPost && blogPost.length > 0) {
          setBlogPostList([...blogPost, ...blogPostList?.data?.item]);
        } else setBlogPostList(blogPostList?.data?.item);
        setPagination({
          ...pagination,
          ...generatePaginationFromApiRes(blogPostList.data.pagination),
        });
      } else {
        setBlogPostList([]);
        setPagination({
          ...pagination,
          ...resetPaginationWithPpr(pagination.per_page_rows),
        });
      }
    }
  } catch (error: any) {
    toastError(error?.blogPostList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
    setLoader(false);
  }
};
export const fetchBlogPostById = async (
  setPostInfo: TReactSetState<IBlog | undefined>,
  setLoading: TReactSetState<boolean>,
  t: TUseTranslationTfn,
  id: number
) => {
  try {
    setLoading(true);
    const blogPostId = await GET_BLOG_POST_BY_ID(id);
    if (blogPostId && blogPostId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setPostInfo(blogPostId.data);
    } else {
      toastError(blogPostId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.blogPostId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchBlogByIdForUpdate = async (
  id: number | undefined,
  setBlogsFormInitialValues: TReactSetState<IBlogPost | undefined>,
  setTags: TReactSetState<string[]>
) => {
  try {
    if (id) {
      const blogById = await GET_BLOG_POST_BY_ID(id);
      if (blogById && blogById.code === DEFAULT_STATUS_CODE_SUCCESS) {
        setBlogsFormInitialValues({
          id: blogById.data.id,
          blog_title: blogById.data.blog_title || "",
          blog_meta_title: blogById.data.blog_meta_title || "",
          blog_content: blogById.data.blog_content || "",
          cover_image: blogById.data.cover_image || "",
          slug: blogById.data.slug || "",
          published: blogById.data.published || "0",
          publish_date: blogById.data.publish_date
            ? getLocalDate(blogById.data.publish_date).toISOString()
            : "",
          expiry_date: blogById.data.expiry_date
            ? getLocalDate(blogById.data.expiry_date).toISOString()
            : "",
          hash_tags: blogById.data.blog_tags || [],
          blogs_media: blogById.data.app_media || [],
          post_anonymously: blogById.data.post_anonymously || "0",
        });
        setTags(blogById.data.blog_tags);
      } else {
        sweetAlertError(blogById.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      }
    }
  } catch (e: any) {
    sweetAlertError(e?.blogById?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
export const deleteBlogPostById = async (
  id: number,
  navigator: NavigateFunction,
  t: TUseTranslationTfn
) => {
  try {
    const blogDelete = await DELETE_BLOG_POST(id);
    if (blogDelete && blogDelete.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(blogDelete.message);
      navigator(-1);
      return true;
    } else {
      sweetAlertError(blogDelete.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
    return false;
  } catch (e: any) {
    sweetAlertError(e?.blogDelete?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  }
};
export const likeBlogPostById = async (
  id: number,
  blogPostList: IBlog[],
  setBlogPostList: TReactSetState<IBlog[]>,
  setLikeBuffer: TReactSetState<boolean>
) => {
  try {
    if (id) {
      const LikeBlogPost = await LIKE_BLOG_POST_BY_ID(id);
      if (LikeBlogPost && LikeBlogPost.code === DEFAULT_STATUS_CODE_SUCCESS) {
        const tempBlog = blogPostList.map((blog) => {
          if (blog.id === id) {
            return {
              ...blog,
              blog_liked: LikeBlogPost.data.liked,
              total_reviews: Math.max(
                (blog.total_reviews ? Number(blog.total_reviews) : 0) +
                  (LikeBlogPost.data.liked === "1" ? 1 : -1),
                0
              ).toString(),
            };
          } else {
            return blog;
          }
        });
        setLikeBuffer(true);
        setBlogPostList(tempBlog);
      } else {
        toastError(LikeBlogPost.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      }
    }
  } catch (error: any) {
    toastError(error?.LikeBlogPost?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  } finally {
    setLikeBuffer(false);
  }
};
export const likeBlogPostByIdForDetailPost = async (
  id: number,
  setBlogPostList: TReactSetState<IBlog | undefined>
) => {
  try {
    if (id) {
      const LikeBlogPost = await LIKE_BLOG_POST_BY_ID(id);
      if (LikeBlogPost && LikeBlogPost.code === DEFAULT_STATUS_CODE_SUCCESS) {
        const blogPostId = await GET_BLOG_POST_BY_ID(id);
        if (blogPostId && blogPostId.code === DEFAULT_STATUS_CODE_SUCCESS) {
          setBlogPostList(blogPostId.data);
        } else {
          toastError(blogPostId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
        }
      } else {
        toastError(LikeBlogPost.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      }
    }
  } catch (error: any) {
    toastError(error?.LikeBlogPost?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    return false;
  }
};

// This function is to be used in future versions
// export const fetchBlogsCategoryApiCall = async (
//   setLoading: TReactSetState<boolean>,
//   setBlogsCategoryList: TReactSetState<IBlogsCategory[]>,
//   setCid: TReactSetState<number | undefined>,
//   PCid?: number
// ) => {
//   try {
//     setLoading(true);
//     const blogCategoryList = await GET_ALL_BLOGS_CATEGORY();
//     if (
//       blogCategoryList &&
//       blogCategoryList.code === DEFAULT_STATUS_CODE_SUCCESS
//     ) {
//       if (blogCategoryList.data) {
//         setBlogsCategoryList(blogCategoryList.data.item);
//         if (blogCategoryList.data.item.length > 0) {
//           const foundCategory = blogCategoryList.data.item.find(
//             (category: IBlogsCategory) => category.id === PCid
//           );
//           if (foundCategory) {
//             setCid(PCid);
//           } else {
//             setCid(blogCategoryList.data.item[0].id);
//           }
//         }
//       } else {
//         setBlogsCategoryList([]);
//       }
//     } else {
//       toastError(blogCategoryList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
//     }
//   } catch (e: any) {
//     toastError(e?.blogCategoryList?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
//   } finally {
//     setLoading(false);
//   }
// };

export const fetchBlogsCategoryApiCall = async (
  setBlogsCategoryList: TReactSetState<IDDL[]>,
  setCid: TReactSetState<number | null>,
  PCid?: number
) => {
  try {
    const payload = {
      entity: "blog_category",
      data_value: "id",
      display_value: "category_title",
    };

    const blogCategoryList = await GLOBAL_DROP_DOWN(payload);

    if (
      blogCategoryList &&
      blogCategoryList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setBlogsCategoryList(blogCategoryList.data);
      if (blogCategoryList.data) {
        setBlogsCategoryList(blogCategoryList.data);
        if (blogCategoryList.data.length > 0) {
          const foundCategory = blogCategoryList.data.find(
            (category: IDDL) => category.data_value === PCid
          );
          if (foundCategory) {
            PCid && setCid(PCid);
          } else {
            setCid(blogCategoryList.data[0].id);
          }
        }
      } else {
        setBlogsCategoryList([]);
      }
    } else {
      toastError(blogCategoryList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.blogCategoryList?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
