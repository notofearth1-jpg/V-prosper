import React, { useState } from 'react';
import { timeIcon } from '../assets/icons/SvgIconList';
import { TOnChangeInput, TTimeFormat } from '../data/AppType';

export interface ICTimePickerProps {
  value: string;
  onChangeTime?: (event: TOnChangeInput) => void;
  placeholder?: string;
  displayFormat?: TTimeFormat;
  min?: string;
  max?: string;
  errorMessage?: string;
  label?: string;
  containerClassName?: string;
  required?: boolean;
}

const ICTimePicker: React.FC<ICTimePickerProps> = (props) => {
  const {
    containerClassName,
    value,
    placeholder,
    onChangeTime,
    min,
    max,
    errorMessage,
    label,
    required,
  } = props;
  const [selectedTime, setSelectedTime] = useState<string>(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const handleTimeChange = (event: TOnChangeInput) => {
    setSelectedTime(event.target.value);
    if (onChangeTime) {
      onChangeTime(event);
    }
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const currentTime = `${formattedHours}:${formattedMinutes}`;

    return currentTime;
  }
  const handleFocusTimePicker = () => {
    setIsFocused(true);
  };

  const handleBlurTimePicker = () => {
    setIsFocused(false);
  };

  return (
    <div className="pt-0 pb-0">
      <div
        className={`ic-date-input-container relative  ${
          errorMessage ? 'error-border' : ''
        }${containerClassName}`}
      >
        <label
          className={`absolute flex items-center  ${
            isFocused || selectedTime || value
              ? 'floating-timePicker top-0  px-1 typo-placeholder-floating  '
              : ' pl-1 typo-floating-label '
          } `}
        >
          {label + (required ? '*' : '')}
        </label>
        <div className="flex justify-between items-center w-full h-6 ">
          <div>
            {value ? (
              value
            ) : placeholder ? (
              <span className="text-zinc-400 ">{''}</span>
            ) : selectedTime ? (
              selectedTime
            ) : (
              getCurrentTime()
            )}
          </div>
          <div className="text-input-trailing">{timeIcon}</div>
        </div>
        <input
          className="ic-date-input"
          type="time"
          max={max}
          min={min}
          onChange={handleTimeChange}
          onFocus={handleFocusTimePicker}
          onBlur={handleBlurTimePicker}
          value={selectedTime || selectedTime || getCurrentTime()}
        />
      </div>
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </div>
  );
};

export default ICTimePicker;
