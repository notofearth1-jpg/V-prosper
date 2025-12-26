import React, { FC } from "react";
import { Navigate, NavigateFunction, useNavigate } from "react-router-dom";
import { exitArrow } from "../../assets/icons/SvgIconList";
interface IBackButtonProps {
  containerClassName?: string;
}
const BackButton: FC<IBackButtonProps> = ({ containerClassName }) => {
  const navigation = useNavigate();

  const navigateBack = (navigate: NavigateFunction, url: number) => {
    navigate(url);
  };

  return (
    <div
      className={`w-7 cursor-pointer ${containerClassName}`}
      onClick={() => navigateBack(navigation, -1)}
    >
      {exitArrow}
    </div>
  );
};

export default BackButton;
