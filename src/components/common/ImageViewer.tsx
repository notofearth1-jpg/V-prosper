import React, { useEffect, useState } from "react";
import { TReactSetState } from "../../data/AppType";
import { closeIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { GET_PRESIGNED_URL } from "../../services/user/UserServices";
import { encryptData } from "../../utils/AppFunctions";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../../utils/AppConstants";
import ICImage from "../../core-component/ICImage";

interface IImageViewerProps {
  imageUrl: string;
  openImgModal: boolean;
  setOpenImgModal: TReactSetState<boolean>;
  isPrivate?: boolean;
}

const ImageViewer: React.FC<IImageViewerProps> = ({
  imageUrl,
  openImgModal,
  setOpenImgModal,
  isPrivate = false,
}) => {
  const { t } = UseTranslationHook();
  const handleClose = () => setOpenImgModal(false);

  return (
    <div>
      {openImgModal && (
        <div
          className="cursor fixed inset-0 flex items-center justify-center bg-black z-[999]"
          onClick={handleClose}
          aria-hidden={!openImgModal}
        >
          <div
            className="cursor relative w-full h-full p-4 flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ICImage
              imageUrl={imageUrl}
              alt={t("image")}
              className="max-w-full max-h-full object-contain"
              showOriginal={true}
              isPrivate
            />

            <div
              className="cursor absolute top-4 right-4 text-white text-3xl"
              onClick={handleClose}
            >
              <div className="h-5 w-5">{closeIcon}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
