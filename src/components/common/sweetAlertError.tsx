import React, { useEffect } from "react";
import ICSweetAlert from "./SweetAlert";

interface ISweetAlertErrorProps {
  message: string;
}

export const SweetAlertError: React.FC<ISweetAlertErrorProps> = ({
  message,
}) => {
  useEffect(() => {
    const type = "error";
    if (message) {
      ICSweetAlert({ type, message });
    }
  }, [message]);

  return null;
};
