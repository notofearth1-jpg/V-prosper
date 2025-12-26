import React from "react";
import Swal from "sweetalert2";
interface ISweetAlertProps {
  type: "success" | "error" | "info" | any; // Add more types if needed
  message: string;
}
const ICSweetAlert: React.FC<ISweetAlertProps> = ({ type, message }) => {
  let icon = "";
  switch (type) {
    case "success":
      icon = "success";
      break;
    case "error":
      icon = "error";
      break;
    // Add more cases for different types if needed
    default:
      icon = "info";
  }
  Swal.fire({
    icon: type,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    text: message,
    timer: 2000,
  });
  return null;
};
export default ICSweetAlert;
