import React from "react";
import { scrollLeft, scrollRight } from "../../utils/AppFunctions";
import { leftArrow, leftArrowIcon } from "../../assets/icons/SvgIconList";

interface IScrollActionBtn {
  Ref: React.RefObject<HTMLDivElement>;
  scrollLength: number;
  leftArrowId: string;
  rightArrowId: string;
}

const ScrollActionBtn: React.FC<IScrollActionBtn> = ({
  Ref,
  scrollLength,
  leftArrowId,
  rightArrowId,
}) => {
  return (
    <div className="flex justify-end items-center cursor">
      <div
        id={leftArrowId}
        className="border p-2 px-3 flex justify-center background-green text-white rounded-l-2xl cursor"
        onClick={() => scrollLeft(Ref, scrollLength)}
      >
        <div className="h-3 w-3">{leftArrow}</div>
      </div>
      <div
        id={rightArrowId}
        className="border p-2 px-3 flex justify-center background-green text-white rounded-r-2xl cursor"
        onClick={() => scrollRight(Ref, scrollLength)}
      >
        <div className="h-3 w-3">{leftArrowIcon}</div>
      </div>
    </div>
  );
};

export default ScrollActionBtn;
