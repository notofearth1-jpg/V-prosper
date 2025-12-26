import Skeleton from "@mui/material/Skeleton";

function MonthlyRevenueReportSkeleton({ height }: { height?: number }) {
  return (
    <Skeleton
      className="rounded-2xl"
      variant="rectangular"
      height={height || 390}
    />
  );
}

export default MonthlyRevenueReportSkeleton;
