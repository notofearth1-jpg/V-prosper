import React, { useEffect, useRef } from "react";
import { TReactSetState } from "../../../data/AppType";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import UseMobileLayoutHook from "../../../hooks/UseMobileLayoutHook";
import { userRoute } from "../../../routes/RouteUser";
import { exitArrow } from "../../../assets/icons/SvgIconList";

interface ITrainerWellness {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerWellness: React.FC<ITrainerWellness> = ({ setCurrentIndex }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = UseTranslationHook();

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(location.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const setNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    updateQueryStringParameter("s", 1);
  };

  const { isMobile } = UseMobileLayoutHook();

  const previous = () => {
    navigate(isMobile ? userRoute.profile : userRoute.home);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  return (
    <div className="flex justify-center w-full !bg-white h-svh">
      <div
        ref={mainBgRef}
        className={`${
          isFullHeight ? "h-screen" : "h-auto"
        }  flex flex-col justify-between w-full`}
      >
        <div
          className="absolute left-5 top-5 z-50 w-7 cursor-pointer"
          onClick={previous}
        >
          {exitArrow}
        </div>
        <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
          <div>
            <div className="h-full w-full relative inner-shadow">
              <ICImage
                src={require("../../../assets/image/welness.png")}
                scaled={false}
                className="rounded-lg h-full w-full max-h-screen"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div>
              <div>
                <div className="text-center top">
                  <p className="trainer-font">{t("welcome")}</p>
                  <p className="trainer-font">{t("wellness_warrior")}</p>
                </div>

                <div className="text-center top">
                  <p className="comman-SubFont">{t("lets_together_move")}</p>
                </div>
              </div>
              <div className="buttons top w-full flex flex-col sm:flex-row items-center justify-center">
                <ICButton
                  type="button"
                  className={`uppercase !bg-blue-600`}
                  onClick={setNext}
                >
                  {t("next")}
                </ICButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerWellness;
