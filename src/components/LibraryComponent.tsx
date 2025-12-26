import React, { useEffect, useState } from "react";
import {
  ILibrary,
  fetchLibraryById,
  getAllLibraryItems,
} from "../screens/library/LibraryController";
import BackButton from "./common/BackButton";

import { useLocation } from "react-router-dom";
import UseTranslationHook from "../hooks/UseTranslationHook";
import { VIEW_TYPE } from "../utils/AppEnumerations";
import CardListPageSkeleton from "./common/skeletons/CardListPageSkeleton";
import { LIBRARY_VIEW_TYPE } from "../utils/AppEnumerations";
import LibraryOpenType from "../screens/library/LibraryOpenType";

const LibraryComponent = () => {
  const { t } = UseTranslationHook();
  const location = useLocation();
  const heading = location?.state?.heading;
  const SA = true;
  const viewHeading = location?.state?.type;
  const viewType =
    viewHeading === VIEW_TYPE.Trending
      ? LIBRARY_VIEW_TYPE.Trending
      : viewHeading === VIEW_TYPE.Discover
      ? LIBRARY_VIEW_TYPE.Discover
      : LIBRARY_VIEW_TYPE.Other;
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllLibraryItems(setLoading, setLibraryList, SA, viewType);
  }, []);

  return (
    <div className="comman-padding overflow-hidden flex flex-col h-svh md:h-[calc(100vh-76px)]">
      <div className="flex justify-center pb-4">
        <BackButton />
        <h1 className="w-full ml-6 flex items-center comman-black-big">
          {t(heading)} ({libraryList.length})
        </h1>
      </div>

      {loading ? (
        <CardListPageSkeleton />
      ) : (
        <div className="overflow-auto remove-scrollbar-width flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {libraryList && libraryList.length > 0 ? (
              libraryList.map((item, index) => (
                <div key={index}>
                  <LibraryOpenType
                    libraryList={libraryList}
                    setLibraryList={setLibraryList}
                    itemArray={item}
                    childClass="w-full"
                    index={index}
                    videoControls={[
                      "progress",
                      "current-time",
                      "mute",

                      "fullscreen",
                      "play-large",
                    ]}
                  />
                </div>
              ))
            ) : (
              <p>{t("no_data")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryComponent;
