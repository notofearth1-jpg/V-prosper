import React from "react";
import Skeleton from "@mui/material/Skeleton";
import BackButton from "../../../components/common/BackButton";
import { RWebShare } from "react-web-share";
import {
  clockIcon,
  padmasanaIcon,
  rupeeIcon,
  shareItemIcon,
} from "../../../assets/icons/SvgIconList";
import CarouselSkeleton from "../../../components/common/skeletons/CarouselSkeleton";
import { randomIntFromInterval } from "../../../utils/AppFunctions";
function ProductServiceDetailSkeleton() {
  return (
    <div className="w-full">
      <div className="flex justify-between comman-padding items-center">
        <BackButton />
        <RWebShare
          data={{
            text: "Yoga Details",
            title: "Yoga Details",
          }}
        >
          <div className="w-5 h-5">{shareItemIcon}</div>
        </RWebShare>
      </div>
      <div className="">
        <CarouselSkeleton />
      </div>

      <div className="service-description comman-padding">
        <div className="top w-full flex items-center justify-center">
          <div className="flex w-full items-center">
            <div className="w-9	h-[29px]">{padmasanaIcon}</div>
            <Skeleton
              variant="text"
              className="ml-2"
              width={70}
              sx={{ fontSize: 20 }}
            />
          </div>
          <p className="mx-2">|</p>
          <div className="flex w-full items-center">
            <div className="w-8 h-[29px]">{clockIcon}</div>
            <div>
              <Skeleton
                variant="text"
                className="ml-2"
                width={80}
                sx={{ fontSize: 20 }}
              />
            </div>
          </div>
          <p className="mx-2">|</p>
          <div className="flex w-full items-center">
            <div className="w-5 h-5">{rupeeIcon}</div>
            <div>
              <Skeleton
                variant="text"
                className="ml-2"
                width={70}
                sx={{ fontSize: 20 }}
              />
            </div>
          </div>
        </div>
        {/* DESCRIPTION */}
        <div className="top">
          <div className="w-full flex">
            <Skeleton variant="text" width={250} sx={{ fontSize: 20 }} />
          </div>
        </div>
        <div className="top flex justify-around items-center w-full overflow-x-scroll">
          <Skeleton variant="rounded" width={122} height={98} />
          <Skeleton variant="rounded" width={122} height={98} />
          <Skeleton variant="rounded" width={122} height={98} />
        </div>
        <div className="top">
          <Skeleton variant="text" width={122} sx={{ fontSize: 20 }} />
          <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
          <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
          <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
          <Skeleton variant="text" className="w-full" sx={{ fontSize: 16 }} />
        </div>
        <div className="top">
          <Skeleton variant="text" width={110} sx={{ fontSize: 20 }} />
          <Skeleton variant="text" width={150} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={150} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={150} sx={{ fontSize: 16 }} />
        </div>

        <div className="top">
          <Skeleton variant="text" width={120} sx={{ fontSize: 20 }} />
          <Skeleton variant="text" width={180} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={180} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={180} sx={{ fontSize: 16 }} />
        </div>

        <div className="top">
          <Skeleton variant="text" width={130} sx={{ fontSize: 20 }} />
          <Skeleton variant="text" width={240} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={240} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={240} sx={{ fontSize: 16 }} />
        </div>
        {/* FAQS */}
        <div className="top">
          <Skeleton variant="text" width={122} sx={{ fontSize: 26 }} />
          <div className="top">
            {[...Array(7)].map((x, index) => (
              <>
                <Skeleton
                  key={index}
                  variant="rectangular"
                  className="w-full mb-2"
                  height={62}
                />
              </>
            ))}
          </div>
        </div>

        {/* RATINGS */}
        <div className="top">
          <Skeleton variant="text" width={80} sx={{ fontSize: 20 }} />
          {[...Array(5)].map((x, index) => (
            <div>
              <Skeleton
                key={index}
                variant="rectangular"
                className="w-full mb-2"
                height={26}
              />
            </div>
          ))}
        </div>

        {/* REVIEWS */}
        <div className="top">
          {[...Array(6)].map((x, index) => (
            <>
              <div key={index} className="flex justify-between items-center">
                <div>
                  <Skeleton variant="text" width={140} sx={{ fontSize: 26 }} />
                  <Skeleton variant="text" width={100} sx={{ fontSize: 16 }} />
                </div>
                <div className="flex items-center p-1 border rounded-md  justify-center">
                  <Skeleton variant="rectangular" height={38} width={44} />
                </div>
              </div>
              {[...Array(randomIntFromInterval(1, 4))].map((x, index) => (
                <>
                  <Skeleton
                    key={index}
                    variant="text"
                    className="w-full"
                    sx={{ fontSize: 20 }}
                  />
                  <Skeleton
                    variant="text"
                    className="w-full"
                    sx={{ fontSize: 20 }}
                  />
                </>
              ))}
            </>
          ))}
        </div>

        <div className="buttons w-full trainer-Certificates-buttons">
          <Skeleton variant="rounded" sx={{ borderRadius: 50 }} height={44} />
        </div>
      </div>
    </div>
  );
}

export default ProductServiceDetailSkeleton;
