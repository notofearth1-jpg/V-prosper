import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ICustomDatePickerProps {
  selectedDate: Date | null; // Specify the type explicitly as Date
  onChange: (date: Date) => void; // Assuming onChange function receives a Date parameter
  dateFormat?: string;
  minDate?: Date | null; // Make it optional by using '?' if it's optional in your usage
  maxDate?: Date; // Make it optional by using '?' if it's optional in your usage
  showYearDropdown?: boolean; // Make it optional by using '?' if it's optional in your usage
  yearDropdownItemNumber?: number; // Make it optional by using '?' if it's optional in your usage
  scrollableYearDropdown?: boolean; // Make it optional by using '?' if it's optional in your usage
  showIcon?: boolean;
}

const CustomDatePicker: React.FC<ICustomDatePickerProps> = ({
  selectedDate,
  onChange,
  dateFormat,
  minDate,
  maxDate,
  showYearDropdown,
  yearDropdownItemNumber,
  scrollableYearDropdown,
  showIcon,
  ...restProps
}) => {
  return (
    <DatePicker
      showIcon={showIcon}
      selected={selectedDate}
      onChange={onChange}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate}
      showYearDropdown={showYearDropdown}
      yearDropdownItemNumber={yearDropdownItemNumber}
      scrollableYearDropdown={scrollableYearDropdown}
      {...restProps}
    />
  );
};
export default CustomDatePicker;
