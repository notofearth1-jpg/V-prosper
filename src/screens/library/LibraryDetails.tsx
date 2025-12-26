import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import LibraryOpenType from "./LibraryOpenType";
import { ILibrary, getLibraryContentById } from "./LibraryController";
import Loader from "../../components/common/Loader";
import { rupeeIcon } from "../../assets/icons/SvgIconList";
import { BIT_VALUE, IS_PREMIUM } from "../../utils/AppEnumerations";
import { decryptData } from "../../utils/AppFunctions";
import { localStorageUtils } from "../../utils/LocalStorageUtil";

const LibraryDetails = () => {
  let timer: NodeJS.Timeout;
  const location = useLocation();
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const [searchLoading, setSearchLoading] = useState(true);
  const userId = localStorageUtils.getUserId();
  const searchParams = new URLSearchParams(location.search);
  const paramsId = searchParams.get("id");
  const decryptParams = decryptData(paramsId ? paramsId.toString() : "");
  // Split the decrypted parameters hst and id from params
  const [parmasId, hasSubscripb, getUserId] = decryptParams.split("|");
  const id = location?.state?.id ? location?.state?.id : parmasId;
  const sp = location?.state?.sp || hasSubscripb ? true : false;

  useEffect(() => {
    setSearchLoading(true);
    fetchLibraryContentById(id);
  }, []);

  const fetchLibraryContentById = (id: number) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      getLibraryContentById(id, setLibraryList, setSearchLoading, sp);
    }, 500);
  };

  return (
    <div className="comman-padding flex flex-col h-svh md:h-[calc(100vh-76px)] overflow-hidden">
      <div className="mb-4 md:mb-0">
        <BackButton />
      </div>
      {searchLoading ? (
        <Loader />
      ) : (
        libraryList &&
        libraryList[0]?.is_premium && (
          <div className="flex-1 overflow-hidden flex justify-center">
            <div className="w-full max-w-xl bg-[#F9F9F9] p-2 border-library shadow-inner overflow-y-scroll remove-scrollbar-width">
              <div>
                <LibraryOpenType
                  libraryList={libraryList}
                  setLibraryList={setLibraryList}
                  itemArray={{
                    ...libraryList[0],
                    ...(hasSubscripb === "hst" &&
                      userId === getUserId && {
                        has_subscribed: BIT_VALUE.One,
                        is_fav: undefined,
                      }),
                  }}
                  childClass="w-full"
                  index={1}
                  videoControls={[
                    "play",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "fullscreen",
                    "play-large",
                  ]}
                  isDetail
                />
              </div>
              <div className="mt-2 flex justify-between ">
                <div className="!font-semibold text-xl w-full text-wrap comman-black-big">
                  {libraryList[0].title}
                </div>
                {libraryList[0].price &&
                  libraryList[0].is_premium === IS_PREMIUM.Yes && (
                    <div className="flex items-center justify-end w-full">
                      <div className="w-3 h-3.5">{rupeeIcon}</div>
                      <div className="flex">
                        {libraryList[0].discounted_price ? (
                          <>
                            <p className="ml-2 comman-black-big">
                              {`${libraryList[0].discounted_price}`}
                            </p>
                            <p className="ml-2 comman-grey line-through pt-0.5">
                              {`${libraryList[0].price}`}
                            </p>
                          </>
                        ) : (
                          <p className="mx-l comman-black-big">
                            {`${libraryList[0].price}`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
              {libraryList[0].content_tags && (
                <div className="inline-flex w-full flex-wrap top">
                  {libraryList[0].content_tags.map((value, index) => (
                    <div
                      className="comman-grey inline-flex w-fit text-nowrap items-center bread-crumb-border text-skin-library-tags-box text-sm font-medium rounded-full px-3 py-1 mr-2 mb-2"
                      key={index}
                    >
                      {`#${value}`}
                    </div>
                  ))}
                </div>
              )}

              <div className="comman-grey text-justify">
                {libraryList[0].description}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LibraryDetails;
