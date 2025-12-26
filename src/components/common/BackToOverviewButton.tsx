import React from "react";
import { leftArrow } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";

interface BackToOverviewButtonProps {
  onClick: () => void;
}

const BackToOverviewButton: React.FC<BackToOverviewButtonProps> = ({
  onClick,
}) => {
  const backOverview = () => {
    onClick();
  };
  const { t } = UseTranslationHook();

  return (
    <div
      className="flex items-center overview-back cursor"
      onClick={backOverview}
    >
      <div className="w-4 h-4 grey-icon">{leftArrow}</div>
      <span>{t("overview")}</span>
    </div>
  );
};

export default BackToOverviewButton;
