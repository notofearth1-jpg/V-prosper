// import { AnyNaptrRecord } from "dns";
import React, { useState, useRef, useEffect } from "react";
// import "./styles.css"; // Make sure to adjust the path to your CSS file

const ICDropDownGroup = ({ options }: any) => {
  // const [selectedValue, setSelectedValue] = useState("");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [myCss, setMycss] = useState(false);

  // const handleSelect = (value1: any, value2: any, value3: any) => {
  //   setSelectedValue(value1);

  //   setIsDropdownOpen(false);
  // };

  // const contentRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  // const [remainingSpace, setRemainingSpace] = useState(0);

  // const handleOutsideClick = (event: MouseEvent) => {
  //   if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
  //     setIsDropdownOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (contentRef.current) {
  //       const contentRect = contentRef.current.getBoundingClientRect();
  //       const viewportHeight = window.innerHeight;

  //       const remainingSpace = viewportHeight - contentRect.bottom;
  //       setRemainingSpace(remainingSpace);

  //       if (remainingSpace < 300) {
  //         setMycss(true);
  //       } else {
  //         setMycss(false);
  //       }
  //     }
  //   };

  //   handleResize(); // Initial calculation

  //   window.addEventListener("resize", handleResize);
  //   document.addEventListener("mousedown", handleOutsideClick);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, [contentRef?.current?.getBoundingClientRect()]);

  // return (
  //   <div className="custom-dropdown-group" ref={contentRef}>
  //     <div
  //       className={`selected-value-group ${isDropdownOpen ? "open" : ""}`}
  //       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  //     >
  //       {selectedValue ? selectedValue : "Select an option"}
  //       {isDropdownOpen ? (
  //         <span className="arrow-dropdown-group">&#x25B4;</span>
  //       ) : (
  //         <span className="arrow-dropdown-group">&#9662;</span>
  //       )}
  //     </div>
  //     {isDropdownOpen && (
  //       <ul
  //         className="options-group"
  //         style={{
  //           top: myCss ? "" : "100%",
  //           bottom: myCss ? "100%" : "",
  //         }}
  //       >
  //         {options.map((group: any) => (
  //           <li key={group.label}>
  //             <div className={`group-label-group sticky-label-group`}>
  //               {group.label}
  //             </div>
  //             <ul style={{ textDecoration: "none" }}>
  //               {group.options.map((option: any) => (
  //                 <li
  //                   key={option.value}
  //                   className={`option-group ${option === selectedValue ? "selected" : ""
  //                     }`}
  //                   onClick={() =>
  //                     handleSelect(option.name, option.value, group.label)
  //                   }
  //                 >
  //                   {option.name}
  //                 </li>
  //               ))}
  //             </ul>
  //           </li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
};

export default ICDropDownGroup;
