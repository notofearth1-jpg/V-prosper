import React, { useEffect, useState } from "react";
import { IRevenueReport, getReportById } from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import RevenueReportSkeleton from "../skelton-report/RevenueReportSkeleton";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import ReportTileView from "./ReportTileView";

const RevenueReportView = () => {
  const { t } = UseTranslationHook();
  const [revenueReport, setRevenueReport] = useState<IRevenueReport | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const fetchRevenueReport = async () => {
    const data = await getReportById(REPORT_ID.TotalRevenue, setLoading);
    if (data) {
      setRevenueReport(data);
    }
  };
  useEffect(() => {
    fetchRevenueReport();
  }, []);

  return loading ? (
    <RevenueReportSkeleton />
  ) : (
    <div className="bg-[#DCFCE7] comman-padding rounded-2xl">
      <h1 className="comman-black-big mb-3">{t("revenue")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReportTileView
          title={t("current_month")}
          total={
            revenueReport ? revenueReport.p_service_current_month_revenue : 0
          }
          className={"bg-[#B8F1CC]"}
          growth={
            revenueReport
              ? revenueReport.p_service_revenue_growth_percentage
              : 0
          }
          currency_sign={true}
        />
        <ReportTileView
          title={t("total")}
          className={"bg-[#B8F1CC]"}
          total={revenueReport ? revenueReport.p_total_revenue : 0}
          currency_sign={true}
        />
      </div>
    </div>
  );
};

export default RevenueReportView;
