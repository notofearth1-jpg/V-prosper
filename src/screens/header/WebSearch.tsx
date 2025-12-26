import React, { useEffect, useState, useRef, forwardRef } from "react";
import {
  recentSearchIcon,
  searchCloseIcon,
  searchIcon,
  trendingSearchIcon,
} from "../../assets/icons/SvgIconList";
import SearchModal from "./search/SearchModal";

const WebSearch = forwardRef<
  HTMLDivElement,
  {
    showPopover: boolean;
    togglePopover: () => void;
    CommanRef: React.RefObject<HTMLDivElement>;
  }
>(({ showPopover, togglePopover, CommanRef }) => {
  const [searchBarWidth, setSearchBarWidth] = useState(0);
  const searchbarContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (searchbarContainerRef.current) {
        setSearchBarWidth(searchbarContainerRef.current.offsetWidth);
      }
    };

    updateWidth(); // Initial width update

    window.addEventListener("resize", updateWidth); // Update width on window resize

    return () => {
      window.removeEventListener("resize", updateWidth); // Cleanup event listener
    };
  }, [showPopover]);

  return (
    <>
      <div className="w-full">
        <div
          className={`flex w-full items-center p-3 web-shadow mobile-view
          cursor`}
          onClick={() => {
            togglePopover();
            setModalOpen(true);
          }}
          ref={searchbarContainerRef}
        >
          <div className="w-6 h-6">{searchIcon}</div>
          <div
            className="w-full ml-5 comman-grey flex items-center"
            id="bell-ic"
          >
            <input
              className="w-full focus:outline-none"
              type="text"
              placeholder="Search here"
              id="bell-ic"
            />
          </div>
        </div>
      </div>

      {showPopover && (
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => {
            togglePopover();
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
});

export default WebSearch;
