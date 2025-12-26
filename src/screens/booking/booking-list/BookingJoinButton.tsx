import React, { useState, useEffect } from "react";
import { getLocalDate } from "../../../utils/AppFunctions";
import { IS_OFFLINE, IS_OFFLINE_VALUES } from "../../../utils/AppEnumerations";
import UseTranslationHook from "../../../hooks/UseTranslationHook";

interface IBookingJoinButtonProps {
  schedule_time: string;
  schedule_start_date: string;
  schedule_end_date: string;
  isOffline: string;
  session_id: number | null;
  handleJoinButton: (e: any) => void;
}

const parseDateTime = (dateString: string, timeString: string): Date => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = getLocalDate(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const BookingJoinButton: React.FC<IBookingJoinButtonProps> = ({
  schedule_time,
  schedule_start_date,
  schedule_end_date,
  isOffline,
  session_id,
  handleJoinButton,
}) => {
  const { t } = UseTranslationHook();
  const scheduleStartDate = parseDateTime(schedule_start_date, schedule_time);
  const scheduleEndDate = parseDateTime(schedule_end_date, "T23:59:59");

  const [buttonText, setButtonText] = useState<string>("");
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const updateButton = () => {
      const now = getLocalDate();
      const timeUntilStart = scheduleStartDate.getTime() - now.getTime();
      const timeUntilEnd = scheduleEndDate.getTime() - now.getTime();

      if (now.getTime() >= scheduleEndDate.getTime()) {
        setIsButtonVisible(false);
      } else if (timeUntilStart <= 0 && timeUntilEnd > 0) {
        setButtonText(
          isOffline === IS_OFFLINE.Yes
            ? t(IS_OFFLINE_VALUES.Offline)
            : session_id
            ? t("join_now")
            : ""
        );
      } else if (timeUntilStart <= 15 * 60 * 1000) {
        session_id &&
          setButtonText(
            isOffline === IS_OFFLINE.Yes
              ? t(IS_OFFLINE_VALUES.Offline)
              : session_id
              ? t("join_now")
              : ""
          );
      } else if (timeUntilStart <= 60 * 60 * 1000) {
        const minutesLeft = Math.ceil(timeUntilStart / (60 * 1000));
        setButtonText(`${minutesLeft} ${t("mins_left")}`);
      } else if (timeUntilStart <= 24 * 60 * 60 * 1000) {
        const hoursLeft = Math.ceil(timeUntilStart / (60 * 60 * 1000));
        setButtonText(`${hoursLeft} ${t("hour_left")}`);
      } else {
        const daysLeft = Math.ceil(timeUntilStart / (24 * 60 * 60 * 1000));
        setButtonText(`${daysLeft} ${t("days_left")}`);
      }
    };

    updateButton();

    const intervalId = setInterval(updateButton, 60000);
    return () => clearInterval(intervalId);
  }, [scheduleStartDate, scheduleEndDate, session_id]);

  if (!isButtonVisible || !buttonText) {
    return null;
  }

  return (
    <div
      className={`bg-skin-primary-button text-xs rounded-full py-1 px-2 w-fit text-skin-on-primary ${
        buttonText === t("join_now") ? "cursor-pointer" : "!cursor-default"
      }`}
      onClick={buttonText === t("join_now") ? handleJoinButton : undefined}
    >
      {buttonText}
    </div>
  );
};

export default BookingJoinButton;
