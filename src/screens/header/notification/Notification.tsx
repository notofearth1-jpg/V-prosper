import React, { useEffect, useState } from "react";
import BottomNavbar from "../../../components/common/BottomNavbar";

const Notifications = () => {
  const [isSvgVisible, setIsSvgVisible] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEndX = event.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 10) {
      // Scrolling right, hide SVG
      setIsSvgVisible(false);
    } else if (deltaX < -10) {
      // Scrolling left, show SVG
      setIsSvgVisible(true);
    }
  };

  return (
    <>
      <div className="main-bg min-h-screen">
        <div className="top">
          <div className="search-container">
            <div className="search-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
              >
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="#555B5B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="#555B5B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              className="w-full common-search flex items-center comman-grey"
              placeholder="Search here"
            />
          </div>
        </div>

        <div className="top comman-black-big">
          <p>Notifications</p>
        </div>
        <div className="mt-2 message-border-bottom"></div>

        <div className="message-container">
          <div
            className="flex items-center scroll-container"
            style={{ overflowX: "auto" }}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
          >
            <div
              className="message-image rounded-full overflow-hidden p-1"
              style={{ display: !isSvgVisible ? "block" : "none" }}
            >
              <img
                src={require("../../../assets/image/home.jpeg")}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="comman-black-text mx-2">
              You’ve got a new message from person 1
            </p>
            <div
              className="grey flex items-center justify-center"
              style={{ display: isSvgVisible ? "" : "none" }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M1 12.5C1 7.07884 1 4.36827 2.68414 2.68414C4.36827 1 7.07884 1 12.5 1C17.9211 1 20.6318 1 22.3158 2.68414C24 4.36827 24 7.07884 24 12.5"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  d="M1 14.8C1 11.5796 1 9.96953 1.62672 8.73953C2.17798 7.6576 3.05763 6.77796 4.13956 6.22669C5.36955 5.59998 6.9797 5.59998 10.2 5.59998H14.8C18.0203 5.59998 19.6305 5.59998 20.8605 6.22669C21.9424 6.77796 22.8221 7.6576 23.3732 8.73953C24 9.96953 24 11.5796 24 14.8C24 18.0203 24 19.6304 23.3732 20.8605C22.8221 21.9424 21.9424 22.822 20.8605 23.3732C19.6305 24 18.0203 24 14.8 24H10.2C6.9797 24 5.36955 24 4.13956 23.3732C3.05763 22.822 2.17798 21.9424 1.62672 20.8605C1 19.6304 1 18.0203 1 14.8Z"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  d="M12.5 11.35V18.25M12.5 18.25L15.375 15.375M12.5 18.25L9.625 15.375"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              className="red flex items-center justify-center "
              style={{ display: isSvgVisible ? "" : "none" }}
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.6306 25H4.6998C3.02549 25 1.66626 23.6382 1.66626 21.9665V3.33557H21.6642V21.9665C21.6642 23.6382 20.3023 25 18.6306 25ZM3.88738 5.55669V21.9638C3.88738 22.4117 4.25193 22.7763 4.6998 22.7763H18.628C19.0759 22.7763 19.4405 22.4117 19.4405 21.9638V5.55669H3.88738Z"
                  fill="white"
                />
                <path
                  d="M22.2191 5.55672H1.11186C0.497344 5.55672 0 5.05937 0 4.44485C0 3.83033 0.497344 3.33299 1.11186 3.33299H22.2217C22.8362 3.33299 23.3335 3.83033 23.3335 4.44485C23.3335 5.05937 22.8336 5.55672 22.2191 5.55672ZM14.4438 2.22373H8.8871C8.27258 2.22373 7.77524 1.72638 7.77524 1.11186C7.77524 0.497344 8.27258 0 8.8871 0H14.4412C15.0557 0 15.5531 0.497344 15.5531 1.11186C15.5531 1.72638 15.0557 2.22373 14.4438 2.22373ZM8.8871 17.7768C8.27258 17.7768 7.77524 17.2795 7.77524 16.6649V9.99896C7.77524 9.38444 8.27258 8.8871 8.8871 8.8871C9.50162 8.8871 9.99896 9.38444 9.99896 9.99896V16.6649C9.99896 17.2795 9.50162 17.7768 8.8871 17.7768ZM14.4438 17.7768C13.8293 17.7768 13.332 17.2795 13.332 16.6649V9.99896C13.332 9.38444 13.8293 8.8871 14.4438 8.8871C15.0583 8.8871 15.5557 9.38444 15.5557 9.99896V16.6649C15.5531 17.2795 15.0557 17.7768 14.4438 17.7768Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        <BottomNavbar />
      </div>
    </>
  );
};

export default Notifications;
