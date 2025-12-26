import React, { useEffect, useState, useRef } from "react";
import { searchIcon } from "../../assets/icons/SvgIconList";
import FilterBlog from "./FilterBlog";
import { IBlog, IDDL } from "./BlogPostController";
import { TReactSetState } from "../../data/AppType";
interface IBlogtest {
  blogCategory: IDDL[];
  setCid?: TReactSetState<number | null>;
  cid: number | null;
  enterpriseSearch: string;
  setBlogPostList?: TReactSetState<IBlog[]>;
  setEnterpriseSearch?: TReactSetState<string>;
}
const BlogSearch: React.FC<IBlogtest> = ({
  blogCategory,
  cid,
  setCid,
  setBlogPostList,
  setEnterpriseSearch,
  enterpriseSearch,
}) => {
  const [searchBarWidth, setSearchBarWidth] = useState(0);
  const searchbarContainerRef = useRef<HTMLDivElement>(null);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("blogSearch", enterpriseSearch);
  }, [enterpriseSearch]);

  useEffect(() => {
    const updateWidth = () => {
      if (searchbarContainerRef.current) {
        setSearchBarWidth(searchbarContainerRef.current.offsetWidth);
      }
    };

    updateWidth(); // Initial width update

    window.addEventListener("resize", updateWidth); // Update width on window resize

    return () => {
      window.removeEventListener("resize", updateWidth); // Cleanup event listener
    };
  }, []);
  const toggleNotificationPopover = () => {
    setShowNotificationPopover((prev) => !prev);
  };
  const commanRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleProfileOutsideClick = (event: any) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowNotificationPopover(false);
      }
    };
    document.addEventListener("mousedown", handleProfileOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleProfileOutsideClick);
    };
  }, [showNotificationPopover]);
  return (
    <>
      <div className="w-full p-2">
        <div
          className={`mr-5 mb-1 flex w-full items-center p-3 web-shadow`}
          ref={searchbarContainerRef}
        >
          <div className="w-6 h-6">{searchIcon}</div>
          <div
            className="w-full ml-5 mr-2 comman-grey flex items-center !text-[16px]"
            id="bell-ic"
          >
            <input
              className="w-full focus:outline-none !bg-white"
              type="search"
              placeholder="Search here"
              id="bell-ic"
              onChange={(event) =>
                setEnterpriseSearch && setEnterpriseSearch(event.target.value)
              }
              value={enterpriseSearch}
            />
          </div>
          <div ref={filterRef}>
            <FilterBlog
              showPopover={showNotificationPopover}
              togglePopover={toggleNotificationPopover}
              commanRef={commanRef}
              blogCategory={blogCategory}
              setCid={setCid}
              cid={cid}
              setBlogPostList={setBlogPostList}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSearch;
