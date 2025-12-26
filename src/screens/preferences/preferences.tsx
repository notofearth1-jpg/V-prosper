import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/common/BackButton";
import useFullHeightBackground from "../../components/common/useFullHeghtBackground";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { themeIcon } from "../../assets/icons/SvgIconList";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../routes/RouteUser";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { USER_ROLE } from "../../utils/AppEnumerations";
import { routeTrainer } from "../../routes/RouteTrainer";

const Preferences = () => {
  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const userRole = Number(localStorageUtils.getRole());
  return (
    <>
      <div
        ref={mainBgRef}
        className={`${isFullHeight ? "h-screen" : "h-auto"} comman-padding`}
      >
        <div className="flex items-center">
          <BackButton />
          <div className="comman-black-lg ml-3">{t("profile_preference")}</div>
        </div>

        <div
          className="flex items-center top cursor"
          onClick={() =>
            navigate(
              userRole === USER_ROLE.Customer
                ? userRoute.themePreference
                : USER_ROLE.Trainer && routeTrainer.themePreference
            )
          }
        >
          <div className="w-10 h-10 svg-color">{themeIcon}</div>
          <div className="flex flex-col  ml-5 message-border-bottom w-full">
            <div className="comman-black-big">{t("theme")}</div>
            <div className="comman-grey">{t("theme_discription")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preferences;
