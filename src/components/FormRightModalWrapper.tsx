import React from "react";
import { closeIcon } from "../assets/icons/SvgIconList";
import FormFooter, { IFormFooterProps } from "./FormFooter";

interface IFormRightModalWrapper {
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  containerClassName?: string;
  footer?: IFormFooterProps;
}

const FormRightModalWrapper = (props: IFormRightModalWrapper) => {
  return (
    <div className="absolute top-0 right-0 transition-opacity w-full">
      <div className="relative flex justify-end">
        <div
          className="absolute bg-skin-disabled opacity-40 top-0 right-0 h-full w-full cursor"
          onClick={() => props.onClose()}
        ></div>
        <div
          className={`z-10 bg-skin-form h-screen border shadow-md w-80 ${props.containerClassName}`}
        >
          <div className="h-full flex flex-col">
            <div className="px-3 py-3 flex justify-between ">
              <div className="flex space-x-2">
                <div className="typo-form-title uppercase">{props.title}</div>
                <div className="typo-form-title capitalize ">{`${
                  props.subTitle ? `(${props.subTitle})` : ""
                }`}</div>
              </div>
              <button
                onClick={() => props.onClose()}
                className="cursor text-skin-text-form-right-modal items-center justify-center flex bg-transparent hover:bg-skin-hover-form-right-modal hover:text-skin-hover-text-form-right-modal rounded-lg w-8 h-8"
              >
                {closeIcon}
              </button>
            </div>
            <div className="px-3 py-3 flex-1 overflow-y-auto">
              {props.children}
            </div>
            {props.footer && <FormFooter {...props.footer} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRightModalWrapper;
