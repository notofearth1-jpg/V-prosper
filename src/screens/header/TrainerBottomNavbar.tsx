import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigationApp } from "../../utils/AppFunctions";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import { routeTrainer } from "../../routes/RouteTrainer";
import {
  activeHomeIcon,
  activeTaskIcon,
  communityActiveIcon,
  communityIcon,
  homeIcon,
  libraryActiveIcon,
  libraryIcon,
  taskIcon,
} from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";

interface BottomNavbarProps {
  homeActive?: boolean;
  taskActive?: boolean;
  communityActive?: boolean;
  libraryActive?: boolean;
}

const TrainerBottomNavbar: React.FC<BottomNavbarProps> = ({
  homeActive,
  taskActive,
  communityActive,
  libraryActive,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollPos = window.pageYOffset;
  //     const isScrollingDown = prevScrollPos < currentScrollPos;

  //     setIsVisible(!isScrollingDown || currentScrollPos < 10);
  //     setPrevScrollPos(currentScrollPos);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [prevScrollPos]);

  const navbarClasses = `fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-between p-4 bottom-navbar transition-transform ${
    isVisible ? "transform-translate-y-0" : "transform-translate-y-full"
  }`;

  const navigate = useNavigate();
  const { isMobile } = UseMobileLayoutHook();
  const { t } = UseTranslationHook();

  return (
    <>
      {isMobile && (
        <div className={navbarClasses}>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(routeTrainer.trainerHome)}
          >
            <div className="svg-color w-7 h-7">
              {homeActive ? activeHomeIcon : homeIcon}
            </div>
            <p className="comman-black-text">{t("home")}</p>
          </div>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(routeTrainer.trainerTask)}
          >
            <div className="svg-color w-7 h-7">
              {taskActive ? activeTaskIcon : taskIcon}
            </div>
            <p className="comman-black-text">{t("my_task")}</p>
          </div>

          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(routeTrainer.community)}
          >
            <div className="svg-color w-7 h-7">
              {communityActive ? communityActiveIcon : communityIcon}
            </div>

            <p className="comman-black-text">{t("community")}</p>
          </div>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(routeTrainer.library)}
          >
            <div className="svg-color w-7 h-7">
              {libraryActive ? libraryActiveIcon : libraryIcon}
            </div>
            <p className="comman-black-text">{t("library")}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerBottomNavbar;
