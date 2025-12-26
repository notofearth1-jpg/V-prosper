import { useEffect, useState } from "react";
import TrainerBottomNavbar from "../header/TrainerBottomNavbar";
import { IThemeConfiguration } from "../header/profile/EditProfileController";
import MobileHeader from "../header/MobileHeader";
import { isMobileDevice, updateRootStyles } from "../../utils/AppFunctions";
import useTheme from "../../hooks/useThemeHook";
import {
  handlePushNotification,
  requestNotificationPermission,
} from "../../utils/firebaseNotification";
import RevenueReportView from "./report/RevenueReportView";
import SessionReportView from "./report/SessionReportView";
import MonthlyRevenueView from "./report/MonthlyRevenueView";
import TopServicesView from "./report/TopServicesView";
import CategoryWiseSessionView from "./report/CategoryWiseSessionView";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import TrainerRatingReportView from "./report/TrainerRatingReportView";
import { useLocation } from "react-router-dom";
import { useAddressContext } from "../../context/AddressContext";
import { fetchUserDefultAddress } from "../user-location/UserLocation.controller";

const TrainerDashboard = () => {
  const { t } = UseTranslationHook();
  const { randomTheme } = useTheme();
  const { addressData, setAddressData } = useAddressContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (randomTheme && randomTheme.theme_configuration) {
      const themeConfig: IThemeConfiguration = randomTheme.theme_configuration;
      let groupTitle = randomTheme.group_title.toLowerCase();

      // Check if groupTitle contains spaces
      if (groupTitle.includes(" ")) {
        // Remove spaces and convert to lowercase
        groupTitle = groupTitle.replace(/\s+/g, "").toLowerCase();
      }

      // Construct the CSS variable name dynamically
      const boxBgColorVariable = `${groupTitle}_box_bg_color`;
      const descriptionFontColorVariable = `${groupTitle}_description_font_color`;
      const iconSolidColorVariable = `${groupTitle}_icon_solid_color`;
      const linkColorVariable = `${groupTitle}_link_color`;
      const mainBgColorVariable = `${groupTitle}_main_bg_color`;
      const placeholderColorVariable = `${groupTitle}_placeholder_color`;
      const titleColorVariable = `${groupTitle}_title_color`;
      // Update the CSS variable with the corresponding color
      updateRootStyles(
        "--services-background-color",
        themeConfig[boxBgColorVariable]
      );
      updateRootStyles(
        "--primary-button-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-background-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--main-background-color",
        themeConfig[mainBgColorVariable]
      );
      updateRootStyles(
        "--input-active-border-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-icon-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--primary-button-hover-color",
        themeConfig[mainBgColorVariable]
      );
      updateRootStyles(
        "--primary-title-color",
        themeConfig[titleColorVariable]
      );
      updateRootStyles(
        "--primary-description-color",
        themeConfig[descriptionFontColorVariable]
      );
      updateRootStyles("--primary-link-color", themeConfig[linkColorVariable]);
      updateRootStyles(
        "--primary-placeholder-color",
        themeConfig[placeholderColorVariable]
      );
      updateRootStyles(
        "--input-placeholder-color",
        themeConfig[placeholderColorVariable]
      );
      updateRootStyles("--input-label-color", themeConfig[titleColorVariable]);
    }
  }, [randomTheme]);

  useEffect(() => {
    requestNotificationPermission();

    // Set up foreground message handler
    handlePushNotification((payload: any) => {
      const { title, body, icon } = payload.notification;

      // Display the notification
      new Notification(title, { body, icon });
    });
  }, []);

  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent back navigation
      window.history.pushState(null, "", location.pathname);
      event.preventDefault();
    };

    // Add a dummy state to the history stack
    window.history.pushState(null, "", location.pathname);

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);

  useEffect(() => {
    if (!addressData) {
      setLoading(true);
      fetchUserDefultAddress(setAddressData, setLoading);
    }
  }, []);

  return (
    <>
      <div className="container mx-auto overflow-auto h-svh md:h-[calc(100vh-76px)] pb-24 md:pb-4">
        {isMobileDevice() && (
          <div className="comman-padding">
            <MobileHeader />
          </div>
        )}
        <div className="px-4">
          <div>
            <div className="common-black-xl font-medium">{t("summary")}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-5">
              <RevenueReportView />
              <SessionReportView />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-6 xl:grid-cols-12 gap-4">
            <div className="col-span-6 comman-padding w-full background-border">
              <MonthlyRevenueView />
            </div>
            <div className="col-span-6 grid grid-cols-12 gap-4">
              <div className="sm:col-span-6 col-span-12 comman-padding background-border">
                <TopServicesView />
              </div>
              <div className="sm:col-span-6 col-span-12 comman-padding background-border">
                <CategoryWiseSessionView />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-5 comman-padding background-border max-w-[774px]">
            <TrainerRatingReportView />
          </div>
        </div>
        <TrainerBottomNavbar homeActive />
      </div>
    </>
  );
};

export default TrainerDashboard;
