import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { publicRoute } from "../../../routes/RoutePublic";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  // State to keep track of the countdown
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clear localStorage immediately
    localStorage.clear();

    // Function to redirect after countdown
    const redirectToLogin = () => {
      navigate("/" + publicRoute.login);
    };

    // Start countdown and redirect after 5 seconds
    const timer = setTimeout(() => {
      redirectToLogin();
    }, 5000);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear the interval when component unmounts
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>{t("unauthorized_access")}</h1>
        <p>{t("not_permission")}</p>
        <p>
          {t("redirect_message")} {countdown} {t("seconds")}
        </p>
        <button
          className="logout-button cursor"
          onClick={() => {
            localStorage.clear();
            navigate("/" + publicRoute.login);
          }}
        >
          {t("sign_out")}
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
