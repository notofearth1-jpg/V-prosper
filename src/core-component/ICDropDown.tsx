import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import useTranslationHook from "../hooks/UseTranslationHook";
import { arrowDownIcon, arrowUpIcon } from "../assets/icons/SvgIconList";

interface IOption<T> {
  label: string;
  value: T;
}

interface ICustomDropdownProps<T> {
  options: IOption<T>[];
  onSelect: (option: IOption<T>) => void;
  className?: string;
  selected?: T;
  searchable?: boolean;
  disabled?: boolean;
  label?: string;
  errorMessage?: string;
  defaultOption?: IOption<T>;
  required?: boolean;
  borderNone?: boolean;
  textSpacing?: string;
  showBlank?: boolean;
  borderColor?: boolean;
}

const ICDropDown = <T extends Object>({
  options,
  onSelect,
  className,
  selected,
  searchable,
  disabled,
  label,
  errorMessage,
  defaultOption,
  required,
  borderNone,
  textSpacing,
  showBlank = false,
  borderColor,
}: ICustomDropdownProps<T>) => {
  const { t } = useTranslationHook();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [contentTopDown, setContentTopDown] = useState(false);
  const wrapperRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const contentRect = wrapperRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const remainingSpace = viewportHeight - contentRect.bottom;
        if (remainingSpace < 250) {
          setContentTopDown(true);
        } else {
          setContentTopDown(false);
        }
      }
    };
    document.addEventListener("mousedown", (event) => {
      handleOutsideClick(event);
      handleResize();
    });

    return () => {
      document.removeEventListener("mousedown", (event) => {
        handleOutsideClick(event);
        handleResize();
      });
    };
  }, [wrapperRef?.current?.getBoundingClientRect()]);

  useEffect(() => {
    if (!isOpen) {
      setSearchText("");
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getSelectedOption = () => {
    const item = [
      ...(defaultOption ? [defaultOption] : [{ label: "", value: "" }]),
      ...options,
    ].find((item) => item.value === selected);
    if (item) {
      return item.label;
    }
    return "";
  };

  const filteredOptions = useMemo(() => {
    return options.filter((item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, options]);

  return (
    <div>
      <div
        className={`custom-dropdown-container ${className}`}
        ref={wrapperRef}
      >
        <div
          onClick={toggleDropdown}
          className={`relative dropdown-button ${textSpacing} ${
            borderNone ? "" : "typo-input-value"
          } ${borderNone ? "dropdown-button-auth" : "dropdown-button"} ${
            borderColor ? "border-color-black" : ""
          } ${errorMessage ? "error-border" : ""} ${isOpen ? "open" : ""}`}
        >
          {label && !getSelectedOption() && (
            // Floating label
            // <span
            //   className={` absolute top-0 ${
            //     getSelectedOption() === ""
            //       ? "flex items-center h-full typo-floating-label "
            //       : "-translate-y-[60%] typo-floating-dropDown-label floating-dropDown-label"
            //   } bg-skin-drop-down-floating px-[4px] `}
            // >
            //   {label + (required ? "*" : "")}
            // </span>
            <span className="typo-input-label-placeholder">
              {label + (required ? "*" : "")}
            </span>
          )}
          {getSelectedOption()}
          {isOpen ? (
            <span
              className={`arrow-dropdown-group w-5 h-5  ${
                borderNone ? "" : "svg-color"
              }`}
            >
              {arrowUpIcon}
            </span>
          ) : (
            <span
              className={`arrow-dropdown-group w-5 h-5 ${
                borderNone ? "" : "svg-color"
              }`}
            >
              {arrowDownIcon}
            </span>
          )}
        </div>
        {isOpen && (
          <div
            className="dropdown-content-option none-scrollbar"
            style={{
              top: contentTopDown ? "" : "100%",
              bottom: contentTopDown ? "100%" : "",
              borderTop: contentTopDown ? "" : "0px",
              // If need for box border design for input then required below for no border ovelapping
              // borderBottom: contentTopDown ? "0px" : "",
            }}
          >
            <div>
              {searchable && isOpen && (
                <input
                  type="text"
                  className="search-dropdown-custom-input"
                  placeholder={t("search") + "..."}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
              )}
            </div>
            <div className="max-h-48 overflow-auto none-scrollbar">
              {showBlank
                ? [
                    ...(defaultOption
                      ? [defaultOption]
                      : [{ label: "", value: "" }]),
                    ...filteredOptions,
                  ].map((option, index) => (
                    <div
                      key={index}
                      className={`option ${
                        borderNone ? "" : "typo-input-value"
                      } ${option.label ? "" : "h-8"}`}
                      onClick={() => {
                        onSelect(option as IOption<T>);
                        toggleDropdown();
                      }}
                    >
                      {option.label}
                    </div>
                  ))
                : filteredOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`option ${
                        borderNone ? "" : "typo-input-value"
                      } ${option.label ? "" : "h-8"}`}
                      onClick={() => {
                        onSelect(option as IOption<T>);
                        toggleDropdown();
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </div>
  );
};

export default ICDropDown;
