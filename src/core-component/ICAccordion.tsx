import React, { useState, useRef, useEffect } from "react";

interface IICAccordionProps {
  title: string;
  content: JSX.Element;
}

const ICAccordion: React.FC<IICAccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div
      className={`relative mb-3 overflow-hidden  !rounded-t-lg  transition-all duration-300 ease-in-out ${
        isOpen ? "active" : "bg-skin-background"
      }`}
    >
      <h6 className="mb-0">
        <div
          className={`relative flex items-center w-full p-4 text-left transition-all ease-in message-border-bottom border-solid cursor-pointer comman-black-big !text-base !font-semibold  ${
            isOpen ? "active !border-b-white" : "bg-skin-background"
          }`}
          onClick={toggleAccordion}
        >
          <span>{title}</span>
          <i
            className={`absolute right-0 pt-1 pr-3.5 text-xs fa ${
              isOpen ? "fa-minus" : "fa-plus"
            }`}
          ></i>
        </div>
      </h6>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="p-4">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ICAccordion;
