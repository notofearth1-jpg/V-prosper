import React, { useEffect, useRef, useState } from "react";
import { TReactSetState } from "../../../data/AppType";
import { useLocation, useNavigate } from "react-router-dom";
import { ITrainerDetails, fetchTrainerDetails } from "../trainerController";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  infoIcon,
  rupeeIcon,
  rupeeTrainerIcon,
} from "../../../assets/icons/SvgIconList";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import BackButton from "../../../components/common/BackButton";

interface ITrainerWelcome {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerWelcome: React.FC<ITrainerWelcome> = ({ setCurrentIndex }) => {
  const [trainerAllDetails, setTrainerAllDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [loading, setLoading] = useState(true);
  const userId = localStorageUtils.getUserId();
  const { t } = UseTranslationHook();
  const location = useLocation();
  const navigate = useNavigate();
  const [trainerEarn, setTrainerEarn] = useState("52000");
  const [trainerHours, setTrainerHours] = useState(4);

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(location.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const setNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    updateQueryStringParameter("s", 2);
  };

  useEffect(() => {
    fetchTrainerDetails(setTrainerAllDetails, Number(userId), setLoading, t);
  }, []);

  if (trainerAllDetails) {
    const serializedDetails = JSON.stringify(trainerAllDetails);
    localStorageUtils.setTrainerDetails(serializedDetails);
  }

  const previous = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
    navigate(-1);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  const handeleTrainerEarning = (erning: string, hours: number) => {
    setTrainerEarn(erning);
    setTrainerHours(hours);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const [showTooltip, setShowTooltip] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center w-full !bg-white h-svh overflow-scroll">
      <div
        ref={mainBgRef}
        className={`${
          isFullHeight ? "h-[96vh]" : "h-auto"
        }  max-w-screen-md w-full`}
      >
        <div>
          <div className="h-full w-full relative">
            <div className="absolute left-5 top-5 z-50">
              <BackButton />
            </div>
            <ICImage
              src={require("../../../assets/image/growth.png")}
              className="h-full w-full max-h-[470px]"
            />
          </div>
        </div>
        <div className="text-center top">
          <p>{t("your_growth")}</p>
        </div>

        <div className="flex flex-col justify-center items-center lg:mt-8 mt-12">
          <div className="growth flex flex-col justify-center items-center relative">
            <div className="w-10 h-10 absolute top-0 left-10 growth-icon">
              {rupeeTrainerIcon}
            </div>
            <div className="flex items-center mt-4">
              <div className="h-4 w-4 mb-1">{rupeeIcon}</div>
              <div className="comman-black-lg !text-[24px] ml-3">
                {trainerEarn}
              </div>
            </div>
            <div className="comman-black-text mt-4">{t("you_can_earn")}</div>
            <div
              className="comman-black-text flex items-center mt-4"
              ref={profileRef}
            >
              <p>{t("per_month")}</p>
              <div
                className={`tooltip-container cursor ${
                  showTooltip ? "show" : ""
                }`}
                onClick={() => setShowTooltip(!showTooltip)}
                onBlur={() => setShowTooltip(false)}
              >
                <div className="w-4 h-4 ml-2 mb-1">{infoIcon}</div>
                <div className="tooltip text-lg !px-2">
                  {t("revenue_varies_directly")}
                </div>
              </div>
            </div>

            <div className="growth-border w-full mt-2"></div>
            <div className="mt-2 comman-black-text flex items-center">
              <p>{t("you_strengthen_everyone")}</p>
              <p className="!font-semibold ml-1">
                {trainerHours}
                {t("hrs")}...
              </p>
            </div>

            <div className="top flex items-center">
              <ICButton
                type="button"
                onClick={() => {
                  handeleTrainerEarning("52000", 4);
                }}
                className={`${
                  trainerEarn === "52000"
                    ? "!bg-black"
                    : "!bg-[#D9D9D9] !text-black"
                }`}
              >
                4 {t("hrs")}
              </ICButton>
              <ICButton
                type="button"
                className={`mx-5 ${
                  trainerEarn === "86000"
                    ? "!bg-black"
                    : "!bg-[#D9D9D9] !text-black"
                }`}
                onClick={() => {
                  handeleTrainerEarning("86000", 6);
                }}
              >
                6 {t("hrs")}
              </ICButton>
              <ICButton
                type="button"
                onClick={() => {
                  handeleTrainerEarning("103000", 8);
                }}
                className={`${
                  trainerEarn === "103000"
                    ? "!bg-black"
                    : "!bg-[#D9D9D9] !text-black"
                }`}
              >
                8 {t("hrs")}
              </ICButton>
            </div>
          </div>
        </div>

        <div className="buttons lg:mt-4 mt-6 md:p-3 flex flex-col sm:flex-row items-center justify-center comman-padding">
          <ICButton
            type="button"
            className={`uppercase sm:mr-1 sm:mb-0 mb-2  !bg-blue-600 `}
            onClick={previous}
          >
            {t("previous")}
          </ICButton>

          <ICButton
            type="button"
            className={`uppercase  sm:ml-10 !bg-blue-600`}
            onClick={setNext}
          >
            {t("awesome_am_in")}
          </ICButton>
        </div>
      </div>
    </div>
  );
};

export default TrainerWelcome;
