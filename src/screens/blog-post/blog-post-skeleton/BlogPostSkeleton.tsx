import React from "react";
import Skeleton from "@mui/material/Skeleton";
import CarouselSkeleton from "../../../components/common/skeletons/CarouselSkeleton";
function blogPostSkeleton() {
  return (
    <>
      {[...Array(5)].map((x, i) => (
        <div key={i} className="post-container mb-14">
          <div className="flex items-center m-3">
            <div className="post-image rounded-full overflow-hidden  ">
              <Skeleton
                variant="circular"
                width={70}
                height={70}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="comman-black-text mx-3">
              <Skeleton variant="text" width={100} sx={{ fontSize: 16 }} />
              <Skeleton variant="text" width={100} sx={{ fontSize: 16 }} />
            </div>
          </div>
          <CarouselSkeleton />
          <div className="flex m-2 items-center like-container ">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton
              variant="circular"
              className="ml-2"
              width={24}
              height={24}
            />
          </div>
          <div className=" m-2 p-1">
            <Skeleton variant="text" width={40} sx={{ fontSize: 14 }} />
            <Skeleton variant="text" sx={{ fontSize: 14 }} />
            <Skeleton variant="text" sx={{ fontSize: 14 }} />
          </div>
        </div>
      ))}
    </>
  );
}

export default blogPostSkeleton;
