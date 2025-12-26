import React, { useState, useEffect } from "react";
import { dateFormat, getLocalDate } from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { IS_OFFLINE } from "../../utils/AppEnumerations";

interface IBookingJoinButtonProps {
  schedule_time: string;
  schedule_start_date: string;
  schedule_end_date: string;
  isOffline: string;
  actual_session_start_time: string;
  onClickJoin: (e: any) => void;
  onClickEndSession: (e: any) => void;
  onClickStartSession: (e: any) => void;
}

const parseDateTime = (dateString: string, timeString: string): Date => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = getLocalDate(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const SessionJoinButton: React.FC<IBookingJoinButtonProps> = ({
  schedule_time,
  schedule_start_date,
  schedule_end_date,
  isOffline,
  actual_session_start_time,
  onClickJoin,
  onClickEndSession,
  onClickStartSession,
}) => {
  const { t } = UseTranslationHook();
  const scheduleStartDate = parseDateTime(schedule_start_date, schedule_time);
  const scheduleEndDate = parseDateTime(schedule_end_date, "T23:59:59");

  const [buttonText, setButtonText] = useState<string>("");
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const updateButton = () => {
      const now = getLocalDate();
      const timeDifference = scheduleStartDate.getTime() - now.getTime();

      if (now.getTime() >= scheduleEndDate.getTime()) {
        setIsButtonVisible(false);
      } else if (timeDifference <= 0) {
        setButtonText(t("join_now"));
      } else if (timeDifference <= 15 * 60 * 1000) {
        setButtonText(t("join_now"));
      } else if (timeDifference <= 60 * 60 * 1000) {
        const minutesLeft = Math.ceil(timeDifference / (60 * 1000));
        setButtonText(`${minutesLeft} ${t("mins_left")}`);
      } else if (timeDifference <= 24 * 60 * 60 * 1000) {
        const hoursLeft = Math.ceil(timeDifference / (60 * 60 * 1000));
        setButtonText(`${hoursLeft} ${t("hour_left")}`);
      } else {
        const daysLeft = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
        setButtonText(`${daysLeft} ${t("days_left")}`);
      }
    };

    updateButton();

    const intervalId = setInterval(updateButton, 1000);
    return () => clearInterval(intervalId);
  }, [scheduleStartDate, scheduleEndDate]);

  if (!isButtonVisible) {
    return null;
  }

  return (
    isButtonVisible && (
      <div
        className={`bg-skin-primary-button text-xs rounded-full py-1 px-2 w-fit text-skin-on-primary`}
      >
        {isOffline === IS_OFFLINE.Yes && buttonText === t("join_now") ? (
          <div>
            {actual_session_start_time &&
            dateFormat(getLocalDate(), 3) === schedule_end_date ? (
              <div
                className="cursor text-nowrap min-w-24 text-center"
                onClick={onClickEndSession}
              >
                {t("end_session")}
              </div>
            ) : actual_session_start_time ? (
              <div className="text-nowrap min-w-24 text-center">
                {t("in_progress")}
              </div>
            ) : (
              <div
                className="cursor  text-nowrap min-w-24 text-center"
                onClick={onClickStartSession}
              >
                {t("start_session")}
              </div>
            )}
          </div>
        ) : (
          <div
            className="text-nowrap min-w-24 text-center cursor"
            onClick={buttonText === t("join_now") ? onClickJoin : undefined}
          >
            {buttonText}
          </div>
        )}
      </div>
    )
  );
};

export default SessionJoinButton;
