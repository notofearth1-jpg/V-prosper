import React from "react";
import Skeleton from "@mui/material/Skeleton";
import CarouselSkeleton from "../../../components/common/skeletons/CarouselSkeleton";
import {
  clockIcon,
  rupeeIcon,
  vpServiceIcon,
} from "../../../assets/icons/SvgIconList";

function ProductServiceDetailsWebSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="min-h-screen">
        <div className="flex justify-end items-center">
          <Skeleton variant="rectangular" width={5} height={5} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 overflow-x-scroll">
          <div className="service-detail-pic flex flex-col xl:justify-start lg:justify-start col-span-2 justify-center rounded">
            <CarouselSkeleton />
          </div>
          <div className="w-full flex flex-col col-span-3 justify-center xl:p-5">
            <div className="flex justify-start md:justify-center lg:justify-start xl:justify-start">
              <Skeleton variant="text" width={280} sx={{ fontSize: 24 }} />
            </div>
            <div className="flex justify-between top w-full">
              <div className="flex items-center p-1 xl:p-0 border-r-2 w-full">
                <div className="w-10 h-[35px] mr-4">{vpServiceIcon}</div>
                <Skeleton variant="text" width={160} sx={{ fontSize: 24 }} />
              </div>
              <div className="flex items-center p-3 justify-center border-r-2 w-full">
                <div className="w-10 h-[39px] mr-4">{clockIcon}</div>
                <Skeleton variant="text" width={160} sx={{ fontSize: 24 }} />
              </div>
              <div className="flex items-center justify-center w-full">
                <div className="w-6 h-8">{rupeeIcon}</div>
                <Skeleton variant="text" width={160} sx={{ fontSize: 24 }} />
              </div>
            </div>
            <div className="flex overflow-x-scroll top">
              {[...Array(3)].map((x, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  className="w-full mr-5  rounded-xl flex  flex-col p-5"
                  height={98}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col top">
              <div>
                <Skeleton variant="text" width={280} sx={{ fontSize: 28 }} />
                <div>
                  {[...Array(3)].map((x, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width={480}
                      sx={{ fontSize: 20 }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton variant="text" width={280} sx={{ fontSize: 28 }} />
                <div>
                  {[...Array(3)].map((x, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width={440}
                      sx={{ fontSize: 20 }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton variant="text" width={280} sx={{ fontSize: 28 }} />
                <div>
                  {[...Array(3)].map((x, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width={580}
                      sx={{ fontSize: 20 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="top w-full">
        <Skeleton
          variant="text"
          width={122}
          sx={{ fontSize: 26, marginBottom: "15px" }}
        />
        <div className="">
          {[...Array(7)].map((x, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              className="w-full mb-15"
              height={62}
              sx={{ marginBottom: "15px" }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center top">
        <Skeleton
          variant="rounded"
          className="w-1/3"
          sx={{ borderRadius: 50 }}
          height={44}
        />
      </div>
    </div>
  );
}

export default ProductServiceDetailsWebSkeleton;
