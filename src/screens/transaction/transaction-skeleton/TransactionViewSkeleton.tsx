import Skeleton from "@mui/material/Skeleton";

const TransactionViewSkeleton = () => {
  return (
    <div className="booking-card top">
      <div className="comman-padding">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <div className="h-15 w-15">
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={60}
                height={60}
              />
            </div>
            <div className="text-wrap">
              <div>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={152}
                  height={26}
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={152}
                    height={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Skeleton variant="text" animation="wave" width={63} height={26} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionViewSkeleton;