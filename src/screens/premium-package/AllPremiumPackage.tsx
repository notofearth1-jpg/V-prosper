import React, { useEffect, useRef, useState } from "react";
import {
  IPremiumPackageList,
  fetchAllPremiumPackages,
} from "./PremiumPackagesController";
import BackButton from "../../components/common/BackButton";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { IPagination } from "../../data/AppInterface";
import VerticalBuffer from "../../components/common/VerticalBuffer";
import PremiumPackageSkeleton from "./premium-package-skeleton/PremiumPackageSkeleton";
import PremiumPackageCommonComponent from "./PremiumPackageCommonComponent";
import { TReactSetState, TScrollEvent } from "../../data/AppType";
const AllPremiumPackage = () => {
  let timer: NodeJS.Timeout;
  const listInnerRef = useRef<HTMLDivElement>(null);
  const { t } = UseTranslationHook();
  const [premiumPackageList, setPremiumPackageList] = useState<
    IPremiumPackageList[]
  >([]);
  const [bufferLoading, setBufferLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Fifty),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });

  useEffect(() => {
    fetchPremiumPackage(false, pagination, setLoading);
  }, []);

  const fetchPremiumPackage = (
    append: boolean,
    paginationPayload: IPagination,
    setLoading: TReactSetState<boolean>
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      setLoading(true);
      await fetchAllPremiumPackages(
        append,
        setLoading,
        paginationPayload,
        setPagination,
        premiumPackageList,
        setPremiumPackageList
      );
      setLoading(false);
    }, 500);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;
      if (
        isNearBottom &&
        premiumPackageList &&
        pagination.total_count > premiumPackageList.length
      ) {
        fetchPremiumPackage(
          true,
          {
            ...pagination,
            current_page: pagination.current_page + 1,
          },
          setBufferLoading
        );
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

  return (
    <div className="container mx-auto comman-padding overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
      <div className="flex justify-center ">
        <BackButton />
        <h1 className="w-full ml-6 flex items-center comman-black-big !text-[18px]">
          {t("premium_package")}
        </h1>
      </div>

      <>
        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-scroll top"
          ref={listInnerRef}
        >
          {loading
            ? [...Array(8)].map((_, index) => (
                <PremiumPackageSkeleton key={index} />
              ))
            : premiumPackageList &&
              premiumPackageList.length > 0 &&
              premiumPackageList.map((val, index) => (
                <div key={index} className="flex justify-center items-center">
                  <PremiumPackageCommonComponent
                    index={index}
                    value={val}
                    premiumPackageList={premiumPackageList}
                    setPremiumPackageList={setPremiumPackageList}
                  />
                </div>
              ))}
        </div>
        {bufferLoading && (
          <div className="flex justify-center items-center">
            <VerticalBuffer />
          </div>
        )}
      </>
    </div>
  );
};

export default AllPremiumPackage;
