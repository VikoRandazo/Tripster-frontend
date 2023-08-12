import { useState, useEffect } from "react";
import { BREAKPOINTS } from "./devices";

export const useResponsive = () => {
  const [device, setDevice] = useState<string>("desktop");

  useEffect(() => {
    const handleResize = () => {
      const { mobile, tablet, desktop } = BREAKPOINTS;
      const windowWidth = window.innerWidth;
      if (windowWidth <= mobile) {
        setDevice("mobile");
      } else if (windowWidth > mobile && windowWidth < desktop) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
};
