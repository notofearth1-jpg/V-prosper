import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ITrainerHelpCenterTopic,
  getTrainerSystemHelpTopicById,
} from "./TrainerHelpCenterController";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import Loader from "../../../components/common/Loader";
import BackButton from "../../../components/common/BackButton";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { USER_ROLE } from "../../../utils/AppEnumerations";
import { userRoute } from "../../../routes/RouteUser";
import TrainerHelpCenterSkeleton from "./trainer-help-center-skeleton/TrainerHelpCenterSkeleton";
import NoData from "../../../components/common/NoData";

const TrainerHelpTopic = () => {
  const userRole = Number(localStorageUtils.getRole());
  const location = useLocation();
  const id = location?.state?.id;
  const [systemHelpTopic, setSystemHelpTopic] = useState<
    ITrainerHelpCenterTopic[]
  >([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTrainerSystemHelpTopicById(setSystemHelpTopic, id, setLoading);
  }, [id]);

  return (
    <div className="comman-padding md:h-[calc(100vh-76px)] h-svh flex flex-col overflow-hidden">
      <div className="flex items-center justify-start mb-4">
        <BackButton />
        {systemHelpTopic && systemHelpTopic.length > 0 && (
          <div className="comman-black-lg ml-5">
            {systemHelpTopic[0].help_category.category_title}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col md:items-center flex-1 overflow-y-scroll remove-scrollbar-width`}
      >
        <div className={` md:w-3/4 lg:w-1/2 w-full`}>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <TrainerHelpCenterSkeleton key={index} />
            ))
          ) : systemHelpTopic && systemHelpTopic.length > 0 ? (
            <div className="overflow-auto">
              {systemHelpTopic
                .sort(
                  (a, b) =>
                    parseFloat(a.display_sequence) -
                    parseFloat(b.display_sequence)
                )
                .map((item, index) => (
                  <div
                    className="mb-5 flex items-center booking-info cursor"
                    key={index}
                    onClick={() => {
                      navigate(
                        userRole === USER_ROLE.Trainer
                          ? routeTrainer.helpTopicDetails
                          : userRole === USER_ROLE.Customer &&
                              userRoute.helpTopicDetails,
                        {
                          state: { id: item.id },
                        }
                      );
                    }}
                  >
                    <div className="mx-3 flex flex-col items-center">
                      <div className="comman-black-big">
                        <p>{item?.topic}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="h-[75vh]">
              <NoData title="help_topic" height={140} width={140} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerHelpTopic;
