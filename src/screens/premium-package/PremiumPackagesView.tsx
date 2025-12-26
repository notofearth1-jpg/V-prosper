import React, { useEffect, useRef, useState } from "react";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  IPremiumPackageList,
  fetchAllPremiumPackages,
} from "./PremiumPackagesController";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../routes/RouteUser";
import { USER_ROLE } from "../../utils/AppEnumerations";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import PremiumPackageHomeSkeleton from "../header/home-page/home-page-skeleton/PremiumPackageHomeSkeleton";
import PremiumPackageCommonComponent from "./PremiumPackageCommonComponent";
import { rightArrowIcon } from "../../assets/icons/SvgIconList";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import ScrollActionBtn from "../../components/common/ScrollActionBtn";

const PremiumPackagesView = () => {
  let timer: NodeJS.Timeout;
  const premiumPackageRef = useRef<HTMLDivElement>(null);
  const userRole = Number(localStorageUtils.getRole());
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [premiumPackageList, setPremiumPackageList] = useState<
    IPremiumPackageList[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Ten),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });
  const { isMobile } = UseMobileLayoutHook();

  useEffect(() => {
    fetchPremiumPackage();
  }, []);

  const fetchPremiumPackage = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await fetchAllPremiumPackages(
        false,
        setLoading,
        pagination,
        setPagination,
        premiumPackageList,
        setPremiumPackageList
      );
    }, 500);
  };

  return (
    <>
      {loading ? (
        <div className="comman-padding ">
          <PremiumPackageHomeSkeleton />
        </div>
      ) : (
        premiumPackageList &&
        premiumPackageList.length > 0 && (
          <div className=" p-0 sm:px-5 ">
            <div>
              <div className="grid grid-cols-2 top">
                <div className="col-span-1 comman-black-big mt-1">
                  {t("premium_package")}
                </div>
                <div className="col-span-1 space-x-3 flex justify-end">
                  <div
                    className="flex space-x-2 cursor "
                    onClick={() =>
                      navigate(
                        userRole === USER_ROLE.Customer
                          ? userRoute.premiumPackages
                          : userRole === USER_ROLE.Trainer &&
                              routeTrainer.premiumPackages
                      )
                    }
                  >
                    <p className="comman-black-text pt-1.5 link-color">
                      {t("view_all")}
                    </p>
                    <div className="h-1 w-5 mt-1.5 link-color">
                      {rightArrowIcon}
                    </div>
                  </div>
                  {!isMobile && (
                    <ScrollActionBtn
                      Ref={premiumPackageRef}
                      scrollLength={300}
                      leftArrowId="left-arrowI-premium"
                      rightArrowId="right-arrowI-premium"
                    />
                  )}
                </div>
              </div>
            </div>

            <div
              className="flex overflow-x-scroll scrolling-space space-x-4 remove-scrollbar-width mt-[15px]"
              ref={premiumPackageRef}
            >
              <>
                {premiumPackageList &&
                  premiumPackageList.length > 0 &&
                  premiumPackageList.map((val, index) => (
                    <div key={index} className="flex-shrink-0">
                      <PremiumPackageCommonComponent
                        index={index}
                        value={val}
                        premiumPackageList={premiumPackageList}
                        setPremiumPackageList={setPremiumPackageList}
                      />
                    </div>
                  ))}
              </>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default PremiumPackagesView;
