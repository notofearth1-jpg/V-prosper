import React, { FC } from "react";
import Modal from "react-responsive-modal";
import { exitArrow } from "../../assets/icons/SvgIconList";
interface IImageComponentProps {
  open: boolean;
  onClose: () => void;
  ImgFile: string;
}

const ImageComponent: FC<IImageComponentProps> = ({
  open,
  onClose,
  ImgFile,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: "custom-modal" }}
    >
      <div onClick={onClose} className="m-4 w-7 cursor">
        {exitArrow}
      </div>

      <div className=" flex h-full justify-center items-center">
        <img src={ImgFile} alt="" className="w-full" />
      </div>
    </Modal>
  );
};

export default ImageComponent;
