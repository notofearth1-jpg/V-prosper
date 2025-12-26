import React, { useEffect, useState } from "react";
import { ISessionReport, getReportById } from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import ReportTileView from "./ReportTileView";
import SessionReportSkeleton from "../skelton-report/SessionReportSkeleton";

const SessionReportView = () => {
  const { t } = UseTranslationHook();
  const [sessionReport, setSessionReport] = useState<ISessionReport | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const fetchSessionReport = async () => {
    const data = await getReportById(REPORT_ID.TotalSession, setLoading);
    if (data) {
      setSessionReport(data);
    }
  };
  useEffect(() => {
    fetchSessionReport();
  }, []);

  return loading ? (
    <SessionReportSkeleton />
  ) : (
    <div className="bg-[#FEEAE6] comman-padding rounded-2xl">
      <h1 className="comman-black-big mb-3">{t("session")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReportTileView
          title={t("current_month")}
          total={sessionReport ? sessionReport.p_current_month_sessions : 0}
          className={"bg-[#FFBBAB]"}
          growth={sessionReport ? sessionReport.p_session_growth_percentage : 0}
        />
        <ReportTileView
          title={t("total")}
          className={"bg-[#FFBBAB]"}
          total={sessionReport ? sessionReport.p_total_sessions : 0}
        />
      </div>
    </div>
  );
};

export default SessionReportView;
