import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { userRoute } from "../../../routes/RouteUser";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { USER_ROLE, USER_STATUS } from "../../../utils/AppEnumerations";
import { publicRoute, unauthorizedAccess } from "../../../routes/RoutePublic";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // uncomment this is for app.vprosper.in
  useEffect(() => {
    const storedAccessToken = localStorageUtils.getAccessToken();
    const storedRoleId = localStorageUtils.getRole();
    const profileStatus = localStorageUtils.getUserProfileStatus();

    if (
      Number(profileStatus) !== USER_STATUS.ProfileCompleted &&
      storedAccessToken
    ) {
      navigate("/" + publicRoute.userVerification);
    } else {
      if (storedAccessToken && storedRoleId) {
        if (storedRoleId === `${USER_ROLE.Customer}`) {
          navigate(userRoute.home);
        } else if (storedRoleId === `${USER_ROLE.Trainer}`) {
          navigate(routeTrainer.trainerHome);
        }
      }
    }

    setIsVisible(true);
  }, []);

  return (
    <>
      {isVisible ? (
        <div
          className={`${
            location.pathname === "/" ||
            location.pathname === "/" + publicRoute.login ||
            location.pathname === "/" + publicRoute.verifyOTP ||
            location.pathname === publicRoute.welcome
              ? ""
              : "layout-bg"
          } h-screen`}
        >
          <Outlet />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PublicLayout;
