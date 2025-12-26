import React, { useEffect, useState } from "react";
import {
  ILibrary,
  ILibraryHierarchy,
  fetchLibraryById,
  getLibraryHierarchyById,
} from "../screens/library/LibraryController";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "./common/BackButton";
import UseTranslationHook from "../hooks/UseTranslationHook";
import LibraryOpenType from "../screens/library/LibraryOpenType";
import CardListPageSkeleton from "./common/skeletons/CardListPageSkeleton";
import { userRoute } from "../routes/RouteUser";
import { LIBRARY_VIEW_TYPE, USER_ROLE } from "../utils/AppEnumerations";
import { localStorageUtils } from "../utils/LocalStorageUtil";
import { routeTrainer } from "../routes/RouteTrainer";
import { decryptData, encryptData } from "../utils/AppFunctions";

const FolderDetail = () => {
  const userRole = Number(localStorageUtils.getRole());
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramsId = searchParams.get("id");
  const decryptParams = decryptData(paramsId ? paramsId.toString() : "");
  const [parmasId, hasSubscripb, userOriginId, rootId] =
    decryptParams.split("|");
  let objectId = location?.state?.id ? location?.state?.id : parmasId;
  const sp = location?.state?.sp || hasSubscripb ? true : false;
  const heading = location?.state?.heading;
  const [navigationPath, setNavigationPath] = useState<ILibraryHierarchy[]>([
    { id: objectId, title: heading },
  ]);

  const userId = localStorageUtils.getUserId();

  const getFilteredNavigationPath = (
    navigationPath: ILibraryHierarchy[],
    parmasId: string
  ): ILibraryHierarchy[] => {
    if (!parmasId) return navigationPath;

    const rootIndex = navigationPath.findIndex(
      (folder) => folder.id === Number(rootId)
    );

    if (rootIndex === -1) return navigationPath;

    const afterRoot = navigationPath.slice(rootIndex);

    return [{ id: 1, title: "Home" }, ...afterRoot];
  };

  const filteredNavigationPath = getFilteredNavigationPath(
    navigationPath,
    parmasId
  );

  useEffect(() => {
    getLibraryHierarchyById(setNavigationPath, objectId);
    fetchLibraryById(
      setLibraryList,
      setLoading,
      true,
      sp,
      LIBRARY_VIEW_TYPE.Other,
      objectId,
      parmasId ? true : false
    );
  }, [objectId]);

  const handleNavigate = (
    folderId: number,
    folderTitle: string,
    isHome: boolean
  ) => {
    const navigateUrl =
      userRole === USER_ROLE.Trainer ? routeTrainer.library : userRoute.library;

    const navigateFolderDetailUrl =
      userRole === USER_ROLE.Trainer
        ? routeTrainer.folderDetail
        : userRoute.folderDetail;

    if (isHome) {
      navigate(navigateUrl);
    } else {
      parmasId
        ? navigate(
            `${navigateFolderDetailUrl}?id=${encryptData(
              folderId.toString() + "|hst" + `|${userId}` + `|${rootId}`
            )}`,
            {
              state: {
                id: folderId,
                heading: folderTitle,
                sp: false,
              },
            }
          )
        : navigate(navigateFolderDetailUrl, {
            state: {
              id: folderId,
              heading: folderTitle,
              sp: false,
            },
          });
    }
  };

  const breadCrumb = ({}: {
    navigationPath: { id: number; title: string }[];
  }) => {
    return (
      <div className="my-3 flex items-center rounded-lg  overflow-hidden">
        <div className="overflow-auto flex">
          {filteredNavigationPath &&
            filteredNavigationPath.length > 0 &&
            filteredNavigationPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center rounded-lg">
                {folder.id > 1 && (
                  <span className="mx-2 text-gray-300">&gt;</span>
                )}
                {folder.title && (
                  <div
                    className={`flex text-nowrap items-center px-2 rounded-lg comman-black-text ${
                      filteredNavigationPath.length !== index + 1 &&
                      "cursor-pointer"
                    } !text-sm ${
                      filteredNavigationPath.length === index + 1
                        ? "bread-crumb-border"
                        : "border-library"
                    }`}
                    onClick={() =>
                      handleNavigate(folder.id, folder.title, folder.id === 1)
                    }
                  >
                    {folder.title}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="comman-padding overflow-hidden flex flex-col h-svh md:h-[calc(100vh-70px)]">
      <div className=" flex justify-center items-center">
        <BackButton />
        <h1 className="w-full ml-4 text-left comman-black-big">
          {t("library")}
        </h1>
      </div>
      {breadCrumb({ navigationPath })}
      {loading ? (
        <CardListPageSkeleton />
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
            {libraryList && libraryList.length > 0 ? (
              libraryList.map((item, index) => (
                <>
                  <div key={index}>
                    <LibraryOpenType
                      libraryList={libraryList}
                      setLibraryList={setLibraryList}
                      itemArray={{
                        ...item,
                        ...(hasSubscripb === "hst" && {
                          has_subscribed: "1",
                          is_fav: undefined,
                        }),
                      }}
                      childClass="w-full"
                      index={index}
                      videoControls={[
                        "progress",
                        "current-time",
                        "fullscreen",
                        "play-large",
                      ]}
                    />
                  </div>
                </>
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

export default FolderDetail;
