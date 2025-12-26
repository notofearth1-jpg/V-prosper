import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRoute } from "../../routes/RouteUser";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  activeHomeIcon,
  communityActiveIcon,
  communityIcon,
  homeIcon,
  libraryActiveIcon,
  libraryIcon,
  serviceActiveIcon,
  servicesIcon,
} from "../../assets/icons/SvgIconList";

interface IBottomNavbarProps {
  homeActive?: boolean;
  serviceActive?: boolean;
  communityActive?: boolean;
  libraryActive?: boolean;
}

const BottomNavbar: React.FC<IBottomNavbarProps> = ({
  homeActive,
  serviceActive,
  communityActive,
  libraryActive,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { t } = UseTranslationHook();

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

  return (
    <>
      {isMobile && (
        <div className={navbarClasses}>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(userRoute.home)}
          >
            <div className="svg-color w-7 h-7">
              {homeActive ? activeHomeIcon : homeIcon}
            </div>
            <p className="comman-black-text">{t("home")}</p>
          </div>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(userRoute.services)}
          >
            <div className="svg-color w-7 h-7">
              {serviceActive ? serviceActiveIcon : servicesIcon}
            </div>
            <p className="comman-black-text">{t("offerings")}</p>
          </div>

          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => {
              sessionStorage.removeItem("cid");
              navigate(userRoute.community);
            }}
          >
            <div className="svg-color w-7 h-7">
              {communityActive ? communityActiveIcon : communityIcon}
            </div>

            <p className="comman-black-text">{t("community")}</p>
          </div>
          <div
            className="focus:outline-none flex flex-col items-center"
            onClick={() => navigate(userRoute.library)}
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

export default BottomNavbar;
