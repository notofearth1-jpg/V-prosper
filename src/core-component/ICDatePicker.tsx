import React, { useState } from "react";
import { dateFormat } from "../utils/AppFunctions";
import { calendarIcon } from "../assets/icons/SvgIconList";
import { DATE_FORMAT } from "../utils/AppEnumerations";
import { TDateFormat, TOnChangeInput } from "../data/AppType";

export interface ICDatePickerProps {
  value: Date;
  min?: Date;
  max?: Date;
  onChangeDate?: (event: TOnChangeInput) => void;
  placeholder?: string;
  displayFormat?: TDateFormat;
  errorMessage?: string;
  label?: string;
  required?: boolean;
}

const ICDatePicker: React.FC<ICDatePickerProps> = (props) => {
  const {
    value,
    placeholder,
    onChangeDate,
    min,
    max,
    displayFormat,
    errorMessage,
    label,
    required,
  } = props;
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isFocused, setIsFocused] = useState(false);
  const handleDateChange = (event: TOnChangeInput) => {
    setSelectedDate(new Date(event.target.value));
    if (onChangeDate) {
      onChangeDate(event);
    }
  };

  const getFormattedDisplayValue = (date: Date) => {
    return dateFormat(date, displayFormat || DATE_FORMAT["YYYY-MM-DD"]);
  };
  const handleFocusDatePicker = () => {
    setIsFocused(true);
  };

  const handleBlurDatePicker = () => {
    setIsFocused(false);
  };

  return (
    <div>
      <div
        className={`ic-date-input-container relative pt-0 pb-0  ${
          errorMessage ? "error-border" : ""
        }`}
      >
        <label
          className={`absolute flex items-center  ${
            isFocused || selectedDate || value
              ? "floating-datePicker top-0  px-1 typo-placeholder-floating "
              : "  pl-1 typo-floating-label"
          } `}
        >
          {label + (required ? "*" : "")}
        </label>
        <div
          className="flex justify-between items-center w-full h-6 cursor"
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            {value ? (
              getFormattedDisplayValue(value)
            ) : placeholder ? (
              <span className="text-zinc-400">{""}</span>
            ) : selectedDate ? (
              getFormattedDisplayValue(selectedDate)
            ) : (
              getFormattedDisplayValue(new Date())
            )}
          </div>
          <div className="text-input-trailing w-4 h-4">{calendarIcon}</div>
        </div>
        <input
          min={min ? dateFormat(min, DATE_FORMAT["YYYY-MM-DD"]) : undefined}
          max={max ? dateFormat(max, DATE_FORMAT["YYYY-MM-DD"]) : undefined}
          className="ic-date-input"
          type="date"
          onChange={handleDateChange}
          onFocus={handleFocusDatePicker}
          onBlur={handleBlurDatePicker}
          value={dateFormat(
            value || selectedDate || new Date(),
            DATE_FORMAT["YYYY-MM-DD"]
          )}
        />
      </div>
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </div>
  );
};

export default ICDatePicker;
