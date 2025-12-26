import React, { useEffect, useRef, useState } from "react";
import "react-responsive-modal/styles.css";
import "plyr/dist/plyr.css";
import { ILibrary, getAllLibraryItems } from "./LibraryController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import MobileHeader from "../header/MobileHeader";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/common/BottomNavbar";
import {
  LIBRARY_VIEW_TYPE,
  USER_ROLE,
  VIEW_TYPE,
} from "../../utils/AppEnumerations";
import { userRoute } from "../../routes/RouteUser";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import PremiumPackagesView from "../premium-package/PremiumPackagesView";
import TrainerBottomNavbar from "../header/TrainerBottomNavbar";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import HorizontalScrollRoundedCardSkeleton from "../../components/common/skeletons/HorizontalScrollRoundedCardSkeleton";
import LibraryOpenType from "./LibraryOpenType";
import { TReactSetState } from "../../data/AppType";
import { rightArrowIcon } from "../../assets/icons/SvgIconList";
import ScrollActionBtn from "../../components/common/ScrollActionBtn";
import NoData from "../../components/common/NoData";

const LibraryWeb = () => {
  let timer: NodeJS.Timeout;
  const containerRefDiscover = useRef<HTMLDivElement>(null);
  const containerRefTrending = useRef<HTMLDivElement>(null);
  const containerRefOther = useRef<HTMLDivElement>(null);
  const { isMobile } = UseMobileLayoutHook();
  const { t } = UseTranslationHook();
  const [libraryListOther, setLibraryListOther] = useState<ILibrary[]>([]);
  const [libraryListTrend, setLibraryListTrend] = useState<ILibrary[]>([]);
  const [libraryListDiscover, setLibraryListDiscover] = useState<ILibrary[]>(
    []
  );
  const [otherLoading, setOtherLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const userRole = Number(localStorageUtils.getRole());
  const navigate = useNavigate();
  const SA = false;

  useEffect(() => {
    fetchLibraryList();
  }, []);

  const fetchLibraryList = async () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await getAllLibraryItems(
        setDiscoverLoading,
        setLibraryListDiscover,
        SA,
        LIBRARY_VIEW_TYPE.Discover
      );
      await getAllLibraryItems(
        setTrendLoading,
        setLibraryListTrend,
        SA,
        LIBRARY_VIEW_TYPE.Trending
      );
      await getAllLibraryItems(
        setOtherLoading,
        setLibraryListOther,
        SA,
        LIBRARY_VIEW_TYPE.Other
      );
    }, 500);
  };

  const libraryCardList = (
    id: string,
    libraryList: ILibrary[],
    setLibraryList: TReactSetState<ILibrary[]>,
    title: string,
    leftArrowId: string,
    rightArrowId: string,
    ref: React.RefObject<HTMLDivElement>,
    onClickNavigate: () => void
  ) => (
    <div className="p-0 sm:p-5">
      <div className="grid grid-cols-2 my-3">
        <div className="col-span-1 comman-black-lg flex items-center">
          {title}
        </div>
        {libraryList.length > 0 && (
          <div className="col-span-1 space-x-3 flex justify-end">
            <div
              className="flex space-x-2 cursor "
              onClick={() => onClickNavigate()}
            >
              <p className="comman-black-text pt-1.5 link-color">
                {t("view_all")}
              </p>
              <div className="h-1 w-5 mt-1.5 link-color">{rightArrowIcon}</div>
            </div>
            {!isMobile && (
              <ScrollActionBtn
                Ref={ref}
                scrollLength={308}
                leftArrowId={leftArrowId}
                rightArrowId={rightArrowId}
              />
            )}
          </div>
        )}
      </div>

      <div
        className="flex overflow-x-scroll scrolling-space remove-scrollbar-width"
        id={id}
        ref={ref}
      >
        <>
          {libraryList.length > 0 ? (
            libraryList.map((item, index) => (
              <div key={index} className="flex-shrink-0 overflow-hidden mr-5">
                <LibraryOpenType
                  libraryList={libraryList}
                  setLibraryList={setLibraryList}
                  itemArray={item}
                  childClass="h-40"
                  index={index}
                  videoControls={[
                    "play",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "fullscreen",
                    "play-large",
                  ]}
                />
              </div>
            ))
          ) : (
            <NoData title={t("library_item")} height={125} width={125} />
          )}
        </>
      </div>
    </div>
  );

  const handleNavigate = (heading: string) => {
    navigate(
      userRole === USER_ROLE.Customer
        ? userRoute.libraryAll
        : userRole === USER_ROLE.Trainer && routeTrainer.libraryAll,
      {
        state: {
          heading: heading,
          type: heading,
        },
      }
    );
  };
  const handleNavigateDiscover = () => {
    handleNavigate(VIEW_TYPE.Discover);
  };
  const handleNavigateTrend = () => {
    handleNavigate(VIEW_TYPE.Trending);
  };
  const handleNavigateOther = () => {
    handleNavigate(VIEW_TYPE.Other);
  };
  return (
    <>
      <div className={`${isMobile ? "comman-padding  main-bg " : ""}`}>
        <MobileHeader />
        <div className="container mx-auto mb-20 md:mb-0">
          <PremiumPackagesView />

          {discoverLoading ? (
            <div className="top">
              <HorizontalScrollRoundedCardSkeleton width={286} height={156} />
            </div>
          ) : (
            libraryListDiscover &&
            libraryCardList(
              "discoverLib",
              libraryListDiscover,
              setLibraryListDiscover,
              t("discover"),
              "left-arrow-discover",
              "right-arrow-discover",
              containerRefDiscover,
              handleNavigateDiscover
            )
          )}

          {trendLoading ? (
            <div className="top">
              <HorizontalScrollRoundedCardSkeleton width={286} height={156} />
            </div>
          ) : (
            libraryListTrend &&
            libraryCardList(
              "trendLib",
              libraryListTrend,
              setLibraryListTrend,
              t("trending"),
              "left-arrow-trending",
              "right-arrow-trending",
              containerRefTrending,
              handleNavigateTrend
            )
          )}

          {otherLoading ? (
            <div className="top">
              {" "}
              <HorizontalScrollRoundedCardSkeleton width={286} height={156} />
            </div>
          ) : (
            libraryListOther &&
            libraryCardList(
              "otherLib",
              libraryListOther,
              setLibraryListOther,
              t("other"),
              "left-arrow-other",
              "right-arrow-other",
              containerRefOther,
              handleNavigateOther
            )
          )}
        </div>
      </div>
      {userRole === USER_ROLE.Customer ? (
        <BottomNavbar libraryActive />
      ) : (
        <TrainerBottomNavbar libraryActive />
      )}
    </>
  );
};

export default LibraryWeb;
