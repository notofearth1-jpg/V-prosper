import React, { useState, useEffect } from "react";
import ICButton from "../../core-component/ICButton";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { TReactSetState } from "../../data/AppType";
import { crossRemove } from "../../assets/icons/SvgIconList";

interface IICCustomModalProps {
  title: string;
  content: JSX.Element;
  isModalShow: boolean;
  setIsModalShow: TReactSetState<boolean>;
  handleCloseButton?: () => void;
  customWidth?: boolean;
}

const ICCommonModal: React.FC<IICCustomModalProps> = ({
  title,
  content,
  isModalShow,
  setIsModalShow,
  handleCloseButton,
  customWidth,
}) => {
  let timer: NodeJS.Timeout;
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalHeight, setModalHeight] = useState<number | string>("80vh");

  useEffect(() => {
    const calculateModalHeight = () => {
      const screenHeight = window.innerHeight;
      const minHeight = screenHeight * 0.8;
      const contentHeight =
        document.getElementById("modal-content")?.clientHeight || 0;
      const height = contentHeight > minHeight ? "auto" : "80vh";
      setModalHeight(height);
    };

    if (isOpen) {
      calculateModalHeight();
      window.addEventListener("resize", calculateModalHeight);
    }

    return () => {
      window.removeEventListener("resize", calculateModalHeight);
    };
  }, [isOpen]);

  useEffect(() => {
    handleModal(isModalShow);
  }, [isModalShow]);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      !isModalOpen && setIsOpen(false);
    }, 500);
  }, [isModalOpen]);

  const handleModal = (value: boolean) => {
    if (!value) {
      setIsModalOpen(value);
    } else {
      setIsOpen(value);
      setIsModalOpen(value);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-wrapper backdrop-blur-sm !bg-black !bg-opacity-80 relative">
          <div
            className={`${
              isModalOpen
                ? `modal-content-up ${customWidth ? "!max-w-[700px]" : ""}`
                : "modal-content-down"
            }`}
            style={{ height: modalHeight }}
          >
            <div
              className="h-14 w-14 close-model cursor"
              onClick={() =>
                handleCloseButton ? handleCloseButton() : setIsModalShow(false)
              }
            >
              {crossRemove}
            </div>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="comman-black-big comman-padding">{title}</div>
              <div className="w-full message-border-bottom"></div>
              <div className="flex-1 flex flex-col justify-between overflow-y-scroll remove-scrollbar-width comman-padding">
                <div className="flex-1 ">{content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ICCommonModal;
