import React, { useEffect, useState } from "react";

interface IToastProps {
  type: "Success" | "Error" | "Warning" | "Info";
  message: string;
  duration: number;
}

const ICToast: React.FC<IToastProps> = ({ type, message, duration }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [closed, setClosed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredProgress, setHoveredProgress] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverStart, setHoverStart] = useState<number | null>(null);
  const [totalRemainingSecond, setTotalRemainingSecond] = useState(duration);
  const [lastHoverTime, setLastHoverTime] = useState(new Date().getTime());
  const [swiped, setSwiped] = useState(false);
  const getBackgroundColor = () => {
    switch (type) {
      case "Success":
        return "#4caf50";
      case "Error":
        return "red";
      case "Warning":
        return "orange";
      case "Info":
        return "#00000094";
      default:
        return "#4caf50";
    }
  };

  var srcImage = "";
  if (type == "Info") {
    srcImage = "https://img.icons8.com/plumpy/24/info.png";
  } else if (type == "Success") {
    srcImage = "https://img.icons8.com/color/48/000000/ok--v1.png";
  } else if (type == "Error") {
    srcImage = "https://img.icons8.com/fluency/48/000000/high-importance.png";
  } else if (type == "Warning") {
    srcImage = "https://img.icons8.com/color/48/000000/error--v1.png";
  } else {
    srcImage = "https://img.icons8.com/color/48/000000/ok--v1.png";
  }

  const toastClasses = ["toast", `toast-${type}`];
  const toastStyles = {
    // backgroundColor: getBackgroundColor(),
    backgroundColor: "white",
    borderRadius: "3px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 2px",
    width: "250px",
    // zIndex: 100,
  };
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  useEffect(() => {

    if (timer) {
      clearTimeout(timer);
    }
    if (hovered) {

      setTotalRemainingSecond(
        totalRemainingSecond - (new Date().getTime() - lastHoverTime)
      );
    }

    if (!hovered) {
      setLastHoverTime(new Date().getTime());
      const tempTimer: NodeJS.Timeout = setTimeout(() => {
        // clearInterval(intervalId);
        setClosed(true);
      }, totalRemainingSecond);
      setTimer(tempTimer);
    }
    if (duration && !closed) {
      if (hovered == !true) {
        const interval = 10; // Update the progress every 10ms
        const increment = (100 / duration) * interval;

        const intervalId = setInterval(() => {
          setProgress((prevProgress) => prevProgress - increment);

        }, interval);
        return () => {
          clearInterval(intervalId);
        };
      } else {
        // duration += hoverTime * 1000;
      }
    } else {
    }
  }, [duration, closed, hovered]);

  useEffect(() => {
    if (hoverStart !== null) {
      const interval2 = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - hoverStart) / 1000);
        setHoverTime(elapsedSeconds);

      }, 1000);
      return () => {
        clearInterval(interval2);
      };
    }
  }, [hoverStart]);
  const progressBarStyles = {
    width: `${progress}%`,
    // backgroundColor: "white",
    backgroundColor: getBackgroundColor(),
    height: "4px",
  };

  const handleCloseClick = () => {
    setClosed(true);
  };

  if (closed) {
    return null;
  }
  const handleMouseEnter = () => {
    setHovered(true);

    setHoverStart(new Date().getTime());
  };

  const handleMouseLeave = () => {
    setHovered(false);

    setHoverStart(null);
    // setHoverTime(0);
  };

  const handleSwipeLeft = () => {
    setSwiped(true);
  };

  const handleSwipeRight = () => {
    setSwiped(false);
  };

  const containerStyles = {
    // ... (Your other styles)
    // transform: `translateX(${swiped ? "-100%" : "0"})`, // Apply the transform based on swiped state
  };

  return (
    <div
      className={` animate-pulse  pt-1 mb-2 border cursor-pointer tost-container-for rounded-2  ${toastClasses.join(
        " "
      )}`}
      style={{ ...toastStyles, ...containerStyles }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleSwipeLeft} // Handle touch swipe
      onTouchEnd={handleSwipeRight} // Handle touch swipe
    >
      <div className="px-2 pt-1 toast-header">
        <button
          type="button"
          className="close-toast-button "
          aria-label="Close"
          onClick={handleCloseClick}
        >
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/ios-filled/50/444444/delete-sign--v1.png"
            alt="delete-sign--v1"
          />
        </button>
      </div>
      <div className="px-4 pb-3 flex items-center">
        <img width="23" height="23" src={srcImage} alt="ok--v1" />
        <div className="toast-body flex items-center px-2 text-sm">
          {message}
        </div>
      </div>
      {duration && <div style={progressBarStyles}></div>}
    </div>
  );
};

export default ICToast;
