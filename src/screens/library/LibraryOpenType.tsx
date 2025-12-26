import React, { useState } from "react";
import VideoPlayer from "../../components/common/VideoPlayer";
import {
  FILE_TYPE,
  FILE_TYPE_DIRECTORY,
  IS_FAV,
  IS_FAV_PAYLOAD,
  IS_PREMIUM,
  IS_SUBSCRIBED,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import {
  fillHeartIcon,
  flatHeartIcon,
  premiumIcon,
} from "../../assets/icons/SvgIconList";
import ICImage from "../../core-component/ICImage";
import PdfViewer from "../../components/common/PdfViewer";
import AudioPlayer from "../../components/common/AudioPlayer";
import ShrinkText from "../../components/common/ShrinkText";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { userRoute } from "../../routes/RouteUser";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addToFavorite,
  getLibraryContentById,
  getLibraryDirectoryById,
} from "./LibraryController";
import { TReactSetState } from "../../data/AppType";
import LibraryPayment from "./LibraryPayment";
import ImageViewer from "../../components/common/ImageViewer";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import { decryptData, encryptData } from "../../utils/AppFunctions";
import { useAddressContext } from "../../context/AddressContext";
import AddressModel from "../address/AddressModel";

interface ILibraryComponent {
  object_id: number;
  parent_directory_id?: number;
  file_type: string;
  title: string;
  description?: string;
  is_premium: string;
  duration?: number;
  file_path: string;
  is_fav?: string;
  cover_image_path: string;
  has_subscribed: string;
  price: string;
  discounted_price: string | null;
  transaction_charge: string | null;
  tax: string | null;
  root_directory_id: number;
}
interface ILibraryProps {
  itemArray: ILibraryComponent;
  childClass?: string;
  index: number;
  videoControls?: string[];
  libraryList?: ILibraryComponent[];
  setLibraryList?: TReactSetState<ILibraryComponent[]>;
  isDetail?: boolean;
  isSpecialPackage?: boolean;
}

const LibraryOpenType: React.FC<ILibraryProps> = ({
  itemArray,
  childClass,
  index,
  videoControls,
  libraryList,
  setLibraryList,
  isSpecialPackage = false,
  isDetail,
}) => {
  const userRole = Number(localStorageUtils.getRole());
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [libraryPackage, setLibraryPackage] = useState<ILibraryComponent[]>([]);
  const [showPremiumPackagePaymentModal, setShowPremiumPackagePaymentModal] =
    useState(false);
  const [openImgModal, setOpenImgModal] = useState<boolean>(false);
  const [openPdfModal, setOpenPdfModal] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<string>("");
  const [imgFile, setImgFile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] =
    useState<number>(-1);
  const [showAddressModel, setShowAddressModel] = useState(false);
  const { addressData } = useAddressContext();

  const handlePaymentBottomModal = async (item: ILibraryComponent) => {
    if (item.root_directory_id && item.root_directory_id > 1) {
      await getLibraryDirectoryById(item.root_directory_id, setLibraryPackage);
    } else if (item.file_type === FILE_TYPE.DIRECTORY) {
      await getLibraryDirectoryById(item.object_id, setLibraryPackage);
    } else {
      await getLibraryContentById(
        item.object_id,
        setLibraryPackage,
        setLoading,
        false
      );
    }

    setShowPremiumPackagePaymentModal(true);
  };

  const handleFavoritesLibrary = async (item: ILibraryComponent) => {
    const libraryFavoritePayload = {
      entity_type: 2,
      entity_id: item?.object_id,
      is_fav:
        item.is_fav == IS_FAV_PAYLOAD.isTrue
          ? IS_FAV_PAYLOAD.isFalse
          : IS_FAV_PAYLOAD.isTrue,
      is_directory:
        item.file_type === FILE_TYPE.DIRECTORY
          ? FILE_TYPE_DIRECTORY.DIRECTORY
          : null,
    };

    var isStatusChange = await addToFavorite(libraryFavoritePayload);
    if (isStatusChange) {
      const updatedLibraryList =
        libraryList &&
        libraryList.length > 0 &&
        libraryList.map((library) => {
          if (
            library.object_id === item.object_id &&
            library.file_type === item.file_type
          ) {
            return {
              ...library,
              is_fav:
                item.is_fav === IS_FAV.isTrue ? IS_FAV.isFalse : IS_FAV.isTrue,
            };
          }
          return library;
        });

      updatedLibraryList &&
        setLibraryList &&
        setLibraryList(updatedLibraryList);
    }
  };
  const location = useLocation();

  const userId = localStorageUtils.getUserId();
  const searchParams = new URLSearchParams(location.search);
  const paramsId = searchParams.get("id");
  const decryptParams = decryptData(paramsId ? paramsId.toString() : "");
  // Split the decrypted parameters hst and id from params
  const [parmasId, hasSubscripb, getUserId, rootId] = decryptParams.split("|");

  const openPdfModalHandler = (pdfFilePath: string, pdfId: number) => {
    if (isDetail) {
      setPdfFile(pdfFilePath);
      setOpenPdfModal(true);
    } else {
      if (hasSubscripb === "hst" && getUserId === userId) {
        const encryptedId = encryptData(
          pdfId.toString() + "|hst" + `|${userId}`
        );
        const url = `${
          userRole === USER_ROLE.Trainer
            ? routeTrainer.libraryDetails
            : userRoute.libraryDetails
        }?id=${encryptedId}`;

        navigate(url);
      } else {
        navigate(
          userRole === USER_ROLE.Trainer
            ? routeTrainer.libraryDetails
            : userRoute.libraryDetails,
          { state: { id: pdfId, sp: isSpecialPackage } }
        );
      }
    }
  };

  const openImgModalHandler = (imgFilePath: string, imgId: number) => {
    if (isDetail) {
      setImgFile(imgFilePath);
      setOpenImgModal(true);
    } else {
      if (hasSubscripb === "hst" && getUserId === userId) {
        const encryptedId = encryptData(
          imgId.toString() + "|hst" + `|${userId}`
        );
        const url = `${
          userRole === USER_ROLE.Trainer
            ? routeTrainer.libraryDetails
            : userRoute.libraryDetails
        }?id=${encryptedId}`;
        navigate(url);
      } else {
        !isDetail &&
          navigate(
            userRole === USER_ROLE.Trainer
              ? routeTrainer.libraryDetails
              : userRoute.libraryDetails,
            { state: { id: imgId, sp: isSpecialPackage } }
          );
      }
    }
  };

  return (
    <div>
      <div
        className={`relative border-library overflow-hidden ${childClass} aspect-16/9`}
      >
        <>
          {itemArray?.file_type === FILE_TYPE.DIRECTORY && (
            <div
              className="aspect-16/9 cursor"
              onClick={() => {
                if (
                  !addressData &&
                  itemArray?.is_premium &&
                  itemArray.is_premium === IS_PREMIUM.Yes
                ) {
                  setShowAddressModel(true);
                  return;
                }
                if (
                  itemArray?.is_premium &&
                  itemArray.is_premium === IS_PREMIUM.Yes &&
                  itemArray.has_subscribed === IS_SUBSCRIBED.No
                ) {
                  handlePaymentBottomModal(itemArray);
                } else {
                  if (hasSubscripb === "hst" && getUserId === userId) {
                    const encryptedId = encryptData(
                      itemArray.object_id.toString() +
                        "|hst" +
                        `|${userId}` +
                        `|${rootId}`
                    );
                    const url = `${
                      userRole === USER_ROLE.Trainer
                        ? routeTrainer.folderDetail
                        : userRoute.folderDetail
                    }?id=${encryptedId}&heading=${encodeURIComponent(
                      itemArray.title
                    )}`;
                    navigate(url);
                  } else {
                    navigate(
                      userRole === USER_ROLE.Trainer
                        ? routeTrainer.folderDetail
                        : userRoute.folderDetail,
                      {
                        state: {
                          id: itemArray.object_id,
                          heading: itemArray.title,
                          sp: isSpecialPackage,
                        },
                      }
                    );
                  }
                }
              }}
            >
              <ICImage
                imageUrl={itemArray.cover_image_path}
                fallbackSrc={require("../../assets/image/Folder.jpg")}
                alt={itemArray.title}
                className={`${childClass} aspect-16/9 object-contain`}
                isPrivate={
                  itemArray?.is_premium === IS_PREMIUM.Yes ? true : false
                }
              />
            </div>
          )}
          {itemArray?.file_type === FILE_TYPE.PDF && (
            <>
              <div
                className="aspect-16/9 cursor"
                onClick={() => {
                  if (
                    !addressData &&
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes
                  ) {
                    setShowAddressModel(true);
                    return;
                  }

                  itemArray?.is_premium &&
                  itemArray?.is_premium === IS_PREMIUM.Yes &&
                  itemArray?.has_subscribed === IS_SUBSCRIBED.No
                    ? handlePaymentBottomModal(itemArray)
                    : openPdfModalHandler(
                        itemArray.file_path,
                        itemArray.object_id
                      );
                }}
              >
                <ICImage
                  className={`${childClass} aspect-16/9 object-contain`}
                  src={require("../../assets/image/pdf.png")}
                  alt={itemArray.title}
                />
              </div>
              {openPdfModal && (
                <PdfViewer
                  onClose={() => {
                    setOpenPdfModal(false);
                    setPdfFile("");
                  }}
                  pdfFile={pdfFile}
                  isPrivate={
                    itemArray?.is_premium === IS_PREMIUM.Yes ? true : false
                  }
                />
              )}
            </>
          )}
          {itemArray?.file_type === FILE_TYPE.IMAGE && (
            <>
              <div
                className="aspect-16/9 cursor"
                onClick={() => {
                  if (
                    !addressData &&
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes
                  ) {
                    setShowAddressModel(true);
                    return;
                  }

                  itemArray?.is_premium &&
                  itemArray?.is_premium === IS_PREMIUM.Yes &&
                  itemArray?.has_subscribed === IS_SUBSCRIBED.No
                    ? handlePaymentBottomModal(itemArray)
                    : openImgModalHandler(
                        itemArray.file_path,
                        itemArray.object_id
                      );
                }}
              >
                <ICImage
                  className={`${childClass} aspect-16/9 object-contain  ${
                    itemArray?.is_premium &&
                    itemArray?.is_premium === IS_PREMIUM.Yes &&
                    itemArray?.has_subscribed === IS_SUBSCRIBED.No &&
                    "blur-sm"
                  }`}
                  imageUrl={itemArray.file_path}
                  alt={itemArray.title}
                  isPrivate={
                    itemArray?.is_premium === IS_PREMIUM.Yes ? true : false
                  }
                  showOriginal={isDetail ? true : false}
                />
              </div>
              {openImgModal && (
                <ImageViewer
                  imageUrl={imgFile}
                  openImgModal={openImgModal}
                  setOpenImgModal={setOpenImgModal}
                  isPrivate={
                    itemArray?.is_premium === IS_PREMIUM.Yes ? true : false
                  }
                />
              )}
            </>
          )}
          {itemArray?.file_type === FILE_TYPE.AUDIO && (
            <>
              <div
                className={`${childClass}  aspect-16/9 cursor`}
                onClick={() => {
                  if (
                    !addressData &&
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes
                  ) {
                    setShowAddressModel(true);
                    return;
                  }

                  if (
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes &&
                    itemArray.has_subscribed === IS_SUBSCRIBED.No
                  ) {
                    handlePaymentBottomModal(itemArray);
                  } else {
                    if (!isDetail) {
                      if (hasSubscripb === "hst" && getUserId === userId) {
                        const encryptedId = encryptData(
                          itemArray.object_id.toString() + "|hst" + `|${userId}`
                        );
                        const url = `${
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.libraryDetails
                            : userRoute.libraryDetails
                        }?id=${encryptedId}`;
                        navigate(url);
                      } else {
                        navigate(
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.libraryDetails
                            : userRoute.libraryDetails,
                          {
                            state: {
                              id: itemArray.object_id,
                              sp: isSpecialPackage,
                            },
                          }
                        );
                      }
                    }
                  }
                }}
              >
                <AudioPlayer
                  isDetail={isDetail}
                  audioSrc={itemArray.file_path}
                  imgSrc={require("../../assets/image/musicplay.png")}
                  index={index}
                  currentlyPlayingIndex={
                    itemArray?.is_premium &&
                    itemArray?.is_premium === IS_PREMIUM.Yes &&
                    itemArray?.has_subscribed === IS_SUBSCRIBED.No
                      ? -1
                      : currentlyPlayingIndex
                  }
                  setCurrentlyPlayingIndex={setCurrentlyPlayingIndex}
                  isPrivate={
                    itemArray?.is_premium === IS_PREMIUM.Yes ? true : false
                  }
                />
              </div>
            </>
          )}
          {itemArray?.file_type === FILE_TYPE.VIDEO && (
            <>
              <div
                className={`!${childClass} !aspect-16/9  overflow-hidden cursor`}
                onClick={() => {
                  if (
                    !addressData &&
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes
                  ) {
                    setShowAddressModel(true);
                    return;
                  }

                  if (
                    itemArray?.is_premium &&
                    itemArray.is_premium === IS_PREMIUM.Yes &&
                    itemArray.has_subscribed === IS_SUBSCRIBED.No
                  ) {
                    handlePaymentBottomModal(itemArray);
                  } else {
                    if (!isDetail) {
                      if (hasSubscripb === "hst" && getUserId === userId) {
                        const encryptedId = encryptData(
                          itemArray.object_id.toString() + "|hst" + `|${userId}`
                        );
                        const url = `${
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.libraryDetails
                            : userRoute.libraryDetails
                        }?id=${encryptedId}`;
                        navigate(url);
                      } else {
                        navigate(
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.libraryDetails
                            : userRoute.libraryDetails,
                          {
                            state: {
                              id: itemArray.object_id,
                              sp: isSpecialPackage,
                            },
                          }
                        );
                      }
                    }
                  }
                }}
              >
                <VideoPlayer
                  control={
                    videoControls
                      ? videoControls
                      : [
                          "play",
                          "progress",
                          "current-time",
                          "mute",
                          "volume",
                          "fullscreen",
                          "play-large",
                        ]
                  }
                  isPremium={
                    itemArray?.is_premium &&
                    itemArray?.is_premium === IS_PREMIUM.Yes &&
                    itemArray?.has_subscribed === IS_SUBSCRIBED.No
                      ? true
                      : false
                  }
                  source={itemArray.file_path}
                  isPrivate={
                    isDetail && itemArray?.is_premium === IS_PREMIUM.Yes
                      ? true
                      : false
                  }
                />
              </div>
            </>
          )}
        </>
        <div>
          {itemArray.is_premium === IS_PREMIUM.Yes &&
          itemArray.has_subscribed === IS_SUBSCRIBED.Yes ? (
            <div className="!bg-transparent !shadow-none absolute top-2 left-2">
              <div className="text-subscribed text-skin-on-primary">
                {t("subscribed")}
              </div>
            </div>
          ) : (
            itemArray.is_premium === IS_PREMIUM.Yes &&
            itemArray.has_subscribed === IS_SUBSCRIBED.No && (
              <div className="favorites absolute top-1 left-1">
                <div className="h-6 w-6">{premiumIcon}</div>
              </div>
            )
          )}
        </div>
        {itemArray.is_fav && (
          <div className="favorites absolute top-1 right-1">
            {itemArray.is_fav === IS_FAV.isTrue ? (
              <div
                className="m-2 favorites-icon cursor"
                id="heart"
                onClick={(event) => {
                  event.stopPropagation();
                  handleFavoritesLibrary(itemArray);
                }}
              >
                {fillHeartIcon}
              </div>
            ) : (
              <div
                id="heart"
                className=" m-2 cursor favorites-icon cursor"
                onClick={(event) => {
                  event.stopPropagation();
                  handleFavoritesLibrary(itemArray);
                }}
              >
                {flatHeartIcon}
              </div>
            )}
          </div>
        )}
      </div>
      {!isDetail && (
        <div className="mt-[10px]">
          <ShrinkText text={itemArray.title} maxLength={17} />
        </div>
      )}
      {!isSpecialPackage &&
        libraryPackage &&
        libraryPackage.length > 0 &&
        showPremiumPackagePaymentModal && (
          <LibraryPayment
            libraryPackage={libraryPackage[0]}
            libraryList={libraryList}
            setLibraryList={setLibraryList}
            showPremiumPackagePaymentModal={showPremiumPackagePaymentModal}
            setShowPremiumPackagePaymentModal={
              setShowPremiumPackagePaymentModal
            }
          />
        )}

      {showAddressModel && (
        <AddressModel
          modelOpen={showAddressModel}
          setModelOpen={setShowAddressModel}
        />
      )}
    </div>
  );
};

export default LibraryOpenType;
