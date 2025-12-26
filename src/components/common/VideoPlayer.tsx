import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { GET_PRESIGNED_URL } from "../../services/user/UserServices";
import { encryptData } from "../../utils/AppFunctions";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../../utils/AppConstants";
import { APP_IMAGE_URL } from "../../config/AppConfig";

const VideoPlayer: React.FC<{
  isPremium?: boolean;
  poster?: string;
  source?: string;
  autoPlay?: boolean;
  control: string[];
  isPrivate?: boolean;
}> = ({ poster, source, autoPlay, control, isPremium, isPrivate = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrcUrl, setVideoSrcUrl] = useState<string>("");

  useEffect(() => {
    const fetchVideoSource = async () => {
      try {
        if (source && isPrivate) {
          const resImage = await GET_PRESIGNED_URL(encryptData(source));
          if (resImage?.code === DEFAULT_STATUS_CODE_SUCCESS) {
            setVideoSrcUrl(resImage.data);
          }
        } else {
          setVideoSrcUrl(APP_IMAGE_URL + source);
        }
      } catch (error) {
        setVideoSrcUrl("");
      }
    };

    fetchVideoSource();
  }, [source]);

  useEffect(() => {
    const playerSettings: Plyr.Options = {
      controls: control,
      fullscreen: { enabled: true },
      resetOnEnd: true,
      hideControls: false,
      clickToPlay: true,
    };

    const players = Array.from(document.querySelectorAll(".js-player")).map(
      (element) => new Plyr(element as HTMLElement, playerSettings)
    );

    players.forEach((instance) => {
      instance.on("play", () => {
        players.forEach((instance1) => {
          if (instance !== instance1) {
            instance1.pause();
          }
        });
      });
    });

    if (videoRef.current && isPremium) {
      videoRef.current.addEventListener("seeking", function () {
        if (videoRef.current && videoRef.current.currentTime) {
          videoRef.current.currentTime = 0;
        }
      });
    }
  }, []);

  const handlePlay = () => {
    if (!isPremium) {
      // Pause other video players
      document
        .querySelectorAll("video")
        .forEach((video: HTMLVideoElement | null) => {
          if (video && video !== videoRef.current) {
            video.pause();
          }
        });
    } else if (isPremium) {
      document
        .querySelectorAll("video")
        .forEach((video: HTMLVideoElement | null) => {
          if (video && video === videoRef.current) {
            video.pause();
          }
        });
    }
  };

  return (
    <div className="lib-video w-full h-full">
      <video
        ref={videoRef}
        onPlay={handlePlay}
        className="js-player"
        autoPlay={autoPlay}
        controls
        playsInline
        poster={poster}
        src={videoSrcUrl}
      >
        <source src={videoSrcUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
