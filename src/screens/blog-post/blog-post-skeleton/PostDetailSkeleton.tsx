import React from "react";
import Skeleton from "@mui/material/Skeleton";
import CarouselSkeleton from "../../../components/common/skeletons/CarouselSkeleton";

function PostDetailSkeleton() {
  return (
    <div>
      <CarouselSkeleton />
      <Skeleton
        variant="text"
        className=" mr-2 ml-2"
        width={260}
        sx={{ fontSize: 24 }}
      />
      <Skeleton
        variant="text"
        className=" mr-2 ml-2 bg"
        width={100}
        sx={{ fontSize: 16 }}
      />
      <div className="mt-8 mr-2 ml-2">
        <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
        <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
        <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
      </div>
      <div className="mt-4 mr-2 ml-2 ">
        <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
      </div>
    </div>
  );
}

export default PostDetailSkeleton;
