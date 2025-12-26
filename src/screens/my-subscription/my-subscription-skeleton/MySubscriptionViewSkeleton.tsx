import Skeleton from "@mui/material/Skeleton";

const MySubscriptionViewSkeleton = () => {
  return (
    <div className="flex p-2 space-x-2.5 items-center">
      <div>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={64}
          height={64}
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-wrap">
            <div>
              <Skeleton
                variant="text"
                animation="wave"
                width={152}
                height={26}
              />
            </div>
            <div>
              <Skeleton
                variant="text"
                animation="wave"
                width={152}
                height={20}
              />
            </div>
            <div>
              <Skeleton
                variant="text"
                animation="wave"
                width={152}
                height={20}
              />
            </div>
          </div>
          <div className="flex">
            <div>
              <Skeleton
                variant="text"
                animation="wave"
                width={63}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MySubscriptionViewSkeleton;
