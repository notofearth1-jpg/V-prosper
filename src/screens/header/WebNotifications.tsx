import React, { forwardRef, useState } from "react";
import {
  hartIcon,
  notificationsIcon,
  searchCloseIcon,
} from "../../assets/icons/SvgIconList";

const WebNotifications = forwardRef<
  HTMLDivElement,
  {
    showPopover: boolean;
    togglePopover: () => void;
    CommanRef: React.RefObject<HTMLDivElement>;
  }
>(({ showPopover, togglePopover, CommanRef }) => {
  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={togglePopover}
        className="p-2  rounded-full focus:outline-none "
        id="bell-ic"
      >
        <div className="w-7 h-7">{notificationsIcon}</div>
      </button>

      {showPopover && (
        <>
          <div className="triangle right-[80px] top-16 sm:top-[63px] "></div>
          <div
            className="origin-top-right absolute  right-5 mt-8  rounded-lg shadow-lg overflow-y-scroll bg-skin-background p-2  w-[90%] sm:w-96 notification-cal-hight z-40"
            ref={CommanRef}
          >
            <div className="p-2 border-b-2 flex items-center justify-between">
              <div className="mr-auto font-bold">Notifications</div>
              <div
                className="ml-auto cursor-pointer w-7 h-7"
                onClick={togglePopover}
              >
                {searchCloseIcon}
              </div>
            </div>

            <div className="p-4 border-b-2 flex w-full content-center space-x-4 cursor-pointer ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>

            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
            <div className="p-4 border-b-2 flex w-full content-center space-x-4 ">
              <div className="w-[30px] h-[30px]">{hartIcon}</div>
              <p className="text-sm ">You have a new notification!</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default WebNotifications;
