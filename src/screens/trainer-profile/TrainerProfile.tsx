import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SwitchIcon,
  editProfileIcon,
  exitArrow,
  logOutIcon,
} from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { publicRoute } from "../../routes/RoutePublic";
import { IEditTrainer, getTrainerData } from "./EditTrainerProfileController";
import Loader from "../../components/common/Loader";
import { IDDL } from "../../data/AppInterface";
import { fetchUserLanguages } from "../user/user-languages/UserLanguageController";
import ICImage from "../../core-component/ICImage";
import { SwitchProfile } from "../header/profile/EditProfileController";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import {
  isMobileDevice,
  prepareUserId,
  removeRouteInitial,
} from "../../utils/AppFunctions";
import { menuIconsList } from "../../utils/AppConstants";
import { IMenuItem } from "../header/profile/Profile";
import {
  SYSTEM_CONFIGURATION_KEYS,
  USER_ROLE,
  USER_TYPE,
} from "../../utils/AppEnumerations";
import { userRoute } from "../../routes/RouteUser";
import { ISystemConfig } from "../bank-info/BankInfoController";
import { fetchSystemConfigValue } from "../header/profile/PmiController";
import { useAddressContext } from "../../context/AddressContext";
import { useTrainerLocationContext } from "../../context/TrainerDefaultLocationContext";

interface ITrainerProfileComponentProps {
  togglePopover?: () => void;
}

const TrainerProfile: React.FC<ITrainerProfileComponentProps> = ({
  togglePopover,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [userData, setUserData] = useState<IEditTrainer | undefined>();
  const [loading, setLoading] = useState(false);
  const [displayValues, setDisplayValues] = useState<string[]>([]);
  const [languages, setLanguages] = useState<IDDL[]>([]);
  const hasMultipleProfile = localStorageUtils.getMultipleProfile();
  const pmiList: any = localStorageUtils?.getPmi();
  const roleId = Number(localStorageUtils.getRole());
  const { clearAddressData } = useAddressContext();
  const { clearLocationData } = useTrainerLocationContext();

  const HandleLogout = () => {
    localStorage.clear();
    clearAddressData();
    clearLocationData();
    navigate("/" + publicRoute.login);
  };

  const userId = localStorageUtils.getUserId();
  const [systemVersion, setSystemVersion] = useState<
    ISystemConfig | undefined
  >();

  useEffect(() => {
    getTrainerData(setUserData, setLoading);
    fetchUserLanguages(setLanguages, setLoading, t);
  }, []);

  useEffect(() => {
    // Ensure userData is defined and has the languages property
    if (userData && Array.isArray(userData.languages)) {
      // Filter languages based on matching data_value in userData.languages
      const matchedLanguages = languages.filter((lang) =>
        userData.languages.includes(lang.data_value)
      );
      // Map the display_value of matched languages
      const displayValues = matchedLanguages.map((lang) => lang.display_value);
      setDisplayValues(displayValues);
    }
  }, [userData, languages]);

  const SwitchToUser = () => {
    SwitchProfile(navigate, setLoading);
  };
  const alternateProfile = localStorageUtils.getAlternateProfileUrl();
  const alternateProfileName = localStorageUtils.getAlternateProfileName();

  useEffect(() => {
    fetchSystemConfigValue(
      setSystemVersion,
      SYSTEM_CONFIGURATION_KEYS.PwaVersion
    );
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="main-identity flex flex-col overflow-hidden h-svh md:h-[calc(100vh-114px)]">
          <div>
            <div className="flex justify-between items-center comman-padding">
              <div
                className="w-7 h-7 cursor"
                onClick={() => {
                  navigate(routeTrainer.trainerHome);
                }}
              >
                {isMobileDevice() && exitArrow}
              </div>
              <p className="comman-white-sm">{t("my_profile")}</p>
              <div
                onClick={() => {
                  togglePopover && togglePopover();
                  navigate(
                    USER_ROLE.Customer === roleId
                      ? userRoute.editProfile
                      : USER_ROLE.Trainer === roleId &&
                          routeTrainer.trainerEditProfile
                  );
                }}
                className="w-4 h-4 cursor"
              >
                {editProfileIcon}
              </div>
            </div>
            <div className="flex space-x-5 comman-padding  justify-center items-center">
              <div className="w-24 h-24 border-2 border-custom rounded-full overflow-hidden p-1">
                <ICImage
                  className="w-full h-full object-cover rounded-full"
                  imageUrl={userData?.app_user?.pp?.media_url}
                  fallbackSrc={require("../../assets/image/avatar.png")}
                  isPrivate
                />
              </div>
              <div className="flex-1">
                <p className="comman-white-xl">{userData?.full_name}</p>
                {userId && (
                  <p className="comman-white-sm !text-lg !font-semibold mt-1">
                    ({prepareUserId(USER_TYPE.Trainer, userId)})
                  </p>
                )}
                <p className="comman-white-sm">
                  +91 {userData?.app_user?.username}
                </p>
                <p className="comman-white-sm">
                  {t("languages")} : {displayValues.join(", ")}
                </p>
                {userData?.blood_group && (
                  <p className="comman-white-sm">
                    {t("blood_group")} : {userData?.blood_group}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-list-container flex-1">
            {hasMultipleProfile == "true" && (
              <div
                className="profile-items flex items-center border-bottom justify-between cursor"
                onClick={SwitchToUser}
              >
                <div className="flex">
                  <div className="switch-image rounded-full overflow-hidden">
                    <ICImage
                      imageUrl={
                        alternateProfile == "null" ||
                        alternateProfile == "undefined"
                          ? undefined
                          : (alternateProfile as string)
                      }
                      fallbackSrc={require("../../assets/image/avatar.png")}
                      className="w-full h-full object-cover rounded-full"
                      isPrivate
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="mx-4 comman-black-big">
                      {alternateProfileName}
                    </p>
                    <p className="mx-4 comman-black-text mt-1 ">
                      {t("customer")}
                    </p>
                  </div>
                </div>

                <div className="h-7 w-7 svg-color">{SwitchIcon}</div>
              </div>
            )}

            {pmiList &&
              pmiList.length > 0 &&
              pmiList.map((menuItem: IMenuItem, index: number) => (
                <div
                  key={index}
                  className="profile-items flex items-center border-bottom cursor"
                  onClick={() => {
                    togglePopover && togglePopover();
                    navigate(
                      USER_ROLE.Customer === roleId
                        ? userRoute[removeRouteInitial(menuItem.nav_path)]
                        : USER_ROLE.Trainer === roleId &&
                            routeTrainer[
                              menuItem.nav_path as keyof typeof routeTrainer
                            ]
                    );
                  }}
                >
                  <div className="w-5 h-5 svg-color">
                    {
                      menuIconsList[
                        menuItem.menu_icon ? menuItem.menu_icon : "helpIcon"
                      ]
                    }
                  </div>

                  <p className="mx-4 comman-black-text">
                    {menuItem.menu_title}
                  </p>
                </div>
              ))}
            <div
              className="profile-items flex items-center border-bottom cursor"
              onClick={HandleLogout}
            >
              <div className="w-5 h-5 svg-color ">{logOutIcon}</div>

              <p className="mx-4 comman-black-text">{t("logout")}</p>
            </div>

            {systemVersion && (
              <div className="flex items-center justify-center top pb-3">
                <p className="profile-btn">{systemVersion.config_value}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerProfile;
