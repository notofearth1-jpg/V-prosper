import React, { useEffect, useState } from "react";
import Header from "../../../screens/header/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UseMobileLayoutHook from "../../../hooks/UseMobileLayoutHook";
import TrainerSidebarWeb from "../../common/TrainerSidebarWeb";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { unauthorizedAccess } from "../../../routes/RoutePublic";
import { initMetaPixel } from "../../../utils/AppFunctions";

const TrainerLayout = () => {
  const { isMobile } = UseMobileLayoutHook();
  const [showLayout, setShowLayout] = useState(true);
  const [showLayoutCommunity, setShowLayoutCommunity] = useState(true);

  const location = useLocation();
  const token = localStorageUtils.getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.pathname === routeTrainer.zoom) {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
  }, [location]);

  useEffect(() => {
    if (location?.pathname === routeTrainer.community) {
      setShowLayoutCommunity(false);
    } else {
      setShowLayoutCommunity(true);
    }
  }, [location]);

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
      {isMobile ? (
        <div className="layout-bg h-svh">
          <Outlet />
        </div>
      ) : (
        <div className="flex">
          <div>{showLayout && <TrainerSidebarWeb />}</div>
          <div className="main-bg overflow-hidden flex-1">
            <div>{showLayout && showLayoutCommunity && <Header />}</div>
            <div
              className={
                showLayout && showLayoutCommunity
                  ? "overflow-y-scroll remove-scrollbar-width h-[calc(100vh-76px)]"
                  : ""
              }
            >
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerLayout;
