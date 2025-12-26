import React, { useEffect, useMemo, useState } from "react";
import {
  ICategoryWiseSession,
  getReportById,
} from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import CategoryWiseSessionSkeleton from "../skelton-report/CategoryWiseSessionSkeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_BG_COLORS = [
  "#F03232",
  "#FFB432",
  "#FFDC5A",
  "#64D250",
  "#5AA5FF",
  "#AA5AF0",
  "#B4B4B4",
  "#6E6E6E",
  "#AA966E",
  "#823214",
];
const CategoryWiseSessionView = () => {
  const { t } = UseTranslationHook();
  const [serviceWiseSessions, setServiceWiseSessions] = useState<
    ICategoryWiseSession[]
  >([]);
  const [loading, setLoading] = useState(true);
  const fetchTopServices = async () => {
    const data = await getReportById(
      REPORT_ID.ServiceCategoryWiseSession,
      setLoading
    );
    if (data) {
      setServiceWiseSessions(data);
    }
  };
  useEffect(() => {
    fetchTopServices();
  }, []);

  const data = useMemo(() => {
    return {
      labels: serviceWiseSessions
        .slice(0, 10)
        .map((item) => item.category_title),
      datasets: [
        {
          label: t("no_of_sessions"),
          data: serviceWiseSessions
            .slice(0, 10)
            .map((item) => item.total_sessions),
          backgroundColor: CHART_BG_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [serviceWiseSessions, t]);

  return loading ? (
    <CategoryWiseSessionSkeleton />
  ) : (
    <>
      <p className="comman-black-big font-medium mb-5">
        {t("service_category_wise_session")}
      </p>
      {serviceWiseSessions.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="comman-black-big font-medium mb-5">
            {t("no_session_available")}
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full md:flex md:justify-center pie">
            <Pie data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryWiseSessionView;
