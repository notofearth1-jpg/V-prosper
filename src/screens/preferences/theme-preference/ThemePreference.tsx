import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../../components/common/BackButton";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import {
  IGroupConfiguration,
  IThemeConfiguration,
  fetchUserTheme,
} from "../../header/profile/EditProfileController";
import Loader from "../../../components/common/Loader";
import { submitUserTheme } from "../PreferenceController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

const ThemePreference = () => {
  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);
  const [themeList, setThemeList] = useState<IGroupConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();

  useEffect(() => {
    const theme = localStorageUtils.getTheme();
    if (theme) {
      setThemeList(JSON.parse(theme));
    } else {
      fetchUserTheme(setThemeList, setLoading);
    }
  }, []);

  const handleThemeClick = async (groupId: number, groupTitle: string) => {
    const themePayload = {
      preference_key: groupTitle,
      preference_value: groupId as unknown as string,
    };

    await submitUserTheme(themePayload);
    await fetchUserTheme(setThemeList, setLoading);
  };

  const [randomTheme, setRandomTheme] = useState<IGroupConfiguration>();

  useEffect(() => {
    let randomThemeIndex;
    const hasPreferredTheme = themeList.some(
      (item) => item.preferred_theme === "1"
    );

    if (hasPreferredTheme) {
      const preferredThemeIndex = themeList.findIndex(
        (item) => item.preferred_theme === "1"
      );
      randomThemeIndex = preferredThemeIndex;
    } else {
      randomThemeIndex = Math.floor(Math.random() * themeList.length);
    }

    setRandomTheme(themeList[randomThemeIndex]);
  }, [themeList]);

  const updateRootStyles = (property: string, value: string) => {
    // Retrieve the root element
    const root = document.documentElement;
    // Set the value of the CSS variable
    root.style.setProperty(property, value);
  };

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
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`comman-padding h-svh md:h-[calc(100vh-76px)] overflow-hidden flex flex-col`}
        >
          <div className="flex items-center pb-4">
            <BackButton />
            <div className="comman-black-lg ml-3">
              {t("your_preferred_theme")}
            </div>
          </div>

          {themeList && themeList.length > 0 && (
            <div className="flex-1 overflow-y-scroll remove-scrollbar-width">
              {themeList && themeList.length > 0 && (
                <div>
                  <p
                    className={`p-3 services-bg w-full cursor comman-black-big ${
                      themeList.some((item) => item.preferred_theme === "1")
                        ? ""
                        : "active"
                    }`}
                    onClick={() => handleThemeClick(0, "random")}
                  >
                    {t("random")}
                  </p>

                  {themeList.map((item, index) => {
                    let groupTitle = item.group_title.toLowerCase();
                    if (groupTitle.includes(" ")) {
                      // Remove spaces and convert to lowercase
                      groupTitle = groupTitle.replace(/\s+/g, "").toLowerCase();
                    }
                    const boxBgColorVariable = `${groupTitle}_icon_solid_color`;
                    const mainBgColorVariable = `${groupTitle}_main_bg_color`;

                    return (
                      <div
                        className={`prefered-theme flex w-full cursor top`}
                        key={index}
                        onClick={() => handleThemeClick(item.group_id, "theme")}
                        style={{
                          background:
                            item.preferred_theme === "1"
                              ? item.theme_configuration[mainBgColorVariable]
                              : undefined,
                        }}
                      >
                        <div
                          className="w-1/4"
                          style={{
                            backgroundColor:
                              item.theme_configuration[boxBgColorVariable],
                          }}
                        ></div>
                        <div
                          className={`w-full ml-3 flex items-center comman-black-lg`}
                        >
                          <p>{item.group_title}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ThemePreference;
