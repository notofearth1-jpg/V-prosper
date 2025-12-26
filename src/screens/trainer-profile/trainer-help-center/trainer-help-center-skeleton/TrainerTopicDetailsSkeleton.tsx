import Skeleton from "@mui/material/Skeleton";

const TrainerTopicDetailsSkeleton = () => {
  return (
    <div className={`comman-padding md:w-3/4 lg:w-1/2 w-full`}>
      <div className="flex items-center">
        <div className="ml-5">
          <Skeleton variant="text" animation="wave" width={41} height={26} />
        </div>
      </div>

      <div className=" top">
        <Skeleton
          variant="text"
          animation="wave"
          width={`w-full`}
          height={40}
        />
      </div>

      <div className="top">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={`w-full`}
          height={340}
        />
      </div>

      <div className="top">
        <p>
          <Skeleton
            variant="text"
            animation="wave"
            width={`w-full`}
            height={20}
          />

          <div className="top recent-container flex flex-wrap">
            <div className=" flex items-center justify-center m-1">
              <p className="mx-2">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={68}
                  height={31}
                />
              </p>
            </div>
          </div>
        </p>
      </div>
    </div>
  );
};

export default TrainerTopicDetailsSkeleton;
