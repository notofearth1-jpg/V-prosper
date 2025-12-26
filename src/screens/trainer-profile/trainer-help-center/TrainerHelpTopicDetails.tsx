import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ITrainerHelpCenterTopicDetails,
  getTrainerSystemHelpTopicDetailsById,
} from "./TrainerHelpCenterController";
import BackButton from "../../../components/common/BackButton";
import VideoPlayer from "../../../components/common/VideoPlayer";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import TrainerTopicDetailsSkeleton from "./trainer-help-center-skeleton/TrainerTopicDetailsSkeleton";

const TrainerHelpTopicDetails = () => {
  const location = useLocation();
  const id = location?.state?.id;
  const mainBgRef = useRef<HTMLDivElement>(null);
  const [systemHelpTopic, setSystemHelpTopic] = useState<
    ITrainerHelpCenterTopicDetails | undefined
  >();
  const { t } = UseTranslationHook();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrainerSystemHelpTopicDetailsById(setSystemHelpTopic, id, setLoading);
  }, [id]);

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-defult min-h-svh">
      <div ref={mainBgRef} className={`flex flex-col md:items-center`}>
        {loading ? (
          [...Array(1)].map((_, index) => (
            <TrainerTopicDetailsSkeleton key={index} />
          ))
        ) : (
          <>
            <div className={`comman-padding md:w-3/4 lg:w-1/2 w-full`}>
              <div className="flex items-center">
                <BackButton />
                {systemHelpTopic && (
                  <div className="comman-black-lg ml-5">
                    {systemHelpTopic.topic}
                  </div>
                )}
              </div>
              {systemHelpTopic && systemHelpTopic.help_description && (
                <div className="comman-grey top text-justify">
                  {systemHelpTopic.help_description}
                </div>
              )}

              {systemHelpTopic && systemHelpTopic.help_video_url && (
                <div className="top">
                  <VideoPlayer
                    control={[
                      "rewind",
                      "play",
                      "fast-forward",
                      "progress",
                      "current-time",
                      "mute",
                      "volume",
                      "fullscreen",
                      "play-large",
                    ]}
                    source={systemHelpTopic.help_video_url}
                  />
                </div>
              )}

              {systemHelpTopic &&
                systemHelpTopic.reference_links &&
                systemHelpTopic.reference_links.length > 0 && (
                  <div className="top">
                    <div className="comman-black-big">{t("need_help")}</div>
                    {systemHelpTopic.reference_links.map((item, index) => (
                      <p
                        className="comman-blue cursor"
                        onClick={() => handleLinkClick(item)}
                        key={index}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              {systemHelpTopic &&
                systemHelpTopic.tags &&
                systemHelpTopic.tags.length > 0 && (
                  <div className="top recent-container flex flex-wrap">
                    {systemHelpTopic.tags.map((item, index) => (
                      <div
                        key={index}
                        className="recent-box flex items-center justify-center m-1"
                      >
                        <p className="comman-black-text mx-2">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerHelpTopicDetails;
