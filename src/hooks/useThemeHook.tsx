// useTheme.ts
import { useState, useEffect } from "react";
import {
  IGroupConfiguration,
  fetchUserTheme,
} from "../screens/header/profile/EditProfileController";
import { localStorageUtils } from "../utils/LocalStorageUtil";

const useTheme = () => {
  const [randomTheme, setRandomTheme] = useState<IGroupConfiguration>();
  const [loading, setLoading] = useState(false);
  const [themeList, setThemeList] = useState<IGroupConfiguration[]>([]);

  useEffect(() => {
    const token = localStorageUtils.getAccessToken();
    const theme = localStorageUtils.getTheme();

    const fetchAndSetTheme = async () => {
      if (theme) {
        setThemeList(JSON.parse(theme));
      } else if (token) {
        setLoading(true);
        await fetchUserTheme(setThemeList, setLoading);
        setLoading(false);
      }
    };

    fetchAndSetTheme();
  }, []);

  useEffect(() => {
    let randomThemeIndex;
    if (themeList) {
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
    }
  }, [themeList]);

  return { randomTheme, loading };
};

export default useTheme;
