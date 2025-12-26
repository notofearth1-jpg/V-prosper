import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import TrainerWelcome from "./trainer-welcome/TrainerWelcome";
import TrainerWellness from "./trainer-wellness/TrainerWellness";
import TrainerCategory from "./trainer-category/TrainerCategory";
import TrainerCity from "./trainer-city/TrainerCity";
import TrainerAgreement from "./trainer-agreement/TrainerAgreement";
import UserAddress from "./trainer-address/TrainerAddress";
import TrainerAddress from "./trainer-address/TrainerAddress";
import TrainerGender from "./trainer-gender/TrainerGender";
import TrainerBirthDate from "./trainer-birth-date/TrainerBirthDate";
import TrainerEvents from "./trainer-event/TrainerEvents";
import TrainerHealth from "./tariner-helth/TrainerHelth";
import TrainerSpace from "./trainer-space/TrainerSpace";
import TrainerIdentity from "./trainer-identity/TrainerIdentity";
import TrainerCertificates from "./trainer-certificates/TrainerCertificates";
import TrainerVerification from "./trainer-verification/TrainerVerification";
import TrainerKeycodeUpload from "./trainer-keycode-upload/TrainerKeycodeUpload";
import TrainerReviewApplication from "./trainer-review-application/TrainerReviewApplication";
import TrainerProfileOverview from "./trainer-application-overview/TrainerApplicationOverview";
import { TRAINER_ON_BOARD } from "../../utils/AppEnumerations";
import useFullHeightBackground from "../../components/common/useFullHeghtBackground";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";

const Trainer = () => {
  const { isMobile } = UseMobileLayoutHook();

  const location = useLocation();
  const index = location?.state?.index;
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  useEffect(() => {
    if (index) {
      setCurrentIndex(index);
    } else {
      setCurrentIndex(TRAINER_ON_BOARD.TrainerWellness);
    }
  }, []);

  return (
    <>
      <div
        className={
          currentIndex === TRAINER_ON_BOARD.TrainerVerification
            ? `${isFullHeight ? "min-h-screen main-identity" : ""}`
            : currentIndex === TRAINER_ON_BOARD.TrainerReviewApplication
            ? "h-auto main-bg"
            : `main-bg overflow-auto ${isFullHeight ? "min-h-screen" : ""} ${
                currentIndex === TRAINER_ON_BOARD.TrainerWellness ||
                currentIndex === TRAINER_ON_BOARD.TrainerGrowth
                  ? "!p-0"
                  : ""
              } `
        }
        ref={mainBgRef}
      >
        <div
          className={`${
            currentIndex >= TRAINER_ON_BOARD.TrainerAddress && isMobile == false
              ? "grid grid-cols-1"
              : "grid grid-cols-1"
          }`}
        >
          <div
            className={`${
              currentIndex === TRAINER_ON_BOARD.TrainerVerification ||
              currentIndex === TRAINER_ON_BOARD.TrainerWellness ||
              currentIndex === TRAINER_ON_BOARD.TrainerGrowth
                ? ""
                : "lg:mt-10"
            }`}
          >
            {currentIndex === TRAINER_ON_BOARD.TrainerWellness && (
              <TrainerWellness setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerGrowth && (
              <TrainerWelcome setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerProfileOverview && (
              <TrainerProfileOverview setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerAgreement && (
              <TrainerAgreement setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerCategory && (
              <TrainerCategory setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerCity && (
              <TrainerCity setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerAddress && (
              <TrainerAddress setCurrentIndex={setCurrentIndex} />
            )}

            {currentIndex === TRAINER_ON_BOARD.TrainerGender && (
              <TrainerGender setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerBirthDate && (
              <TrainerBirthDate setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerEvents && (
              <TrainerEvents setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerHealth && (
              <TrainerHealth setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerSpace && (
              <TrainerSpace setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerIdentity && (
              <TrainerIdentity setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerCertificates && (
              <TrainerCertificates setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerVerification && (
              <TrainerVerification setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerKeycodeUpload && (
              <TrainerKeycodeUpload setCurrentIndex={setCurrentIndex} />
            )}
            {currentIndex === TRAINER_ON_BOARD.TrainerReviewApplication && (
              <TrainerReviewApplication setCurrentIndex={setCurrentIndex} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trainer;
