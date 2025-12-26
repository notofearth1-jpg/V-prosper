import Skeleton from "@mui/material/Skeleton";

const GrievanceTopView = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <p className="ml-4">
          <Skeleton variant="text" animation="wave" width={102} height={26} />
        </p>
      </div>
      <div className="mt-2 ml-2">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={28}
          height={28}
        />
      </div>
    </div>
  );
};
export default GrievanceTopView;
