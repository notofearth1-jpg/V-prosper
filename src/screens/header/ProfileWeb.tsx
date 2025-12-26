import React, { forwardRef } from "react";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import ICImage from "../../core-component/ICImage";
import Profile from "./profile/Profile";
import { USER_ROLE } from "../../utils/AppEnumerations";
import TrainerProfile from "../trainer-profile/TrainerProfile";

const Web = forwardRef<
  HTMLDivElement,
  {
    showPopover: boolean;
    togglePopover: () => void;
    CommanRef: React.RefObject<HTMLDivElement>;
  }
>(({ showPopover, togglePopover, CommanRef }) => {
  const profileImage = localStorageUtils.getProfileUrl();
  const userRole = Number(localStorageUtils.getRole());

  return (
    <div className="relative">
      <div
        onClick={togglePopover}
        className="home-image-web rounded-full overflow-hidden cursor-pointer"
      >
        <ICImage
          imageUrl={
            profileImage == "null" || profileImage == "undefined"
              ? undefined
              : (profileImage as string)
          }
          fallbackSrc={require("../../assets/image/avatar.png")}
          className="w-full h-full object-cover rounded-full"
          isPrivate
        />
      </div>
      {showPopover && (
        <>
          <div
            className="absolute right-0  top-16 overflow-hidden !rounded-3xl sm:w-96 shadow-2xl z-50"
            ref={CommanRef}
          >
            {/* have to modify this code for triangle */}
            {/* <div className="triangleForprofile ">
              <div className="main-identity h-full w-full"></div>
            </div> */}
            <div>
              {userRole === USER_ROLE.Customer ? (
                <Profile togglePopover={togglePopover} />
              ) : (
                userRole === USER_ROLE.Trainer && (
                  <TrainerProfile togglePopover={togglePopover} />
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Web;
