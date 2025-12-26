import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import UserAlternateMobile from "./user-alternative-mobile/UserAlternativeMobile";
import UserAddress from "./user-address/UserAddress";
import UserGender from "./user-gender/UserGender";
import UserBirthDate from "./user-birth-date/UserBirthDate";
import UserHealth from "./user-health/UserHealth";
import UserInterests from "./user-interests/UserInterests";
import UserLanguage from "./user-languages/UserLanguage";
import UserAltMobileVerify from "./user-alternative-verify/UserAlternativeVerify";
import { useLocation } from "react-router-dom";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { USER_FLOW_STATUS } from "../../utils/AppEnumerations";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import UserBasicInformation from "./user-basic-information/UserBasicInfo";
import { userFlowStatusValue } from "../../utils/AppConstants";

const User = () => {
  const { t } = UseTranslationHook();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleLinkClick = (index: number) => {
    setCurrentIndex(index);
  };

  const { isMobile } = UseMobileLayoutHook();

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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-[2rem] h-screen overflow-hidden">
        <div className="hidden col-span-4 lg:block flex-1 overflow-y-scroll comman-padding">
          <div>
            <ul className="space-y-2 tracking-wide list-none p-0 ">
              {userFlowStatusValue.map((value, index) => (
                <li className="cursor" key={index}>
                  <a
                    onClick={() => handleLinkClick(value.value)}
                    className={`px-3 flex items-center space-x-4 rounded-md cursor  ${
                      currentIndex === value.value
                        ? "text-skin-user background-green "
                        : "text-skin-user-title sidebar-hover"
                    }`}
                  >
                    <span className="group-hover:text-skin-user-hover-group">
                      {index + 1}. {t(value.title)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`${
            isMobile ? "main-bg" : ""
          } col-span-8 lg:flex lg:justify-center md:flex md:justify-center flex-1 overflow-y-scroll`}
        >
          {currentIndex === USER_FLOW_STATUS.BasicInfo && (
            <UserBasicInformation setCurrentIndex={setCurrentIndex} />
          )}

          {/* {currentIndex === USER_FLOW_STATUS.AlternateMobile && (
            <UserAlternateMobile setCurrentIndex={setCurrentIndex} />
          )}

          {currentIndex === USER_FLOW_STATUS.AltMobileVerify && (
            <UserAltMobileVerify setCurrentIndex={setCurrentIndex} />
          )}

          {currentIndex === USER_FLOW_STATUS.UserAddress && (
            <UserAddress setCurrentIndex={setCurrentIndex} />
          )} */}

          {currentIndex === USER_FLOW_STATUS.UserGender && (
            <UserGender setCurrentIndex={setCurrentIndex} />
          )}

          {currentIndex === USER_FLOW_STATUS.UserBirthDate && (
            <UserBirthDate setCurrentIndex={setCurrentIndex} />
          )}

          {/* {currentIndex === USER_FLOW_STATUS.UserHealth && (
            <UserHealth setCurrentIndex={setCurrentIndex} />
          )}

          {currentIndex === USER_FLOW_STATUS.UserInterests && (
            <UserInterests setCurrentIndex={setCurrentIndex} />
          )} */}

          {currentIndex === USER_FLOW_STATUS.UserLanguage && (
            <UserLanguage setCurrentIndex={setCurrentIndex} />
          )}
        </div>
      </div>
    </>
  );
};

export default User;
