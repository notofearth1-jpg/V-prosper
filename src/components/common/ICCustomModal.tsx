import React, { useState, useEffect } from "react";
import ICButton from "../../core-component/ICButton";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { TReactSetState } from "../../data/AppType";
import { crossRemove } from "../../assets/icons/SvgIconList";

interface IICCustomModalProps {
  title: string;
  content: JSX.Element;
  buttonTitle: string | JSX.Element;
  isModalShow: boolean;
  setIsModalShow: TReactSetState<boolean>;
  handleSubmitButton: () => void;
  handleCloseButton?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  showLoading?: boolean;
}

const ICCustomModal: React.FC<IICCustomModalProps> = ({
  title,
  content,
  buttonTitle,
  isModalShow,
  setIsModalShow,
  handleSubmitButton,
  handleCloseButton,
  disabled,
  isActive,
  showLoading,
}) => {
  let timer: NodeJS.Timeout;
  const { t } = UseTranslationHook();
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
                ? `${isActive ? `!bg-skin-insights-card` : ""} modal-content-up`
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
            <div
              className={`${isActive ? `!bg-skin-insights-card` : ""} h-full`}
            >
              <div
                className={`${
                  isActive ? `!text-skin-insights` : ""
                } comman-black-big comman-padding`}
              >
                {title}
              </div>
              <div
                className={`w-full ${
                  isActive ? "border-white" : `message-border-bottom`
                }`}
              ></div>
              <div className="flex flex-col justify-between h-full">
                <div className="flex-1 overflow-scroll comman-padding remove-scrollbar-width">
                  {content}
                </div>
                <div className="w-full md:mt-0 mb-14 comman-padding">
                  <ICButton
                    children={buttonTitle}
                    onClick={() => handleSubmitButton()}
                    className={`mr-2 ${
                      disabled
                        ? "cursor-not-allowed comman-disablebtn"
                        : `${
                            isActive
                              ? `!bg-black hover:!bg-skin-insights-card`
                              : `comman-btn`
                          }`
                    }`}
                    disabled={disabled}
                    loading={showLoading}
                  ></ICButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ICCustomModal;
