import React, { useEffect, useState } from "react";
import { Line } from "rc-progress";
import {
  ITopServicesReport,
  getReportById,
} from "../TrainerDashboardController";
import { REPORT_ID } from "../../../utils/AppEnumerations";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import TopServicesSkeleton from "../skelton-report/TopServicesSkeleton";

interface IServiceLine {
  name: string;
  index: number;
  percentage: number;
}

const STROKE_COLORS = ["#0095FF", "#00E096", "#884DFF", "#FF8F0D", "#0095FF"];

const TRAIL_COLORS = ["#CDE7FF", "#8CFAC7", "#C5A8FF", "#FFD5A4", "#CDE7FF"];

const ServiceLine = ({ name, index, percentage }: IServiceLine) => {
  return (
    <div className="flex items-center py-4">
      <div className="comman-black-text">{index}</div>
      <div className="pl-4 flex-1 break-all comman-black-text">{name}</div>
      <div className="w-16">
        <Line
          percent={percentage}
          strokeWidth={6}
          strokeColor={STROKE_COLORS[index - 1]}
          trailColor={TRAIL_COLORS[index - 1]}
          trailWidth={6}
        />
      </div>
    </div>
  );
};

const TopServicesView = () => {
  const { t } = UseTranslationHook();
  const [topServices, setTopServices] = useState<ITopServicesReport[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchTopServices = async () => {
    const data = await getReportById(REPORT_ID.TopServices, setLoading);
    if (data) {
      setTopServices(data);
    }
  };
  useEffect(() => {
    fetchTopServices();
  }, []);

  return loading ? (
    <TopServicesSkeleton />
  ) : (
    <div>
      <p className="comman-black-big font-medium">{t("top_service")}</p>
      <div>
        <div>
          <div className="border-b font-medium dark:border-neutral-500">
            <div className="flex items-center py-4">
              <div className="comman-black-text">#</div>
              <div className="pl-4 flex-1 comman-black-text">{t("name")}</div>
              <div className="comman-black-text">{t("popularity")}</div>
            </div>
          </div>
          <div>
            {topServices.map((item, index) => (
              <ServiceLine
                key={index}
                index={index + 1}
                name={item.p_service_title}
                percentage={item.p_popularity_percentage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopServicesView;
