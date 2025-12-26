import React, { useEffect, useRef, useState } from "react";
import BottomNavbar from "../../components/common/BottomNavbar";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  IBlog,
  IDDL,
  fetchBlogsApi,
  fetchBlogsCategoryApiCall,
  getRandomAnonymousUser,
  likeBlogPostById,
} from "./BlogPostController";
import CustomEditor from "../product-services/Web/CustomEditor";
import { useNavigate } from "react-router-dom";
import { getRelativeTime } from "../../utils/AppFunctions";
import {
  sendIcon,
  flatHeartIcon,
  fillHeartIcon,
} from "../../assets/icons/SvgIconList";
import {
  BLOG_DATA_PUBLISHED,
  BLOG_POST_ANONYMOUSLY,
  IS_ADMIN,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import { RWebShare } from "react-web-share";
import usePaginationHook from "../../hooks/UsePaginationHook";
import VerticalBuffer from "../../components/common/VerticalBuffer";
import { routeTrainer } from "../../routes/RouteTrainer";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { TScrollEvent } from "../../data/AppType";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import TrainerBottomNavbar from "../header/TrainerBottomNavbar";
import { userRoute } from "../../routes/RouteUser";
import BlogPostSkeleton from "./blog-post-skeleton/BlogPostSkeleton";
import ICImage from "../../core-component/ICImage";
import BlogSearch from "./BlogSearch";
import { IPagination } from "../../data/AppInterface";
import NoData from "../../components/common/NoData";
import { APP_HOST_URL } from "../../config/AppConfig";

interface IPostProps {
  trainerIdToken?: string;
  showTrainer?: boolean;
}
const Post: React.FC<IPostProps> = ({ trainerIdToken, showTrainer }) => {
  const navigate = useNavigate();
  let timer: NodeJS.Timeout;
  const blogCid = Number(sessionStorage.getItem("cid"));
  const blogSearchValue = sessionStorage.getItem("blogSearch");
  const { t } = UseTranslationHook();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [buffer, setBuffer] = useState(true);
  const [likeBuffer, setLikeBuffer] = useState(false);
  const [blogPostList, setBlogPostList] = useState<IBlog[]>([]);
  const [cid, setCid] = useState<number | null>(null);
  const [blogsCategoryList, setBlogsCategoryList] = useState<IDDL[]>([]);
  const [enterpriseSearch, setEnterpriseSearch] = useState(
    blogSearchValue ? blogSearchValue : ""
  );
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Five),
      current_page: 1,
      sort_by: "",
      order_by: "DESC",
    },
  });

  useEffect(() => {
    setLoading(true);
    if (cid || blogCid) {
      setCid(blogCid);
      fetchBlogList(
        { ...pagination, current_page: 1 },
        blogPostList,
        cid || blogCid,
        false
      );
    } else if (enterpriseSearch.length > 0) {
      fetchBlogList(
        { ...pagination, current_page: 1 },
        blogPostList,
        cid,
        false
      );
    } else {
      fetchBlogList(
        { ...pagination, current_page: 1 },
        blogPostList,
        cid,
        false
      );
    }
  }, [cid, enterpriseSearch.length]);

  const fetchBlogList = async (
    pagination: IPagination,
    blogPostList: IBlog[],
    categoryId: number | null,
    isAppend: boolean
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await fetchBlogsApi(
        isAppend,
        setBlogPostList,
        setLoading,
        setPagination,
        pagination,
        blogPostList,
        setBuffer,
        trainerIdToken,
        {
          enterpriseSearch,
        },
        categoryId
      );
    }, 500);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 1 >= scrollHeight;

      if (
        isNearBottom &&
        blogPostList &&
        blogPostList.length > 0 &&
        pagination.total_count > blogPostList.length
      ) {
        fetchBlogList(
          { ...pagination, current_page: pagination.current_page + 1 },
          blogPostList,
          cid,
          true
        );

        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener(
        "scroll",
        onScroll as unknown as EventListener
      );
      return () => {
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
      };
    }
  }, [pagination]);

  useEffect(() => {
    fetchBlogsCategoryApiCall(setBlogsCategoryList, setCid);
  }, []);

  const postLike = (id: number) => {
    likeBlogPostById(id, blogPostList, setBlogPostList, setLikeBuffer);
  };
  const userRole = Number(localStorageUtils.getRole());

  return (
    <>
      <div className="grid justify-items-center items-center w-full ">
        <div
          className={`w-full h-svh overflow-hidden flex flex-col pb-20 md:pb-0`}
        >
          {!showTrainer && (
            <BlogSearch
              blogCategory={blogsCategoryList}
              setCid={setCid}
              cid={cid}
              setBlogPostList={setBlogPostList}
              setEnterpriseSearch={setEnterpriseSearch}
              enterpriseSearch={enterpriseSearch}
            />
          )}
          <div
            className={`flex-1 w-full flex flex-col self-center overflow-y-scroll  ${
              showTrainer === true ? "" : "lg:w-1/2"
            }`}
            ref={listInnerRef}
          >
            {loading ? (
              <BlogPostSkeleton />
            ) : blogPostList && blogPostList.length > 0 ? (
              blogPostList
                .filter(
                  (value) => value.published === BLOG_DATA_PUBLISHED.isTrue
                )
                .map((value, index) => (
                  <>
                    <div key={index} className="mb-4 shadow-inner bg-[#F9F9F9]">
                      <div className="flex items-center m-3">
                        <div
                          className={`post-image rounded-full overflow-hidden p-1 ${
                            value.post_anonymously ===
                              BLOG_POST_ANONYMOUSLY.isFalse &&
                            value.is_admin !== IS_ADMIN.isFalse &&
                            "cursor"
                          }`}
                          onClick={() =>
                            value.post_anonymously ===
                              BLOG_POST_ANONYMOUSLY.isFalse &&
                            value.created_by_user !== USER_ROLE.SuperAdmin &&
                            navigate(
                              userRole === USER_ROLE.Customer
                                ? userRoute.trainerDetailsProfile
                                : routeTrainer.trainerDetailsProfile,
                              {
                                state: {
                                  trainerId: value.created_by_user,
                                },
                              }
                            )
                          }
                        >
                          {value.post_anonymously ===
                          BLOG_POST_ANONYMOUSLY.isTrue ? (
                            <ICImage
                              src={getRandomAnonymousUser().imageUrl}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : value.created_by_user === USER_ROLE.SuperAdmin ? (
                            <ICImage
                              src={require("../../assets/image/admin-logo.png")}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <ICImage
                              imageUrl={value.profile_url}
                              fallbackSrc={require("../../assets/image/avatar.png")}
                              className="w-full h-full object-cover rounded-full"
                            />
                          )}
                        </div>
                        <div className="comman-black-text mx-3">
                          {value.post_anonymously ===
                          BLOG_POST_ANONYMOUSLY.isTrue ? (
                            <p>{getRandomAnonymousUser().anonymous_user}</p>
                          ) : (
                            <p>{value.created_by}</p>
                          )}
                          <div>{getRelativeTime(value.publish_date)}</div>
                        </div>
                      </div>
                      <div
                        className="mt-6 cursor"
                        onClick={() =>
                          navigate(
                            userRole === USER_ROLE.Trainer
                              ? routeTrainer.postDetail
                              : userRole === USER_ROLE.Customer &&
                                  userRoute.postDetail,
                            {
                              state: { id: value.id, object: value },
                            }
                          )
                        }
                      >
                        <div className="w-full aspect-16/9">
                          {value &&
                            value.app_media &&
                            value.app_media.length > 0 && (
                              <ICImage
                                imageUrl={value.app_media[0].media_url}
                                className="w-full aspect-16/9 object-contain"
                              />
                            )}
                        </div>
                      </div>
                      <div className="flex m-3 items-center like-container">
                        {
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              if (!likeBuffer) {
                                postLike(value.id);
                              }
                            }}
                          >
                            {value?.blog_liked === "1" ? (
                              <div className="w-6 mr-2 h-6">
                                {fillHeartIcon}
                              </div>
                            ) : (
                              <div className="w-6 mr-2 h-6">
                                {flatHeartIcon}
                              </div>
                            )}
                          </div>
                        }
                        <RWebShare
                          data={{
                            text: t("insightful_post"),
                            url: `${APP_HOST_URL}`,
                            title: value?.blog_title,
                          }}
                        >
                          <div className="w-6 h-6 cursor-pointer mb-1">
                            {sendIcon}
                          </div>
                        </RWebShare>
                      </div>
                      <div className="comman-black-text m-2 text-justify">
                        <p className="mb-2">
                          {value.total_reviews} {t("likes")}
                        </p>
                        <div>
                          <CustomEditor
                            serviceDesc={
                              value.blog_content.length > 200
                                ? value.blog_content.slice(0, 200) + "..."
                                : value.blog_content
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))
            ) : (
              <NoData title={t("blog")} height={200} width={200} />
            )}
            {/* need to keep this code as will continue it in phase-2 */}
            {/* {!showTrainer && (
              <>
                {userRole === USER_ROLE.Trainer && (
                  <div className="add-icon fixed ">
                    <div
                      className="w-10 h-10 cursor-pointer"
                      onClick={() => navigate(routeTrainer.trainerAddPost)}
                    >
                      {addCertificateIcon}
                    </div>
                  </div>
                )}
              </>
            )} */}
          </div>
        </div>
        {buffer && (
          <div className="h-30 w-60 mb-16 flex justify-center items-center">
            <VerticalBuffer />
          </div>
        )}
        {userRole === USER_ROLE.Customer && !showTrainer ? (
          <BottomNavbar communityActive />
        ) : (
          !showTrainer && <TrainerBottomNavbar communityActive />
        )}
      </div>
    </>
  );
};

export default Post;
