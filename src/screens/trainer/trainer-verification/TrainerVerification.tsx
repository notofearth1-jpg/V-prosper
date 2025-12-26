import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";

import {
  ITrainerKeycode,
  fetchTrainerKeycode,
} from "./TrainerVerificationController";
import { useLocation } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import ICButton from "../../../core-component/ICButton";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerVerification: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(false);
  const trainerId = localStorageUtils.getTrainerId();
  const [trainerKeycode, setTrainerKeycode] = useState<
    ITrainerKeycode | undefined
  >();
  const [timer, setTimer] = useState(0); // Initial timer set to 0
  const [timerText, setTimerText] = useState("");

  useEffect(() => {
    if (trainerKeycode && trainerKeycode.keycode_expiry_seconds) {
      const expirationSeconds = trainerKeycode.keycode_expiry_seconds;
      setTimer(expirationSeconds); // Set timer to expiration time in seconds
    }
  }, [trainerKeycode]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup function to clear the interval on component unmount
  }, [trainerKeycode]);

  useEffect(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    setTimerText(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  }, [timer]);

  const location = useLocation();

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

  const navigate = useNavigate();

  const privious = () => {
    updateQueryStringParameter("ud", 2);
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("ud", 2);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const next = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    updateQueryStringParameter("id", 2);
  };

  const generateKeyCode = () => {
    fetchTrainerKeycode(
      setTrainerKeycode,
      Number(trainerId),
      setLoading,
      navigate,
      t
    );
  };

  useEffect(() => {
    fetchTrainerKeycode(
      setTrainerKeycode,
      Number(trainerId),
      setLoading,
      navigate,
      t
    );
  }, []);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-1  gap-4 ">
            <div className="main-identity flex justify-center">
              <div className="xl:w-1/2 h-screen flex flex-col">
                <div className="comman-padding">
                  <div className="flex items-center justify-between">
                    <BackButton />
                    <div>
                      <BackToOverviewButton onClick={backOverview} />
                    </div>
                  </div>

                  <div className="top">
                    <p className="comman-white-text">
                      {t("identity_verification")}
                    </p>
                    <p className="comman-white-sm top">
                      {t("complete_keycode_verification")}
                    </p>
                    <p className="top comman-white-sm">{t("keycode_number")}</p>
                    {trainerKeycode && (
                      <div className="text-center identity-big-text top">
                        {trainerKeycode.keycode}
                      </div>
                    )}
                  </div>
                </div>
                <div className="Certificates-container flex-1">
                  <div className="top">
                    <p className="comman-black-text">{t("instructions")}</p>
                    <div className="flex comman-grey">
                      <p>1.</p>
                      <p>{t("print_keycode")}</p>
                    </div>
                    <div className="flex comman-grey">
                      <p>2.</p>
                      {trainerKeycode && (
                        <p>{`${t("be_sure_to_write")} "${
                          trainerKeycode.keycode
                        }" ${t("on_same_piece_paper")}`}</p>
                      )}
                    </div>
                    <div className="flex comman-grey">
                      <p>3.</p>
                      <p>{t("take_photo_yourself")}</p>
                    </div>
                  </div>
                  <div className="top">
                    <p className="comman-black-text">{t("note")}</p>
                    <ul className="comman-grey">
                      <li>{t("your_uploaded_picture")}</li>
                      <li>{t("photo_visible")}</li>
                      <li>{t("code_expire")}</li>
                      <li>{t("your_attempts")}</li>
                      <li>{t("file_type")}</li>
                    </ul>
                  </div>
                  <div className="top">
                    {timer === 0 ? (
                      <div className="text-center">
                        <p
                          className="comman-blue cursor"
                          onClick={generateKeyCode}
                        >
                          {t("generate_key_code")}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center comman-grey">
                        {t("expire_in")} {timerText}
                      </div>
                    )}
                  </div>
                  <div className="buttons flex flex-col sm:flex-row items-center justify-center comman-padding">
                    <ICButton
                      type="button"
                      className={`uppercase sm:mr-1 sm:mb-0 mb-2`}
                      onClick={privious}
                    >
                      {t("previous")}
                    </ICButton>

                    <ICButton
                      type="button"
                      className={`uppercase  sm:ml-10 ${
                        timer === 0
                          ? "cursor-not-allowed comman-disablebtn"
                          : "comman-btn"
                      }`}
                      disabled={timer === 0}
                      onClick={next}
                    >
                      {t("next")}
                    </ICButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerVerification;
