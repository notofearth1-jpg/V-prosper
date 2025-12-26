import Skeleton from "@mui/material/Skeleton";

const BookingListSkeleton = () => {
  return (
    <div className="booking-card mb-4 pb-4">
      <div className="flex p-2 space-x-2.5 items-center">
        <div>
          <Skeleton
            variant="circular"
            animation="wave"
            width={64}
            height={64}
          />
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="text-wrap">
              <div className=" !text-[16px]">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={108}
                  height={20}
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={68}
                    height={16}
                  />
                </div>
                <div>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={30}
                    height={16}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={38}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2">
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
export default BookingListSkeleton;
