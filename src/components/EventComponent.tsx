import React, { useEffect, useState } from "react";
import BackButton from "./common/BackButton";
import UseTranslationHook from "../hooks/UseTranslationHook";
import {
  IEvent,
  fetchEventsApi,
} from "../screens/header/home-page/HomePageController";
import { useNavigate } from "react-router-dom";
import ICImage from "../core-component/ICImage";
import { userRoute } from "../routes/RouteUser";
import { IS_PREMIUM, IS_SUBSCRIBED } from "../utils/AppEnumerations";
import { premiumIcon } from "../assets/icons/SvgIconList";
import CardListPageSkeleton from "./common/skeletons/CardListPageSkeleton";
import VideoPlayer from "./common/VideoPlayer";

const EventComponent = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [loadingForEvent, setLoadingForEvent] = useState(true);
  const [eventsList, setEventList] = useState<IEvent[]>([]);

  useEffect(() => {
    fetchEventsApi(setEventList, setLoadingForEvent, t, true);
  }, []);

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="comman-padding h-svh md:h-[calc(100vh-76px)] overflow-hidden flex flex-col">
      <div className="flex">
        <div className="mr-2">
          <BackButton />
        </div>
        <div className="w-full ml-2 flex items-center comman-black-lg">
          <h1>
            {t("nearby_events")} ({eventsList.length})
          </h1>
        </div>
      </div>
      {loadingForEvent ? <CardListPageSkeleton /> : null}
      <div className="mt-4  flex-1 overflow-y-scroll remove-scrollbar-width">
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {eventsList &&
            eventsList.length > 0 &&
            eventsList.map((data, index) => (
              <>
                <div key={index} className="relative">
                  <div
                    key={index}
                    onClick={() =>
                      navigate(userRoute.eventDetail, {
                        state: { id: data?.id, sp: false },
                      })
                    }
                    className="cursor flex justify-center items-center border bg-skin-on-background rounded-lg overflow-hidden aspect-16/9 object-contain"
                  >
                    {isVideo(data.app_media[0]?.media_url) ? (
                      <div className="overflow-hidden aspect-16/9 object-contain">
                        <VideoPlayer
                          control={["play-large"]}
                          source={data.app_media[0]?.media_url}
                        />
                      </div>
                    ) : (
                      <ICImage
                        imageUrl={data.app_media[0]?.media_url}
                        alt={data.title}
                        className="w-full aspect-16/9 object-contain"
                        scaled={false}
                      />
                    )}
                  </div>
                  {data.has_subscribed === IS_SUBSCRIBED.Yes ? (
                    <div className="uppercase absolute top-3 left-1">
                      <div className="text-subscribed text-skin-on-primary">
                        {t("subscribed")}
                      </div>
                    </div>
                  ) : (
                    data.is_paid_event === IS_PREMIUM.Yes && (
                      <div className="favorites absolute top-2 left-2">
                        <div className="h-8 w-8">{premiumIcon}</div>
                      </div>
                    )
                  )}
                  <div className="comman-black-text mt-[10px]">
                    {data.title}
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
