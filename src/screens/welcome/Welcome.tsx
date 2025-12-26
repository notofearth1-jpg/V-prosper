import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navigationApp } from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { publicRoute } from "../../routes/RoutePublic";
import { PUBLIC_TABS } from "../../utils/AppEnumerations";
import ICImage from "../../core-component/ICImage";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();

  useEffect(() => {
    document.title = PUBLIC_TABS.VProsper;
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div className="grid grid-rows-3 xl:grid-rows-1 xl:grid-cols-2 h-full">
        <div className="relative row-span-1 z-10 flex items-center justify-center md:items-start md:justify-start">
          <div className="h-[111px] w-[111px] md:ml-12 md:mt-12">
            <ICImage
              src={require("../../assets/image/VP.png")}
              className=" object-cover md:hidden"
            />
          </div>
        </div>
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={require("../../assets/image/sign-in-screens.mp4")}
          playsInline
        />

        <div className="px-10 md:px-20 py-12 flex md:justify-end justify-center row-span-2 items-center">
          <div className="welcome-padding relative z-10 login-content md:max-w-[560px] h-fit max-h-[400px] overflow-y-auto md:max-h-full w-full">
            <div className="hidden md:block">
              <ICImage
                src={require("../../assets/image/VP.png")}
                className=" object-cover h-[111px] w-[111px]"
              />
            </div>
            <div className="text-center welcome-text md:mt-[50px] mt-0">
              <p>{t("you_are")}</p>
              <p>{t("architect_of")}</p>
              <p>{t("your_own_wellness")}</p>
            </div>
            <div className="w-full md:mt-[50px] mt-10">
              <button
                type="button"
                onClick={() => navigationApp(navigate, "/" + publicRoute.login)}
                className="auth-btn cursor"
              >
                {t("start_your_journey")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
