import React, { useState, useEffect } from "react";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { leftArrow, leftArrowIcon } from "../../assets/icons/SvgIconList";
import { TReactSetState } from "../../data/AppType";
import { DAYS_OF_WEEK, MONTHS_NUMBER } from "../../utils/AppEnumerations";
import { DAYS_OF_WEEK_LABEL } from "../../utils/AppConstants";

interface IDatePickerProps {
  sessionDateList: number[];
  selectedDate: string;
  setSelectedDate: TReactSetState<string>;
}

const DatePickerCustom: React.FC<IDatePickerProps> = ({
  sessionDateList,
  selectedDate,
  setSelectedDate,
}) => {
  const { t } = UseTranslationHook();
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const days = [
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Monday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Tuesday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Wednesday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Thursday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Friday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Saturday]),
    t(DAYS_OF_WEEK_LABEL[DAYS_OF_WEEK.Sunday]),
  ];

  useEffect(() => {
    const [year, month] = selectedDate.split("-").map(Number);
    setSelectedYear(year);
    setSelectedMonth(month - 1);
  }, [selectedDate]);

  const handleMonthChange = (monthNumber: number) => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (monthNumber === MONTHS_NUMBER.December) {
      newMonth = 0;
      newYear += 1;
    } else if (monthNumber === -1) {
      newMonth = 11;
      newYear -= 1;
    } else {
      newMonth = monthNumber;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDate(getSelectedDate(1, newMonth, newYear));
  };
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getSelectedDate = (
    day: number,
    month: number,
    year: number
  ): string => {
    const formattedMonth = (month + 1).toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const selectedDate = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(selectedDate);
    return selectedDate;
  };

  const getStartDayOfWeek = (): number => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  };

  const getEmptyCellsCount = (): number => {
    const startDayOfWeek = getStartDayOfWeek();
    return startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  };

  const isActiveDate = (day: number): boolean => {
    const formattedMonth = (selectedMonth + 1).toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const currentDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    return currentDate === selectedDate;
  };

  const isSessionDate = (day: number): boolean => {
    return sessionDateList.includes(day);
  };

  return (
    <div className="space-y-1 w-full md:max-w-96 bg-skin-background rounded-lg shadow-inner comman-padding">
      <div className="flex justify-between items-center pb-3 mb-3 message-border-bottom">
        <div
          className="h-4 w-4 svg-color cursor"
          onClick={() => {
            handleMonthChange(selectedMonth - 1);
          }}
        >
          {leftArrow}
        </div>

        <div className="font-semibold">{`${t(
          new Date(selectedYear, selectedMonth).toLocaleDateString("en-US", {
            month: "long",
          })
        )} ${selectedYear}`}</div>

        <div
          className="h-4 w-4 svg-color cursor"
          onClick={() => handleMonthChange(selectedMonth + 1)}
        >
          {leftArrowIcon}
        </div>
      </div>
      <div>
        <div className="grid grid-cols-7 pb-1.5">
          {days.map((day, index) => (
            <span
              key={index}
              className="m-px text-sm flex justify-center items-center"
            >
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: getEmptyCellsCount() }).map((_, i) => (
            <div key={i}></div>
          ))}
          {Array.from(
            { length: getDaysInMonth(selectedMonth, selectedYear) },
            (_, i) => i + 1
          ).map((day, index) => (
            <div
              key={index}
              className="flex justify-center items-center relative"
            >
              <button
                type="button"
                className={`cursor m-px size-10 flex justify-center items-center border border-transparent text-sm rounded-full ${
                  isActiveDate(day) &&
                  "text-skin-btn-primary bg-skin-primary-button"
                }`}
                onClick={() =>
                  getSelectedDate(day, selectedMonth, selectedYear)
                }
              >
                {day}
              </button>
              {isSessionDate(day) && (
                <div className="w-1 h-1 bg-skin-primary-button rounded-full absolute bottom-0.5"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePickerCustom;
