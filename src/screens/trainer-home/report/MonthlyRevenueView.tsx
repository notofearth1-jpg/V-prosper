import React, { useEffect, useMemo, useState } from "react";
import { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  IMonthlyRevenueReport,
  getReportById,
} from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import { monthShortNames } from "../../../utils/AppConstants";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import MonthlyRevenueReportSkeleton from "../skelton-report/MonthlyRevenueReportSkeleton";
import { addCurrencySign } from "../../../utils/AppFunctions";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyRevenueView = () => {
  const { t } = UseTranslationHook();
  const [revenueReport, setRevenueReport] = useState<IMonthlyRevenueReport[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const fetchRevenueReport = async () => {
    const data = await getReportById(
      REPORT_ID.MonthlyServiceRevenue,
      setLoading
    );
    if (data) {
      setRevenueReport(data.reverse());
    }
  };
  useEffect(() => {
    fetchRevenueReport();
  }, []);

  const options = useMemo((): ChartOptions<"bar"> => {
    return {
      aspectRatio: window.innerWidth < 480 ? 1 / 0.7 : undefined,
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item) => {
              return (
                item.dataset.label + ": " + addCurrencySign(item.raw as string)
              );
            },
          },
        },
        legend: {
          position: "top" as const,
          labels: {
            font: {
              family: "InstagramSans",
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: t("total_revenue"),
          color: "#000000",
          font: {
            family: "InstagramSans",
            size: 20,
            weight: "normal",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: "InstagramSans",
              size: 13,
            },
          },
        },
        y: {
          ticks: {
            font: {
              family: "InstagramSans",
              size: 10,
            },
          },
        },
        y1: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              family: "InstagramSans",
              size: 10,
            },
          },
        },
      },
    };
  }, [t]);

  const data = useMemo(() => {
    return {
      labels: revenueReport
        .slice(-6)
        .map((item) => monthShortNames[item.month - 1]),
      datasets: [
        {
          label: t("online"),
          data: revenueReport.slice(-6).map((item) => item.online_revenue),
          backgroundColor: "#0095FF",
          yAxisID: "y",
        },
        {
          label: t("offline"),
          data: revenueReport.slice(-6).map((item) => item.offline_revenue),
          backgroundColor: "#00E096",
          yAxisID: "y1",
        },
      ],
    };
  }, [revenueReport, t]);

  return loading ? (
    <>
      <div className="xl:hidden">
        <MonthlyRevenueReportSkeleton height={220} />
      </div>
      <div className="xl:block hidden">
        <MonthlyRevenueReportSkeleton height={390} />
      </div>
    </>
  ) : (
    <div className="w-full h-full flex justify-center">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyRevenueView;
