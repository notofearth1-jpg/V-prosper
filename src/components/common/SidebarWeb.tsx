import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  activeHomeIcon,
  arrowDownIcon,
  communityActiveIcon,
  communityIcon,
  homeIcon,
  libraryActiveIcon,
  libraryIcon,
  logOutIcon,
  serviceActiveIcon,
  servicesIcon,
  sideIconLink,
} from "../../assets/icons/SvgIconList";
import { publicRoute } from "../../routes/RoutePublic";
import { userRoute } from "../../routes/RouteUser";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import ShrinkText from "./ShrinkText";
import { useAddressContext } from "../../context/AddressContext";
import { fetchUserDefultAddress } from "../../screens/user-location/UserLocation.controller";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { useTrainerLocationContext } from "../../context/TrainerDefaultLocationContext";

const SidebarWeb: React.FC = () => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const activeTab = location.pathname;
  const navigate = useNavigate();

  const handleSidebarToggle = (e: any) => {
    e.stopPropagation();
    setSidebarOpen((prev: any) => !prev);
  };

  const { isMobile } = UseMobileLayoutHook();
  const { addressData, setAddressData, clearAddressData } = useAddressContext();
  const { clearLocationData } = useTrainerLocationContext();

  const HandleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearAddressData();
    clearLocationData();
    navigate("/" + publicRoute.login);
  };

  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();

  useEffect(() => {
    if (!addressData) {
      setLoading(true);
      fetchUserDefultAddress(setAddressData, setLoading);
    }
  }, []);

  return (
    <div className="position-relative">
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

          <div
            className="w-5 h-5 toggle services-bg svg-color cursor"
            onClick={handleSidebarToggle}
          >
            {sideIconLink}
          </div>
        </header>

        <div className="menu-bar mt-10">
          <div className="menu">
            <ul className="menu-links flex justify-center flex-col w-full p-0 transition-all duration-500">
              <li className="nav-link my-10">
                {sidebarOpen && (
                  <div className="my-10 static text cursor">
                    <div
                      className="ml-[10px] cursor"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(userRoute.locations);
                      }}
                    >
                      {addressData ? (
                        <>
                          {addressData.address_line_1 &&
                            addressData.address_line_2 && (
                              <p>
                                <ShrinkText
                                  text={`${addressData.address_line_1}, ${addressData.address_line_2}`}
                                  maxLength={20}
                                  className="comman-black-text"
                                />
                              </p>
                            )}
                          <p className="comman-grey flex">
                            <ShrinkText
                              text={`${
                                addressData.city ? addressData.city + "," : ""
                              } ${addressData.state_name} ${
                                addressData.postcode
                              } - ${addressData.country_name}`}
                              maxLength={25}
                            />
                            <div className="w-5 h-5 ml-5">{arrowDownIcon}</div>
                          </p>
                        </>
                      ) : (
                        <p className="comman-black-lg">{t("manage_address")}</p>
                      )}
                    </div>
                  </div>
                )}
              </li>
              <li
                className={`nav-link !mt-8 cursor w-full flex  transition-all duration-500 ${
                  sidebarOpen ? `!justify-start p-3` : `!justify-center`
                } ${activeTab === userRoute.home && "services-bg"}`}
                onClick={() => {
                  navigate(userRoute.home);
                }}
              >
                <div className="svg-color">
                  <div className={`w-6 h-6`}>
                    {activeTab === userRoute.home ? activeHomeIcon : homeIcon}
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
                className={`nav-link cursor flex ${
                  sidebarOpen ? `!justify-start p-3` : `!justify-center`
                } w-full ${activeTab === userRoute.services && "services-bg"}`}
                onClick={() => {
                  navigate(userRoute.services);
                }}
              >
                <div className="svg-color">
                  {activeTab === userRoute.services ? (
                    <div className="w-6	h-6">{serviceActiveIcon}</div>
                  ) : (
                    <div className="w-6	h-6">{servicesIcon}</div>
                  )}
                </div>
                <div
                  className={`${
                    sidebarOpen ? `flex items-center ml-5` : "hidden"
                  }`}
                >
                  <span className="comman-black-text">{t("offerings")}</span>
                </div>
              </li>
              <li
                className={`nav-link cursor flex ${
                  sidebarOpen ? `!justify-start p-3` : `!justify-center`
                } w-full ${activeTab === userRoute.community && "services-bg"}`}
                onClick={() => {
                  sessionStorage.removeItem("cid");
                  navigate(userRoute.community);
                }}
              >
                <div className="svg-color">
                  {activeTab === userRoute.community ? (
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
                } w-full ${activeTab === userRoute.library && "services-bg"}`}
                onClick={() => {
                  navigate(userRoute.library);
                }}
              >
                <div className="svg-color">
                  {activeTab === userRoute.library ? (
                    <div className="w-6	h-6">{libraryActiveIcon}</div>
                  ) : (
                    <div className="w-6	h-6">{libraryIcon}</div>
                  )}
                </div>
                <div
                  className={`${
                    sidebarOpen ? `flex items-center ml-5` : "hidden"
                  }`}
                >
                  <span className="comman-black-text">{t("library")}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bottom-content" onClick={HandleLogout}>
            <li
              className={`nav-link cursor flex ${
                sidebarOpen ? `!justify-start p-3` : `!justify-center`
              } w-full`}
            >
              <div className="">
                <div className="w-6 h-6 svg-color">{logOutIcon}</div>
              </div>
              <div
                className={`${
                  sidebarOpen ? `flex items-center ml-5` : "hidden"
                }`}
              >
                <span className="comman-black-text">{t("logout")}</span>
              </div>
            </li>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SidebarWeb;
