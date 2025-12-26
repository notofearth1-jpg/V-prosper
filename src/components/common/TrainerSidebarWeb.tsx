import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  activeHomeIcon,
  activeTaskIcon,
  closeSideIcon,
  communityActiveIcon,
  communityIcon,
  homeIcon,
  libraryActiveIcon,
  libraryIcon,
  logOutIcon,
  sideIconLink,
  taskIcon,
} from "../../assets/icons/SvgIconList";
import { publicRoute } from "../../routes/RoutePublic";
import { routeTrainer } from "../../routes/RouteTrainer";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { useTrainerLocationContext } from "../../context/TrainerDefaultLocationContext";
import { fetchTrainerDefaultLocationsApi } from "../../screens/trainer-preferred-location/TrainerPreferredLocationController";
import { useAddressContext } from "../../context/AddressContext";

const TrainerSidebarWeb: React.FC = () => {
  const location = useLocation();
  const {
    trainerDefaultLocation,
    setTrainerDefaultLocation,
    clearLocationData,
  } = useTrainerLocationContext();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { clearAddressData } = useAddressContext();

  const activeTab = location.pathname;
  const navigate = useNavigate();

  const handleSidebarToggle = (): void => {
    setSidebarOpen((prev: any) => !prev);
  };

  useEffect(() => {
    const toggle: HTMLElement | null = document.querySelector(".toggle");

    if (toggle) toggle.addEventListener("click", handleSidebarToggle);

    return () => {
      if (toggle) toggle.removeEventListener("click", handleSidebarToggle);
    };
  }, []);

  const { isMobile } = UseMobileLayoutHook();
  const { t } = UseTranslationHook();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearAddressData();
    clearLocationData();
    navigate("/" + publicRoute.login);
  };

  useEffect(() => {
    if (!trainerDefaultLocation) {
      fetchTrainerDefaultLocationsApi(setTrainerDefaultLocation);
    }
  }, []);

  return (
    <div className="position-relative ">
      <div
        className="mobile-toggle z-index cursor"
        onClick={handleSidebarToggle}
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav
        className={`sidebar border-r-2 ${
          sidebarOpen ? "sidebar-open" : isMobile ? `` : "close"
        }`}
      >
        <header>
          <div className="">
            <span className="image">
              <img src={require("../../assets/image/VP.png")} alt="logo" />
            </span>
          </div>

          <div className="svg-color ">
            <div className="w-5 h-5 toggle services-bg cursor">
              {" "}
              {sideIconLink}
            </div>
          </div>
          <div className="close-sidebar cursor" onClick={handleSidebarToggle}>
            <div className="w-10 h-10 cursor">{closeSideIcon}</div>
          </div>
        </header>

        <div className="menu-bar mt-10">
          <div className="menu">
            <ul className="menu-links p-0">
              <>
                <li
                  className={`cursor w-full flex  transition-all duration-500`}
                >
                  <div
                    className={`cursor ${
                      sidebarOpen ? `flex flex-col ml-3.5` : "hidden"
                    }`}
                    onClick={() => {
                      navigate(routeTrainer.preferredLocation);
                    }}
                  >
                    <div className="comman-black-lg">{t("services_in")}</div>
                    <div className="comman-black-text">
                      {trainerDefaultLocation?.location_name}
                    </div>
                  </div>
                </li>
                <li
                  className={`cursor nav-link cursor w-full flex  transition-all duration-500 ${
                    sidebarOpen ? `!justify-start p-3` : `!justify-center`
                  } ${
                    activeTab === routeTrainer.trainerHome ? "services-bg" : ""
                  }`}
                  onClick={() => {
                    navigate(routeTrainer.trainerHome);
                  }}
                >
                  <div className="svg-color">
                    <div className={`w-6 h-6`}>
                      {activeTab === routeTrainer.trainerHome
                        ? activeHomeIcon
                        : homeIcon}
                    </div>
                  </div>
                  <div
                    className={`${
                      sidebarOpen ? `flex items-center ml-5` : "hidden"
                    }`}
                  >
                    <span className="comman-black-text">{t("home")}</span>
                  </div>
                </li>
                <li
                  className={`nav-link cursor flex cursor ${
                    sidebarOpen ? `!justify-start p-3` : `!justify-center`
                  } w-full ${
                    activeTab === routeTrainer.trainerTask ? "services-bg" : ""
                  }`}
                  onClick={() => {
                    navigate(routeTrainer.trainerTask);
                  }}
                >
                  <div className="svg-color">
                    {activeTab === routeTrainer.trainerTask ? (
                      <div className="w-6	h-6">{activeTaskIcon}</div>
                    ) : (
                      <div className="w-6	h-6">{taskIcon}</div>
                    )}
                  </div>
                  <div
                    className={`${
                      sidebarOpen ? `flex items-center ml-5` : "hidden"
                    }`}
                  >
                    <span className="comman-black-text">{t("my_task")}</span>
                  </div>
                </li>
                <li
                  className={`nav-link cursor flex ${
                    sidebarOpen ? `!justify-start p-3` : `!justify-center`
                  } w-full ${
                    activeTab === routeTrainer.community ? "services-bg" : ""
                  }`}
                  onClick={() => {
                    sessionStorage.removeItem("cid");
                    navigate(routeTrainer.community);
                  }}
                >
                  <div className="svg-color">
                    {activeTab === routeTrainer.community ? (
                      <div className="w-6	h-6">{communityActiveIcon}</div>
                    ) : (
                      <div className="w-6	h-6">{communityIcon}</div>
                    )}
                  </div>
                  <div
                    className={`${
                      sidebarOpen ? `flex items-center ml-5` : "hidden"
                    }`}
                  >
                    <span className="comman-black-text">{t("community")}</span>
                  </div>
                </li>
                <li
                  className={`nav-link cursor flex ${
                    sidebarOpen ? `!justify-start  p-3` : `!justify-center`
                  } w-full ${
                    activeTab === routeTrainer.library ? "services-bg" : ""
                  }`}
                  onClick={() => {
                    navigate(routeTrainer.library);
                  }}
                >
                  <div className="svg-color">
                    {activeTab === routeTrainer.library ? (
                      <div className="w-6	h-6">{libraryActiveIcon}</div>
                    ) : (
                      <div className="w-6	h-6">{libraryIcon}</div>
                    )}
                  </div>
                  <div
                    className={`${
                      sidebarOpen ? `flex items-center ml-6` : "hidden"
                    }`}
                  >
                    <span className="comman-black-text">{t("library")}</span>
                  </div>
                </li>
                <li
                  className={`nav-link cursor flex ${
                    sidebarOpen ? `!justify-start  p-3` : `!justify-center`
                  } w-full `}
                  onClick={handleLogout}
                >
                  <div className="svg-color">
                    <div className="w-7	h-7">{logOutIcon}</div>
                  </div>
                  <div
                    className={`${
                      sidebarOpen ? `flex items-center ml-5` : "hidden"
                    }`}
                  >
                    <span className="comman-black-text">{t("logout")}</span>
                  </div>
                </li>
              </>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TrainerSidebarWeb;
