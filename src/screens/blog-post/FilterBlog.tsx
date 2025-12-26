import React, { forwardRef, useEffect, useState } from "react";
import { filterIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { IBlog, IDDL } from "./BlogPostController";
import { TReactSetState } from "../../data/AppType";

const FilterBlog = forwardRef<
  HTMLDivElement,
  {
    showPopover: boolean;
    togglePopover: () => void;
    commanRef: React.RefObject<HTMLDivElement>;
    blogCategory: IDDL[];
    cid: number | null;
    setCid?: TReactSetState<number | null>;

    setBlogPostList?: TReactSetState<IBlog[]>;
  }
>(
  ({
    showPopover,
    togglePopover,
    commanRef,
    blogCategory,
    cid,
    setCid,
    setBlogPostList,
  }) => {
    const { t } = UseTranslationHook();
    const handleCategoryClick = (id: number) => {
      sessionStorage.setItem("cid", id.toString());
      setCid && setCid(id);
      togglePopover();
    };
    const clearFilter = () => {
      if (cid !== null) {
        sessionStorage.removeItem("cid");
        setCid && setCid(null);
        setBlogPostList && setBlogPostList([]);
        togglePopover();
      }
    };

    return (
      <div className="inline-block text-left">
        <button
          type="button"
          onClick={togglePopover}
          className="rounded-full focus:outline-none cursor"
          id="bell-ic"
        >
          <div className="w-5 h-5 pt-0.5">{filterIcon}</div>
        </button>

        {showPopover && (
          <>
            <div className="triangle-for-filter right-[80px] top-16 sm:top-[63px] "></div>
            <div
              className="origin-top-right absolute  xl:right-5 right-1 mt-8  rounded-lg shadow-lg bg-skin-background p-2 w-[80%] sm:w-[28rem] z-40"
              ref={commanRef}
            >
              <h1 className="text-xl comman-black-big">{t("filter_blogs")} </h1>
              <div className="grid grid-cols-2 gap-3 p-3 w-full max-h-[32rem] overflow-y-scroll">
                {blogCategory &&
                  blogCategory.map((item, index) => (
                    <div
                      key={index}
                      className={`w-full border-2 text-center comman-black-text p-2 rounded-lg cursor-pointer ${
                        cid === item.data_value
                          ? "comman-border bg-main-primary"
                          : "border-library"
                      }`}
                      onClick={() => {
                        handleCategoryClick(item.data_value);
                      }}
                    >
                      {item.display_value}
                    </div>
                  ))}
              </div>
              <div
                className="border-library border-2 p-2 text-center rounded-lg comman-black-text cursor-pointer"
                onClick={clearFilter}
              >
                {t("clear_filter")}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default FilterBlog;
