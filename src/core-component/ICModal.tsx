import React from "react";

interface ICustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: "error" | "warning" | "default" | "info";
  title?: string;
  message: string;
  className?: string;
  btn1?: string;
  btn2?: string;
}

const ICModal: React.FC<ICustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  className,
  btn1 = "yes",
  btn2 = "No",
  ...inputProps
}) => {
  if (!isOpen) return null;

  let logoUrl: string | undefined;

  if (type === "error") {
    logoUrl = "https://img.icons8.com/color/48/000000/cancel--v1.png";
  } else if (type === "warning") {
    logoUrl = "https://img.icons8.com/emoji/48/warning-emoji.png";
  } else if (type === "info") {
    logoUrl = "https://img.icons8.com/ios/50/info--v1.png";
  }

  return (
    <div className={`modal-overlay-model ${className} `} {...inputProps}>
      <div className="modal-custom">
        <div className="custom-modal-div">
          <h2 className="title-custom-model">{title}</h2>
          <button className="close-button-model" onClick={onClose}>
            &times;
          </button>
        </div>
        <hr className="button-horizontal-line-space" />
        <div className="logo-container">
          {logoUrl && <img src={logoUrl} alt="Logo" />}
        </div>
        <p className="message-custom-model">{message}</p>
        <div className="button-container-model">
          {type !== "info" ? (
            <>
              <button className="confirm-button-model" onClick={onConfirm}>
                {btn1}
              </button>
              <button className="cancel-button-model" onClick={onClose}>
                {btn2}
              </button>
            </>
          ) : (
            <button className="confirm-button-model" onClick={onConfirm}>
              Ok
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ICModal;
