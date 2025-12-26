import React from "react";
import Skeleton from "@mui/material/Skeleton";

function HorizontalScrollRoundedCardSkeleton({
  width = 186,
  height = 160,
  fontSize = 16,
}) {
  return (
    <div className={`overflow-x-auto whitespace-no-wrap mt-2 mb-2`}>
      <div className="flex ">
        {[...Array(10)].map((x, index) => (
          <div className="flex-col ml-4 mr-2 items-center justify-center ">
            <Skeleton variant="rounded" height={height} width={width} />
            <Skeleton
              variant="text"
              width={(width * 6) / 9}
              sx={{ fontSize: fontSize }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalScrollRoundedCardSkeleton;
