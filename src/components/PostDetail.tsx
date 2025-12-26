import React, { useEffect, useState } from "react";
import {
  IBlog,
  deleteBlogPostById,
  fetchBlogPostById,
  likeBlogPostByIdForDetailPost,
} from "../screens/blog-post/BlogPostController";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "./common/BackButton";
import CustomEditor from "../screens/product-services/Web/CustomEditor";
import PwaCarousel from "./common/PwaCarousel";
import { RWebShare } from "react-web-share";
import {
  attachmentIcon,
  deleteIcon,
  draftIcon,
  editIcon,
  shareItemIcon,
  flatHeartIcon,
  fillHeartIcon,
} from "../assets/icons/SvgIconList";
import { getRelativeTime } from "../utils/AppFunctions";
import UseTranslationHook from "../hooks/UseTranslationHook";
import {
  BLOG_DATA_PUBLISHED,
  MEDIA_TYPE,
  USER_ROLE,
} from "../utils/AppEnumerations";
import PdfViewer from "./common/PdfViewer";
import { routeTrainer } from "../routes/RouteTrainer";
import { localStorageUtils } from "../utils/LocalStorageUtil";
import PostDetailSkeleton from "../screens/blog-post/blog-post-skeleton/PostDetailSkeleton";
import { APP_HOST_URL } from "../config/AppConfig";

const PostDetail = () => {
  const { t } = UseTranslationHook();
  const [postInfo, setPostInfo] = useState<IBlog>();
  const [loading, setLoading] = useState(true);
  const [openPdfModal, setOpenPdfModal] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<string>("");
  const location = useLocation();
  const objectId = location?.state?.id;
  const navigate = useNavigate();
  const openPdfModalHandler = (pdfFilePath: string) => {
    setPdfFile(pdfFilePath);
    setOpenPdfModal(true);
  };
  const closePdfModalHandler = () => {
    setOpenPdfModal(false);
  };
  useEffect(() => {
    fetchBlogPostById(setPostInfo, setLoading, t, objectId);
  }, []);
  const handleDeletePost = (id: number) => {
    deleteBlogPostById(id, navigate, t);
  };
  const postLike = (id: number) => {
    likeBlogPostByIdForDetailPost(id, setPostInfo);
  };
  const userRole = Number(localStorageUtils.getRole());
  const userId = Number(localStorageUtils.getUserId());

  return (
    <>
      <div className="flex flex-col overflow-hidden h-svh md:h-[calc(100vh-76px)] remove-scrollbar-width">
        <div className="flex justify-between items-center p-3 w-full">
          <div>
            <BackButton />
          </div>
          <div>
            <RWebShare
              data={{
                text: t("insightful_post"),
                url: `${APP_HOST_URL}`,
                title: postInfo?.blog_title,
              }}
            >
              <div className="w-5 h-5 cursor">{shareItemIcon}</div>
            </RWebShare>
          </div>
        </div>
        {loading ? (
          <PostDetailSkeleton />
        ) : (
          <div className="flex-1 overflow-y-scroll remove-scrollbar-width flex flex-col items-center">
            <div className="mt-2 relative w-full xl:w-1/2">
              {postInfo &&
                postInfo?.published === BLOG_DATA_PUBLISHED.isFalse && (
                  <div className="bg-skin-my-post-draft rounded-lg p-2 flex justify-end items-end absolute z-50">
                    <div className="flex">
                      <div className="w-6 h-6">{draftIcon}</div> {t("draft")}
                    </div>
                  </div>
                )}
              <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                  {postInfo && (
                    <PwaCarousel
                      carouselItems={postInfo.app_media}
                      autoPlaySpeed={4000}
                      autoPlay={postInfo.app_media.length > 1 ? true : false}
                      infinite={postInfo.app_media.length > 1 ? true : false}
                      arrows={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {userRole === USER_ROLE.Trainer &&
              postInfo &&
              postInfo?.created_by_user === userId && (
                <div className="flex w-full items-center p-2">
                  <div
                    className="flex items-center w-full cursor-pointer"
                    onClick={() =>
                      navigate(routeTrainer.trainerAddPost, {
                        state: { object: postInfo },
                      })
                    }
                  >
                    <div className="w-7 h-7 mr-3">{editIcon}</div>
                    <div>
                      <p className="comman-black-text">{t("edit_post")}</p>
                    </div>
                  </div>
                  <div
                    className="flex items-center w-full cursor-pointer"
                    onClick={() =>
                      postInfo?.id && handleDeletePost(postInfo?.id)
                    }
                  >
                    <div className="w-7 h-7 mr-3">{deleteIcon}</div>
                    <div className="comman-black-text">{t("delete_post")}</div>
                  </div>
                </div>
              )}
            <div className="p-4 w-full xl:w-1/2">
              <div className="flex items-center">
                <div className="flex mr-2 comman-black-big">
                  {postInfo?.blog_title}
                </div>
                <div
                  className="flex ml-2 cursor"
                  onClick={() => {
                    postInfo && postLike(postInfo.id);
                  }}
                >
                  {postInfo?.blog_liked === "1" ? (
                    <div className="w-6 mr-2 h-6">{fillHeartIcon}</div>
                  ) : (
                    <div className="w-6 mr-2 h-6">{flatHeartIcon}</div>
                  )}
                  <div className="comman-black-big">
                    {postInfo?.total_reviews}
                  </div>
                </div>
              </div>
              {postInfo && (
                <div className="comman-black-text">
                  {getRelativeTime(postInfo.publish_date)}
                </div>
              )}
              <div className="top flex-wrap flexc text-justify">
                <CustomEditor serviceDesc={postInfo?.blog_content} />
              </div>
              <div className="mt-3 flex flex-wrap text-justify">
                {postInfo &&
                  postInfo.blog_tags.map((tag, index) => (
                    <p key={index} className="mr-1 comman-black-text">
                      {tag}
                    </p>
                  ))}
              </div>
              <div className="w-full flex top">
                {postInfo &&
                  postInfo.app_media.length > 0 &&
                  postInfo?.app_media.map(
                    (item, index) =>
                      item?.media_type === MEDIA_TYPE.pdf && (
                        <>
                          <div key={index} className="w-7 h-5 flex">
                            {attachmentIcon}
                          </div>
                          <p
                            className="underline text-skin-post-detail cursor-pointer"
                            onClick={() => openPdfModalHandler(item?.media_url)}
                          >
                            {item.media_url}
                          </p>
                          {openPdfModal && (
                            <PdfViewer
                              onClose={closePdfModalHandler}
                              pdfFile={pdfFile}
                            />
                          )}
                        </>
                      )
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetail;
