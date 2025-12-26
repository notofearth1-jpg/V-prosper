import React, { useState } from "react";

interface IDropDown {
  title: string;
  options: { data_value: number; display_value: string }[];
  onSelect: (dataValue: number) => void;
}

interface IOption {
  data_value: number;
  display_value: string;
}

const DropDownComponent: React.FC<IDropDown> = ({
  title,
  options,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleOptionClick = (option: IOption) => {
    setDropdownOpen(false);
    setSelectedOption(option);
    onSelect(option.data_value); // Pass the selected data_value to the parent component
  };

  return (
    <>
      <div className="top flex items-center justify-center min-width">
        <div className="select">
          <div className="selectBtn" onClick={toggleDropdown}>
            {selectedOption
              ? selectedOption.display_value
              : `Select Your ${title}`}
          </div>
          <div className={`selectDropdown ${isDropdownOpen ? "toggle" : ""}`}>
            {options.map((option, index) => (
              <div
                key={index}
                className="option"
                onClick={() => handleOptionClick(option)}
              >
                {option.display_value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDownComponent;
