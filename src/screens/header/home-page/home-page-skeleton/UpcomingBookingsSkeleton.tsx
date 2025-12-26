import React from "react";
import Skeleton from "@mui/material/Skeleton";

function UpcomingBookingsSkeleton() {
  return (
    <div>
      <Skeleton
        variant="rounded"
        width={"100%"}
        height={56}
        sx={{ flexDirection: "flex-col" }}
      >
        <Skeleton variant="circular" />
        <Skeleton variant="text" sx={{ fontSize: 16 }} />
        <Skeleton variant="text" sx={{ fontSize: 24 }} />
      </Skeleton>
    </div>
  );
}

export default UpcomingBookingsSkeleton;
