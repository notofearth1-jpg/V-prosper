import React from "react";
import BackButton from "../../components/common/BackButton";
import { sendGiftIcon, share } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICImage from "../../core-component/ICImage";

import { RWebShare } from "react-web-share";
import { APP_HOST_URL } from "../../config/AppConfig";

const InviteFriends = () => {
  const { t } = UseTranslationHook();
  return (
    <div className="h-svh overflow-hidden md:h-[calc(100vh-76px)] flex flex-col ">
      <div className="comman-padding">
        <BackButton />
      </div>
      <div className="comman-padding !pt-0 flex justify-center flex-1">
        <div className="w-full max-w-2xl flex flex-col">
          <div className="w-full flex justify-between ">
            <div className="mr-4 w-5 h-5 mt-1">{sendGiftIcon}</div>
            <div className="comman-black-big text-[16px] w-full">
              <div className="w-fit leading-7">
                {t("invite_friend_title")}&nbsp;
                <b className="tracking-wider">{t("misery")}</b>
              </div>
            </div>
          </div>
          <div className="h-full flex flex-col">
            <div className="text-justify">
              <div className="top comman-grey">
                {t("invite_friend_description")}
              </div>
              <div className="top comman-grey">
                {t("invite_friend_short_description")}
              </div>
            </div>
            <div className="top flex flex-col items-center">
              <ICImage
                width={150}
                className="shadow-2xl object-contain rounded-lg"
                src={require("../../assets/image/vprosper_qr.png")}
              />
              <RWebShare
                data={{
                  text: "V Prosper",
                  url: APP_HOST_URL,
                  title: "V Prosper",
                }}
              >
                <div className="h-5 w-5 mt-10 svg-color cursor">{share}</div>
              </RWebShare>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
