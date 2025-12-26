import React, { useState, useEffect, useRef } from 'react';

interface IOption {
  value: string;
  label: string;
}

interface ISearchableDropdownProps {
  options: IOption[];
}

const ICSearchDropDown: React.FC<ISearchableDropdownProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: IOption) => {
    setSelectedOption(option);
    setSearchQuery('');
    toggleDropdown();
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter((option: IOption) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [setIsOpen]);

  return (
    <div className="searchable-dropdown" ref={dropdownRef}>
      <div className="dropdown-header-searchable" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : 'Select an option'}
        {isOpen ? (
          <span className="arrow-dropdown-group">&#x25B4;</span>
        ) : (
          <span className="arrow-dropdown-group">&#9662;</span>
        )}
      </div>
      {isOpen && (
        <div className="dropdown-options-searchable">
          <input
            type="text"
            className="search-dropdown-custom-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredOptions.map((option: IOption) => (
            <div
              key={option.value}
              className="option-searchable"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ICSearchDropDown;
