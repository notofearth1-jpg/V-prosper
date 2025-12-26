import React, { useState } from "react";
import useTranslationHook from "../../../hooks/UseTranslationHook";

const FingerprintAnimation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const { t } = useTranslationHook();
  const toggleActive = async () => {
    // setIsActive(!isActive);
    // Toggle animation class after a short delay (adjust the delay as needed)
    // setTimeout(() => {
    //     setAnimationClass(isActive ? '' : 'active');
    // }, 100);

    setAnimationClass("active");
    await new Promise((resolve, _) =>
      setTimeout(() => {
        resolve(null);
      }, 3000)
    );

    setAnimationClass("");
  };

  return (
    <div
      className={`container cursor ${animationClass}`}
      onClick={toggleActive}
    >
      <span className="text font-medium">{t("log_in")}</span>
      <svg
        className={`fingerprint fingerprint-base ${animationClass}`}
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {/* SVG paths go here */}
      </svg>
      <svg
        className={`fingerprint fingerprint-active ${animationClass}`}
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {/* SVG paths go here */}
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="70"
        height="70"
        viewBox="0 0 100 100"
        className={`ok ${animationClass}`}
      >
        <path
          d="M34.912 50.75l10.89 10.125L67 36.75"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
        />
      </svg>
    </div>
  );
};

export default FingerprintAnimation;
