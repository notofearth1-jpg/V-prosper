import { useEffect, useState } from "react";
import { isMobileDevice } from "../utils/AppFunctions";

const UseMobileLayoutHook = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile };
};

export default UseMobileLayoutHook;
