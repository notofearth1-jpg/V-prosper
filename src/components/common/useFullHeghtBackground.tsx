import { useEffect, useRef, useState } from "react";

function useFullHeightBackground(ref: React.RefObject<HTMLElement>): boolean {
  const [isFullHeight, setIsFullHeight] = useState(false);

  useEffect(() => {
    const resizeHandler = () => {
      const contentHeight = ref.current?.scrollHeight || 0;
      const screenHeight = window.innerHeight;
      setIsFullHeight(contentHeight < screenHeight);
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ref]);

  return isFullHeight;
}

export default useFullHeightBackground;
