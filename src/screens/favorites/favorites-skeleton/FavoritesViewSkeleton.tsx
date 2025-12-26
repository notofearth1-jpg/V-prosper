import Skeleton from "@mui/material/Skeleton";

const FavoritesViewSkeleton = () => {
  return (
    <div className="col-span-12  md:col-span-6 lg:col-span-4">
      <div className="image relative">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={`w-full`}
          height={320}
        />
      </div>
      <div className="w-auto flex items-center mt-3">
        <div>
          <Skeleton variant="text" animation="wave" width={36} height={21} />
        </div>
        <p className="mx-2 whitespace-nowrap">
          <Skeleton variant="text" animation="wave" width={60} height={21} />
        </p>
      </div>
    </div>
  );
};
export default FavoritesViewSkeleton;
