import Skeleton from "@mui/material/Skeleton";

const GrievanceViewSkeleton = () => {
  return (
    <div>
      <div>
        <div>
          <div className="flex justify-between mt-4 p-4 rounded-lg shadow-lg border">
            <div id="first-div" className="items-center justify-center">
              <p className="capitalize">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={52}
                  height={26}
                />
              </p>
              <p>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={126}
                  height={20}
                />
              </p>
            </div>
            <div id="second-div" className="flex flex-col justify-center">
              <p>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={78}
                  height={20}
                />
              </p>
              <div className="flex flex-row items-center ">
                <p className="text-xs mt-1">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={78}
                    height={20}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GrievanceViewSkeleton;
