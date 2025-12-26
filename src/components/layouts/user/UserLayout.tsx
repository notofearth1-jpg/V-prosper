import React, { useEffect, useState } from "react";
import SidebarWeb from "../../common/SidebarWeb";
import Header from "../../../screens/header/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UseMobileLayoutHook from "../../../hooks/UseMobileLayoutHook";
import { userRoute } from "../../../routes/RouteUser";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import SplashScreen from "../../common/SplashScreen";
import { unauthorizedAccess } from "../../../routes/RoutePublic";
import { initMetaPixel } from "../../../utils/AppFunctions";

const UserLayout = () => {
  const { isMobile } = UseMobileLayoutHook();
  const navigate = useNavigate();
  const [showLayout, setShowLayout] = useState(true);
  const [showLayoutCommunity, setShowLayoutCommunity] = useState(true);

  const location = useLocation();
  useEffect(() => {
    if (location?.pathname === userRoute.community) {
      setShowLayoutCommunity(false);
    } else {
      setShowLayoutCommunity(true);
    }
  }, [location]);

  useEffect(() => {
    if (
      location?.pathname === userRoute.zoom ||
      location?.pathname === userRoute.trainer
    ) {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
  }, [location]);

  const [isLoading, setIsLoading] = useState(
    !localStorageUtils.getSplashScreen()
  );
  const token = localStorageUtils.getAccessToken();

  useEffect(() => {
    if (isLoading && token) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorageUtils.setSplashScreen("hasSeenSplashScreen");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (!token) {
      navigate("/" + unauthorizedAccess.unauthorizedAccess);
    }
  }, []);

  useEffect(() => {
    if (token) {
      initMetaPixel();
    }
  }, [location?.pathname]);

  return (
    <div>
      {isLoading && token ? (
        <SplashScreen />
      ) : (
        <>
          {isMobile ? (
            <div className="layout-bg min-h-svh">
              <Outlet />
            </div>
          ) : (
            <div className="flex">
              {showLayout && (
                <div>
                  <SidebarWeb />
                </div>
              )}
              <div className="main-bg overflow-hidden flex-1">
                {showLayout && (
                  <div>
                    <Header />
                  </div>
                )}
                <div
                  className={
                    showLayout
                      ? `overflow-y-scroll remove-scrollbar-width  ${
                          showLayoutCommunity
                            ? "h-[calc(100vh-76px)]"
                            : "h-screen"
                        }`
                      : ""
                  }
                >
                  <Outlet />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserLayout;
