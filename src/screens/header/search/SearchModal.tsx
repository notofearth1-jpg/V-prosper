import React, { useRef, useEffect } from "react";
import Search from "./Search";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="sm:w-3/4 xl:w-2/3    h-4/5 flex flex-col items-center overflow-hidden rounded-xl"
      >
        <div className="main-bg flex justify-center w-full items-center rounded-lg overflow-auto">
          <Search onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
