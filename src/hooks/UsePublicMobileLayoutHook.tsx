import { useEffect, useState } from "react";
import { isMobileDevice } from "../utils/AppFunctions";

type DeviceType = "Mobile" | "Tablet" | "Laptop" | "Desktop";

const UsePublicDeviceTypeHook = (): { deviceType: DeviceType } => {
    const getDeviceType = (): DeviceType => {
        const isMobile: boolean = isMobileDevice();
        if (isMobile) {
            // Determine if it's a tablet or phone based on screen width
            const width: number = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width <= 768) {
                return "Mobile";
            } else {
                return "Tablet";
            }
        } else {
            // For non-mobile devices, we'll consider it a laptop or desktop
            // Additional check for screen width to distinguish laptop from desktop
            const width: number = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width <= 1024) {
                return "Laptop";
            } else {
                return "Desktop";
            }
        }
    };
    const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());

    useEffect(() => {
        const handleResize = () => {
            setDeviceType(getDeviceType());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);



    return { deviceType };
};

export default UsePublicDeviceTypeHook;
