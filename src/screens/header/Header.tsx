import React, { FC, useEffect, useRef, useState } from "react";
import WebSearch from "./WebSearch";
import WebNotifications from "./WebNotifications";
import Profile from "./ProfileWeb";
import { userRoute } from "../../routes/RouteUser";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [showSearchBarPopover, setSearchBarPopover] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showLayout, setShowLayout] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (location?.pathname === userRoute.community) {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
  }, [location]);
  const toggleSearchBarPopover = () => {
    setSearchBarPopover(!showSearchBarPopover);
    setShowProfilePopover(false);
    setShowNotificationPopover(false);
  };

  const toggleNotificationPopover = () => {
    setShowNotificationPopover((prev) => !prev);
    setShowProfilePopover(false);
    setSearchBarPopover(false);
  };

  const toggleProfilePopover = () => {
    setShowProfilePopover(!showProfilePopover);
    setShowNotificationPopover(false);
    setSearchBarPopover(false);
  };

  const CommanRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {showLayout && (
        <div className={`flex w-full justify-between items-center header-bg`}>
          <div className="w-full mr-2.5">
            <WebSearch
              showPopover={showSearchBarPopover}
              togglePopover={toggleSearchBarPopover}
              CommanRef={CommanRef}
            />
          </div>
          {/*for feature develop */}
          {/* <WebNotifications
            showPopover={showNotificationPopover}
            togglePopover={toggleNotificationPopover}
            CommanRef={CommanRef}
          /> */}
          <div ref={profileRef}>
            <Profile
              showPopover={showProfilePopover}
              togglePopover={toggleProfilePopover}
              CommanRef={CommanRef}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
