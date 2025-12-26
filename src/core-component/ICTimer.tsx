import React, { useState, useEffect } from "react";
import UseTranslationHook from "../hooks/UseTranslationHook";

interface TimerProps {
  initialTime: string; // Format: "mm:ss"
  maxResends: number;
  onResend: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, maxResends, onResend }) => {
  // Utility function to parse time in "mm:ss" format
  const parseTime = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };
  const { t } = UseTranslationHook();
  // Utility function to format time as "mm:ss"
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const [time, setTime] = useState(parseTime(initialTime));
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleResendClick = () => {
    if (resendCount < maxResends && time === 0) {
      onResend();
      setResendCount((prevCount) => prevCount + 1);
      setTime(parseTime(initialTime));
    }
  };

  return (
    <div>
      {time !== 0 && (
        <div className="text-center mt-2 otp-timer !text-[#60606099]">{formatTime(time)}</div>
      )}

      {time === 0 && (
        <div
          className={`text-center mt-2 otp-timer flex   ${
            resendCount === maxResends ? "hidden" : ""
          } `}
        >
          <div className="comman-black-text">{t("did_not_send_otp")}</div>{" "}
          <div
            onClick={handleResendClick}
            className={`${
              time === 0 ? "cursor" : "cursor-not-allowed"
            } text-blue-500 ml-1`}
          >
            {t("resend_otp")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
