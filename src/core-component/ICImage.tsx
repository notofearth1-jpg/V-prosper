import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../utils/AppConstants";
import { GET_PRESIGNED_URL } from "../services/user/UserServices";
import { encryptData } from "../utils/AppFunctions";
import { APP_IMAGE_URL } from "../config/AppConfig";

type TICImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  imageUrl?: string;
  fallbackSrc?: string;
  loadingClassName?: string;
  height?: number;
  width?: number;
  scaled?: boolean;
  onClose?: () => void;
  fillColor?: string;
  isPrivate?: boolean;
  showOriginal?: boolean;
};

export const removeThumb = (url: string | undefined): string | undefined => {
  // Use a regular expression to replace 'thumb-' in the filename
  if (url) {
    return url.replace(/\/thumb-([^/]+)$/, "/$1");
  }
};

const ICImage: React.FC<TICImageProps> = ({
  imageUrl,
  fallbackSrc,
  className,
  loadingClassName,
  src,
  alt,
  height,
  width,
  scaled,
  onClose,
  fillColor,
  onLoad,
  isPrivate = false,
  showOriginal = false,
  ...rest
}) => {
  const [imageSrcUrl, setImageSrcUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [srcWidth, setSrcWidth] = useState(0);
  const [srcHeight, setSrcHeight] = useState(0);

  imageUrl = showOriginal ? removeThumb(imageUrl) : imageUrl;

  const handleImageLoad = (e: any) => {
    if (onLoad) {
      onLoad(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (imageUrl && isPrivate) {
          const resImage = await GET_PRESIGNED_URL(encryptData(imageUrl));
          if (resImage?.code === DEFAULT_STATUS_CODE_SUCCESS) {
            setImageSrcUrl(resImage.data);

            if (height && width) {
              const img = new Image();
              img.src = resImage.data;
              img.onload = () => {
                setOriginalWidth(img.width);
                setOriginalHeight(img.height);
              };
            }
          }
        } else {
          setImageSrcUrl(APP_IMAGE_URL + imageUrl);
        }
      } catch (error) {
        setImageSrcUrl(undefined);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl, height, width]);

  useEffect(() => {
    try {
      if (src) {
        if (height && width) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setSrcWidth(img.width);
            setSrcHeight(img.height);
          };
        }
      }
    } catch (error) {}
  }, [src, height, width]);
  // add new functionality for a noImage
  useEffect(() => {
    try {
      if (height && width) {
        const img = new Image();
        img.src =
          src || fallbackSrc || require("../assets/image/no-image.svg").default;
        img.onload = () => {
          setSrcWidth(img.width);
          setSrcHeight(img.height);
        };
      }
    } catch (error) {}
  }, [src, fallbackSrc, height, width]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    if (scaled && onClose) {
      onClose();
    }
  };

  const calculateAspectRatioFit = (
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  };

  const imageDimention = useMemo(() => {
    if (width && height) {
      const dimention = calculateAspectRatioFit(
        originalWidth,
        originalHeight,
        width,
        height
      );
      return dimention;
    }
    return { width: originalWidth, height: originalHeight };
  }, [originalWidth, originalHeight, width, height]);

  const srcImageDimention = useMemo(() => {
    if (width && height) {
      const dimention = calculateAspectRatioFit(
        srcWidth,
        srcHeight,
        width,
        height
      );
      return dimention;
    }
    return { width: srcWidth, height: srcHeight };
  }, [srcWidth, srcHeight, width, height]);

  return imageUrl ? (
    imageDimention.height && imageDimention.width ? (
      scaled ? (
        <div
          className="bg-skin-background fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[9999] "
          onClick={handleClose}
        >
          <img
            src={imageSrcUrl}
            alt={alt}
            className={`max-h-[90%] max-w-[90%] ${
              isLoading ? "hidden" : "img-load-zoom-out"
            }`}
            onError={() =>
              setImageSrcUrl(require("../assets/image/no-image.svg").default)
            }
            onLoad={handleImageLoad}
          />
          {isLoading && (
            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
              <div>
                <div className={`img-loader-test`} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{ width, height, backgroundColor: fillColor }}
          className="flex justify-center items-center relative"
        >
          <img
            src={imageSrcUrl}
            alt={alt}
            className={`${isLoading ? "hidden" : "img-load-zoom-out"} ${
              className ? className : ""
            }`}
            width={imageDimention.width}
            height={imageDimention.height}
            onLoad={handleImageLoad}
            {...rest}
          />
          {isLoading && (
            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
              <div>
                <div className={`img-loader-test`} />
              </div>
            </div>
          )}
        </div>
      )
    ) : (
      <div className="flex h-full w-full justify-center items-center relative">
        <img
          src={imageSrcUrl}
          alt={alt}
          className={`${isLoading ? "hidden" : "img-load-zoom-out"} ${
            className ? className : ""
          }`}
          width={imageDimention.width || width}
          height={imageDimention.height || height}
          onLoad={handleImageLoad}
          {...rest}
          onError={() =>
            setImageSrcUrl(
              src ||
                fallbackSrc ||
                require("../assets/image/no-image.svg").default
            )
          }
        />
        {isLoading && (
          <div
            className={`absolute top-0 left-0 h-full w-full flex justify-center items-center ${
              className ? className : ""
            }`}
          >
            <div>
              <div className={`img-loader-test`} />
            </div>
          </div>
        )}
      </div>
    )
  ) : (
    <div
      style={{ width, height, backgroundColor: fillColor }}
      className="flex h-full w-full  justify-center items-center relative"
    >
      <img
        {...rest}
        alt={alt}
        className={`${className ? className : ""} `}
        src={
          src || fallbackSrc || require("../assets/image/no-image.svg").default
        }
        width={srcImageDimention.width || width}
        height={srcImageDimention.height || height}
      />
    </div>
  );
};

export default ICImage;
