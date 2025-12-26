import React from "react";
import Skeleton from "@mui/material/Skeleton";

function CarouselSkeleton() {
  return (
    <>
      <div className="flex items-center justify-center mt-8">
        <Skeleton variant="rounded" width={400} height={400} />
      </div>
      <div className="flex flex-row justify-center items-center mt-8 mb-6 ">
        <Skeleton
          variant="circular"
          className="mr-1 ml-1"
          width={10}
          height={10}
        />
        <Skeleton
          variant="circular"
          className="mr-1 ml-1"
          width={10}
          height={10}
        />
        <Skeleton
          variant="circular"
          className="mr-1 ml-1"
          width={10}
          height={10}
        />
      </div>
    </>
  );
}

export default CarouselSkeleton;
