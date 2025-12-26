import { useEffect, useMemo, useState } from "react";
import { LineElement, PointElement } from "chart.js";
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
import { Line } from "react-chartjs-2";
import {
  ITrainerRatingReport,
  getReportById,
} from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import { monthShortNames } from "../../../utils/AppConstants";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import TrainerRatingReportSkeleton from "../skelton-report/TrainerRatingReportSkeleton";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const TrainerRatingReportView = () => {
  const { t } = UseTranslationHook();
  const [trainerRating, setTrainerRating] = useState<ITrainerRatingReport[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const fetchTrainerRating = async () => {
    const data = await getReportById(REPORT_ID.TrainerRating, setLoading);
    if (data) {
      setTrainerRating(data.reverse());
    }
  };
  useEffect(() => {
    fetchTrainerRating();
  }, []);

  const options = useMemo((): ChartOptions<"line"> => {
    return {
      aspectRatio: window.innerWidth < 480 ? 1 / 0.7 : undefined,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              family: "InstagramSans",
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: t("average_rating"),
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
          max: 5,
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
      labels: trainerRating.map((item) => monthShortNames[item.month - 1]),
      datasets: [
        {
          label: t("average_rating"),
          data: trainerRating.map((item) => item.average_rating),
          borderColor: ["#FFBBAB"],
          backgroundColor: ["#FFBBAB"],
          pointStyle: "circle",
          pointRadius: 6,
          pointHoverRadius: 10,
        },
      ],
    };
  }, [trainerRating, t]);

  return loading ? (
    <>
      <div className="xl:hidden">
        <TrainerRatingReportSkeleton height={220} />
      </div>
      <div className="xl:block hidden">
        <TrainerRatingReportSkeleton height={390} />
      </div>
    </>
  ) : (
    <div className="w-full max-w-[744px] max-h-[410px]">
      <Line options={options} data={data} />
    </div>
  );
};

export default TrainerRatingReportView;
