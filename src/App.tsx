import React, { useEffect, useState } from "react";
import AppRouter from "./routes/Router";
import { useSelector } from "react-redux";
import { RootState } from "./redux/Store";
import Swal from "sweetalert2";
import { IThemeConfiguration } from "./screens/header/profile/EditProfileController";
import useTheme from "./hooks/useThemeHook";
import { updateRootStyles } from "./utils/AppFunctions";
import { AddressProvider } from "./context/AddressContext";
import { TrainerLocationProvider } from "./context/TrainerDefaultLocationContext";

function App() {
  const theme = useSelector(
    (state: RootState) => state.preference.userPreference.theme
  );

  const [online, setOnline] = useState(navigator.onLine);
  const [showOnlinePopup, setShowOnlinePopup] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowOnlinePopup(true);
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!online) {
      Swal.fire({
        title: "No Internet",
        text: "It seems you are offline. Please check your internet connection.",
        icon: "error",
      });
    } else if (showOnlinePopup) {
      Swal.fire({
        title: "Back Online",
        text: "You are now back online.",
        icon: "success",
        timer: 2000,
      });
      setShowOnlinePopup(false);
    }
  }, [online, showOnlinePopup]);

  const { randomTheme } = useTheme();

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
        "--progress-stroke-color",
        themeConfig[iconSolidColorVariable]
      );
      updateRootStyles(
        "--input-placeholder-color",
        themeConfig[placeholderColorVariable]
      );
      updateRootStyles("--input-label-color", themeConfig[titleColorVariable]);
    }
  }, [randomTheme]);

  return (
    <div className={theme}>
      <AddressProvider>
        <TrainerLocationProvider>
          <AppRouter />
        </TrainerLocationProvider>
      </AddressProvider>
    </div>
  );
}

export default App;
