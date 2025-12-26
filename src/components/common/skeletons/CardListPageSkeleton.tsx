import React from "react";
import Skeleton from "@mui/material/Skeleton";

function CardListPageSkeleton() {
  return (
    <div className="m-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {[...Array(20)].map((x, index) => (
        <div key={index}>
          <div className="w-full aspect-16/9 p-1">
            <Skeleton width={"100%"} height={"100%"} variant="rounded" />
          </div>
          <Skeleton variant="text" sx={{ fontSize: 24 }} />
        </div>
      ))}
    </div>
  );
}

export default CardListPageSkeleton;
