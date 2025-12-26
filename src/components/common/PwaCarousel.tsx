import React, { ReactNode } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MEDIA_TYPE } from "../../utils/AppEnumerations";
import VideoPlayer from "./VideoPlayer";
import ICImage from "../../core-component/ICImage";
import UseTranslationHook from "../../hooks/UseTranslationHook";
interface ICarouselProps {
  carouselItems: ICarouselItem[];
  arrows: boolean;
  autoPlaySpeed?: number;
  autoPlay: boolean;
  infinite: boolean;
  showDots?: boolean;
}
interface ICarouselItem {
  media_url: string;
  media_type: string;
}

const carouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 40000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 1,
  },
  smallWidthDesTop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const PwaCarousel: React.FC<ICarouselProps> = ({
  carouselItems,
  autoPlaySpeed,
  arrows,
  autoPlay,
  infinite,
  showDots = false,
}) => {
  const { t } = UseTranslationHook();
  return (
    <div className="h-full w-full">
      <Carousel
        autoPlay={autoPlay}
        autoPlaySpeed={autoPlaySpeed}
        infinite={infinite}
        arrows={arrows}
        responsive={carouselResponsive}
        showDots={showDots}
        pauseOnHover
      >
        {carouselItems && carouselItems.length > 0 ? (
          carouselItems
            .filter(
              (item) =>
                item.media_type === MEDIA_TYPE.video ||
                item.media_type === MEDIA_TYPE.image
            )
            .map((item, index) => (
              <div key={index} className="w-full aspect-16/9">
                {item.media_type === MEDIA_TYPE.video ? (
                  <div className="w-full aspect-16/9">
                    <VideoPlayer
                      control={[
                        "play",
                        "progress",
                        "current-time",
                        "mute",
                        "fullscreen",
                        "volume",
                        "play-large",
                      ]}
                      source={item.media_url}
                    />
                  </div>
                ) : (
                  <ICImage
                    imageUrl={item.media_url}
                    className=" w-full aspect-16/9 object-contain"
                    alt={`carousel-item-${index}`}
                    showOriginal={true}
                  />
                )}
              </div>
            ))
        ) : (
          <ICImage
            imageUrl={require("../../assets/image/no-image.svg").default}
            className=" w-full aspect-16/9 object-contain"
            alt={t("no_image")}
            showOriginal={true}
          />
        )}
      </Carousel>
    </div>
  );
};

export default PwaCarousel;
