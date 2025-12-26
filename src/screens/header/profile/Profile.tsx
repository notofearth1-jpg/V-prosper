import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  IEditUser,
  ITrainerApplication,
  SwitchProfile,
  fetchTrainerStatusDetails,
  getUserData,
} from "./EditProfileController";
import Loader from "../../../components/common/Loader";
import { fetchUserLanguages } from "../../user/user-languages/UserLanguageController";
import { IDDL } from "../../../data/AppInterface";
import {
  sweetAlertInfo,
  isMobileDevice,
  prepareUserId,
} from "../../../utils/AppFunctions";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  SwitchIcon,
  editProfileIcon,
  exitArrow,
  logOutIcon,
  trainerIcon,
} from "../../../assets/icons/SvgIconList";
import {
  APPLICATION_STATUS,
  SYSTEM_CONFIGURATION_KEYS,
  TRAINER_ON_BOARD,
  USER_ROLE,
  USER_TYPE,
} from "../../../utils/AppEnumerations";
import { userRoute } from "../../../routes/RouteUser";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { publicRoute } from "../../../routes/RoutePublic";
import { ITrainerDetails } from "../../trainer/trainerController";
import ICImage from "../../../core-component/ICImage";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { menuIconsList } from "../../../utils/AppConstants";
import { fetchSystemConfigValue } from "./PmiController";
import { ISystemConfig } from "../../bank-info/BankInfoController";
import { useAddressContext } from "../../../context/AddressContext";
import { useTrainerLocationContext } from "../../../context/TrainerDefaultLocationContext";

export interface IMenuItem {
  menu_title: string;
  nav_path: string;
  menu_icon: string | null;
}
interface IProfileComponentProps {
  togglePopover?: () => void;
}
const Profile: React.FC<IProfileComponentProps> = ({ togglePopover }) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [userData, setUserData] = useState<IEditUser | undefined>();
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<IDDL[]>([]);
  const [displayValues, setDisplayValues] = useState<string[]>([]);
  const [TrainerAllDetails, setTrainerAllDetails] = useState<
    ITrainerApplication | undefined
  >();
  const userId = localStorageUtils.getUserId();
  const pmiList: any = localStorageUtils?.getPmi();
  const roleId = Number(localStorageUtils.getRole());
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [systemVersion, setSystemVersion] = useState<
    ISystemConfig | undefined
  >();

  const alternateProfile = localStorageUtils.getAlternateProfileUrl();
  const alternateProfileName = localStorageUtils.getAlternateProfileName();
  const hasMultipleProfile = localStorageUtils.getMultipleProfile();
  const { clearAddressData } = useAddressContext();
  const { clearLocationData } = useTrainerLocationContext();

  useEffect(() => {
    getUserData(setUserData, setLoading);
    fetchUserLanguages(setLanguages, setLoading, t);
  }, []);

  useEffect(() => {
    if (hasMultipleProfile == "false") {
      fetchTrainerStatusDetails(
        setTrainerAllDetails,
        Number(userId),
        setLoading,
        t
      );
    }
  }, []);

  const showStatusAlert = (status: number) => {
    let message = "";

    switch (status) {
      case APPLICATION_STATUS.Draft:
        navigate(
          userRoute.trainer,
          TrainerAllDetails?.application_content.framework_consent === true
            ? { state: { index: TRAINER_ON_BOARD.TrainerProfileOverview } }
            : {}
        );
        return;
      case APPLICATION_STATUS.SubmittedForReview:
        message = t("application_for_review");
        break;
      case APPLICATION_STATUS.ReviewInProgress:
        message = t("application_for_progress");
        break;
      case APPLICATION_STATUS.ChangeRequested:
        navigate(userRoute.trainer, {
          state: { index: TRAINER_ON_BOARD.TrainerProfileOverview },
        });
        return;
      case APPLICATION_STATUS.ScheduledInterview:
        message = t("an_interview_scheduled");
        break;
      case APPLICATION_STATUS.Hold:
        message = t("application_on_hold");
        break;
      case APPLICATION_STATUS.Rejected:
        message = t("application_rejected");
        break;
      case APPLICATION_STATUS.Approved:
        message = t("application_approved");
        break;
      case APPLICATION_STATUS.Archive:
        message = t("application_archived");
        break;
      case APPLICATION_STATUS.Locked:
        message = t("application_locked");
        break;
      case APPLICATION_STATUS.PartialApproved:
        message = t("application_partial_approved");
        break;
      default:
        message = t("unknown_application_status");
    }
    sweetAlertInfo(message);
  };

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

  const HandleLogout = () => {
    navigate("/" + publicRoute.login);
    localStorage.clear();
    sessionStorage.clear();
    clearAddressData();
    clearLocationData();
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        if (updatedDetails) {
          // Ensure updatedDetails is not undefined
          setTrainerDetails(updatedDetails);
        }
      }
    };
    fetchData();
  }, []);

  const SwitchToTrainer = () => {
    SwitchProfile(navigate, setLoading);
  };

  useEffect(() => {
    const storedFilters = localStorageUtils.getFilters();
    if (storedFilters) {
      localStorageUtils.removeFilters();
    }
  }, []);

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
                  navigate(userRoute.home);
                }}
              >
                {isMobileDevice() && exitArrow}
              </div>
              <p className="comman-white-sm">{t("my_profile")}</p>
              <div
                onClick={() => {
                  togglePopover && togglePopover();
                  navigate(userRoute.editProfile);
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
                  fallbackSrc={require("../../../assets/image/avatar.png")}
                  isPrivate
                />
              </div>
              <div className="flex-1">
                <p className="comman-white-xl mt-1">{userData?.full_name}</p>
                {userId && (
                  <p className="comman-white-sm !text-lg !font-semibold mt-1">
                    ({prepareUserId(USER_TYPE.Customer, userId)})
                  </p>
                )}
                <p className="comman-white-sm mt-1">
                  +91 {userData?.app_user?.username}
                </p>
                <p className="comman-white-sm mt-1">
                  {t("languages")} : {displayValues.join(", ")}
                </p>
                {userData?.blood_group && (
                  <p className="comman-white-sm mt-1">
                    {t("blood_group")} : {userData?.blood_group}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-list-container  flex-1">
            {hasMultipleProfile == "true" && (
              <div
                className="profile-items flex items-center border-bottom justify-between cursor-pointer"
                onClick={SwitchToTrainer}
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
                      fallbackSrc={require("../../../assets/image/avatar.png")}
                      className="w-full h-full object-cover rounded-full"
                      isPrivate
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="mx-4 !text-2xl comman-black-big">
                      {alternateProfileName}
                    </p>
                    <p className="mx-4 comman-black-text mt-1 ">
                      {t("trainer")}
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
                  className="profile-items flex items-center border-bottom cursor-pointer"
                  onClick={() => {
                    togglePopover && togglePopover();
                    navigate(
                      USER_ROLE.Customer === roleId
                        ? userRoute[menuItem.nav_path as keyof typeof userRoute]
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

            {hasMultipleProfile == "false" && (
              <>
                <div
                  className="profile-items flex items-center border-bottom cursor"
                  onClick={() =>
                    TrainerAllDetails &&
                    showStatusAlert(TrainerAllDetails.application_status ?? 0)
                  }
                >
                  <div className="w-5 h-5 svg-color">{trainerIcon}</div>

                  <p className="mx-4 comman-black-text">
                    {t("join_as_trainer")}
                  </p>
                </div>
              </>
            )}
            <div
              className="profile-items flex items-center border-bottom cursor-pointer"
              onClick={HandleLogout}
            >
              <div className="w-5 h-5 svg-color">{logOutIcon}</div>

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

export default Profile;
