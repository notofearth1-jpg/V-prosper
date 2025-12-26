import React, { useEffect, useState } from "react";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../utils/AppConstants";
import { GET_PUBLIC_PRESIGNED_URL } from "../services/user/UserServices";
import { encryptData } from "../utils/AppFunctions";

type TICPureImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  imageUrl?: string;
  fallbackSrc?: string;
  wrapperClassName?: string;
  showLoading?: boolean;
};

const ICPureImage: React.FC<TICPureImageProps> = ({
  imageUrl,
  src,
  wrapperClassName,
  className,
  alt,
  showLoading = true,
  ...rest
}) => {
  const [imageSrcUrl, setImageSrcUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(
    src || !showLoading ? false : true
  );

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (imageUrl) {
          const resImage = await GET_PUBLIC_PRESIGNED_URL(
            encryptData(imageUrl)
          );
          if (resImage?.code === DEFAULT_STATUS_CODE_SUCCESS) {
            setImageSrcUrl(resImage.data);
          }
        } else {
          setImageSrcUrl(undefined);
        }
      } catch (error) {
        setImageSrcUrl(undefined);
      } finally {
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageSrcUrl(require("../assets/image/no-image.svg").default);
  };

  return src ? (
    <img
      src={src}
      className={`${className ? className : ""}`}
      alt={alt}
      {...rest}
    />
  ) : (
    <div className={`relative ${wrapperClassName ? wrapperClassName : ""}`}>
      {imageSrcUrl && (
        <img
          src={imageSrcUrl}
          className={`${isLoading ? "hidden" : "img-load-zoom-out"} ${
            className ? className : ""
          }`}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...rest}
        />
      )}
      {isLoading && (
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
          <div>
            <div className={`img-loader-test`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ICPureImage;
