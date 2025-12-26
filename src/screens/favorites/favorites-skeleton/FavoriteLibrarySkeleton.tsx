import Skeleton from "@mui/material/Skeleton";

const FavoriteLibrarySkeleton = () => {
  return (
    <div className="mb-5">
      <div className="border-library relative">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={`w-full`}
          height={160}
        />
      </div>
      <p>
        <Skeleton
          variant="text"
          animation="wave"
          width={`w-full`}
          height={21}
        />
      </p>
    </div>
  );
};
export default FavoriteLibrarySkeleton;
