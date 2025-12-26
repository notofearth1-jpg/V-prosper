import Skeleton from "@mui/material/Skeleton";

const PremiumPackageSkeleton = () => {
  return (
    <div className="border-library p-2  w-full h-20  overflow-hidden col-span-1 grid grid-cols-3">
      <div className="col-span-2 flex flex-col justify-between text-wrap">
        <div>
          <Skeleton
            variant="text"
            animation="wave"
            width={`w-full`}
            height={20}
          />
        </div>
        <div>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="flex">
        <div>
          <>
            <p className="mx-1">
              <Skeleton
                variant="text"
                animation="wave"
                width={39}
                height={26}
              />
            </p>
            <p className="mx-1">
              <Skeleton
                variant="text"
                animation="wave"
                width={39}
                height={20}
              />
            </p>
          </>
        </div>
      </div>
    </div>
  );
};
export default PremiumPackageSkeleton;
