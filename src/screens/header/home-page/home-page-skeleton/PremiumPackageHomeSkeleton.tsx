import React from "react";
import Skeleton from "@mui/material/Skeleton";

function PremiumPackageHomeSkeleton() {
  return (
    <>
      <div className="mt-1">
        <Skeleton
          variant="text"
          width={180}
          sx={{ fontSize: 24, marginBottom: 2 }}
        />
      </div>
      <div className="overflow-x-auto remove-scrollbar-width whitespace-no-wrap ">
        <div className="flex">
          {[...Array(15)].map((x, index) => (
            <Skeleton
              variant="rounded"
              width={280}
              height={80}
              className="flex-none mr-4 overflow-hidden"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default PremiumPackageHomeSkeleton;
