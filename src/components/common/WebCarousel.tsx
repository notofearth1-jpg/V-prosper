import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@material-ui/core";
interface ICarouselItem {
  imageUrl: string;
}
interface ICarouselProps {
  items: ICarouselItem[];
}
interface ICustomCarouselProps extends ICarouselProps {
  animation?: "slide" | "fade";
  timeout?: number;
  indicators?: boolean;
  navButtonsAlwaysInvisible?: boolean;
}
const WebCarousel: React.FC<ICustomCarouselProps> = ({
  items,
  animation = "slide",
  timeout = 1500,
  indicators = false,
  navButtonsAlwaysInvisible = true,
}) => {
  const carouselSettings = {
    animation,
    timeout,
    indicators,
    navButtonsAlwaysInvisible,
  };
  return (
    <Carousel animation="slide" autoPlay={false}>
      {items.map((item, index) => (
        <Paper key={index}>
          <img
            className=""
            src={item.imageUrl}
            alt={`carousel-item-${index}`}
            style={{ width: "100%", height: "350px" }}
          />
        </Paper>
      ))}
    </Carousel>
  );
};
export default WebCarousel;
