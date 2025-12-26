import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginView from "../screens/auth/login/LoginView";
import VerifyOTP from "../screens/auth/otp-verify/VerifyOtp";
import PublicLayout from "../components/layouts/public/PublicLayout";
import Welcome from "../screens/welcome/Welcome";
import User from "../screens/user/user";
import Trainer from "../screens/trainer/Trainer";
import UnauthorizedAccess from "../screens/auth/unauthorizedAccess/UnauthorizedAccess";

const PublicRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path={publicRoute.welcome} element={<Welcome />} />
        <Route path={publicRoute.login} element={<LoginView />} />
        <Route path={publicRoute.verifyOTP} element={<VerifyOTP />} />
        <Route path={publicRoute.userVerification} element={<User />} />
        <Route path={publicRoute.trainer} element={<Trainer />} />

        <Route
          path={unauthorizedAccess.unauthorizedAccess}
          element={<UnauthorizedAccess />}
        />
      </Route>
    </Routes>
  );
};

export default PublicRouter;

export const publicRoute = {
  welcome: "/welcome",
  userVerification: "user-verification",
  login: "log-in",
  verifyOTP: "verifyOTP",
  trainer: "join-as-trainer",
  home: "/",
};

export const unauthorizedAccess = {
  unauthorizedAccess: "unauthorizedAccess",
};
