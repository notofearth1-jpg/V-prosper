import React, { useEffect, useRef, useState } from "react";
import { IBlog, fetchMyBlogs } from "../BlogPostController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import BackButton from "../../../components/common/BackButton";
import { useNavigate } from "react-router-dom";
import { BLOG_DATA_PUBLISHED } from "../../../utils/AppEnumerations";
import { draftIcon } from "../../../assets/icons/SvgIconList";
import usePaginationHook from "../../../hooks/UsePaginationHook";
import VerticalBuffer from "../../../components/common/VerticalBuffer";
import ICImage from "../../../core-component/ICImage";

import { PAGINATION_PER_PAGE_ROWS } from "../../../utils/AppConstants";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { TScrollEvent } from "../../../data/AppType";
import NoData from "../../../components/common/NoData";

const MyPosts = () => {
  const [loading, setLoading] = useState(true);
  const [blogPostList, setBlogPostList] = useState<IBlog[]>([]);
  const [buffer, setBuffer] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "DESC",
    },
  });
  const { t } = UseTranslationHook();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const fetchBlog = () => {
    fetchMyBlogs(
      setBlogPostList,
      setLoading,
      setPagination,
      pagination,
      blogPostList,
      setBuffer
    );
  };
  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (
        isNearBottom &&
        blogPostList &&
        pagination.total_count > blogPostList.length
      ) {
        setPagination({ ...pagination, current_page: currentPage + 1 });
        setCurrentPage(currentPage + 1);
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
    fetchBlog();
  }, [currentPage]);

  return (
    <div className="comman-padding overflow-hidden h-screen md:h-[calc(100vh-76px)] flex flex-col">
      <div className="flex justify-center">
        <BackButton />
        <h1 className="w-full ml-6 flex items-center comman-black-big">
          {t("my_posts")}
        </h1>
      </div>
      {blogPostList && blogPostList.length > 0 ? (
        <div className="overflow-scroll flex-1">
          <div
            className="grid grid-cols-2 gap-3 xl:grid-cols-4 p-3 "
            ref={listInnerRef}
          >
            {blogPostList.map((item, index) => (
              <div
                key={index}
                className="relative cursor"
                onClick={() =>
                  navigate(routeTrainer.postDetail, {
                    state: { id: item.id },
                  })
                }
              >
                <div className="flex justify-center items-center">
                  {item.published == BLOG_DATA_PUBLISHED.isFalse && (
                    <div className="bg-skin-my-post-draft rounded-lg p-2 absolute">
                      <div className="flex">
                        <div className="w-6 h-6">{draftIcon}</div> {t("draft")}
                      </div>
                    </div>
                  )}
                  <ICImage
                    imageUrl={item.cover_image}
                    alt={item.blog_title}
                    className="h-40 xl:h-72 lg:w-full sm:w-40 rounded-lg"
                    scaled={false}
                  />
                </div>
                <div>
                  <p className="comman-black-text">{item.blog_title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoData title={t("post")} height={100} width={100} />
      )}

      {buffer && (
        <div className="flex justify-center items-center">
          <VerticalBuffer />
        </div>
      )}
    </div>
  );
};

export default MyPosts;
