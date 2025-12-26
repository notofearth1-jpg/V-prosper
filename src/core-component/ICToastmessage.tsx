import React from "react";
import ReactDOM from "react-dom";
import ICToast from "./ICToast";

type ToastType = "success" | "error" | "warning" | "info" | any;

const toastContainerId = "toast-container";

const createToastContainer = (position?: string) => {
  const existingContainer = document.getElementById(toastContainerId);
  if (!existingContainer) {
    const container = document.createElement("div");
    container.id = toastContainerId;
    container.style.position = "fixed";
    container.style.zIndex = "100";

    if (position === "top-right") {
      container.style.top = "10px";
      container.style.right = "10px";
    } else if (position === "top-left") {
      container.style.top = "10px";
      container.style.left = "10px";
    } else if (position === "bottom-right") {
      container.style.bottom = "10px";
      container.style.right = "10px";
    } else if (position === "bottom-left") {
      container.style.bottom = "10px";
      container.style.left = "10px";
    } else {
      container.style.top = "10px";
      container.style.right = "10px";
    }

    document.body.appendChild(container);
  }
};
const ICToastmessage = (
  type: ToastType,
  message: string,
  duration?: number,
  position?: string
) => {
  createToastContainer(position);

  const toastElement = (
    <ICToast
      type={(type.charAt(0).toUpperCase() + type.slice(1)) as ToastType}
      message={message}
      duration={duration || 3000}
    />
  );

  const container = document.getElementById(toastContainerId);
  if (container) {
    const toastWrapper = document.createElement("div");
    container.appendChild(toastWrapper);
    ReactDOM.render(toastElement, toastWrapper);

    // setTimeout(() => {
    //   ReactDOM.unmountComponentAtNode(toastWrapper);
    //   container.removeChild(toastWrapper);
    // }, duration || 3000);
  }
};

export default ICToastmessage;
