import React from "react";
import Skeleton from "@mui/material/Skeleton";
import CarouselSkeleton from "../../common/skeletons/CarouselSkeleton";

function EventDetailSkeleton() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <>
        <div className="top w-full xl:w-1/2">
          <CarouselSkeleton />
        </div>
        <div className="event-description flex flex-col justify-center w-full xl:w-1/2 comman-padding top">
          <div className="flex items-center  justify-between">
            <Skeleton variant="text" width={140} sx={{ fontSize: 26 }} />
            <div className="flex justify-end w-full">
              <Skeleton variant="text" width={140} sx={{ fontSize: 26 }} />
            </div>
          </div>
          <div className="top  flex flex-col relative justify-between">
            {/* DESCRIPTION */}
            <Skeleton variant="text" width={180} sx={{ fontSize: 26 }} />

            <Skeleton variant="text" className="w-full" sx={{ fontSize: 20 }} />
            <Skeleton variant="text" className="w-full" sx={{ fontSize: 20 }} />

            {/* TIME AND DATE */}
            <div className="top">
              <Skeleton variant="text" width={260} sx={{ fontSize: 20 }} />
              <Skeleton variant="text" width={260} sx={{ fontSize: 20 }} />
              <Skeleton variant="text" width={200} sx={{ fontSize: 20 }} />
            </div>
            {/* VENUE */}
            <div className="top">
              <Skeleton variant="text" width={320} sx={{ fontSize: 20 }} />
            </div>
            {/* MAP  */}
            <div className="top">
              <Skeleton variant="rectangular" height={450} className="w-full" />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default EventDetailSkeleton;
