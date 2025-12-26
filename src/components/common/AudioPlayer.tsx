import React, { useState, useRef, useEffect } from "react";
import {
  fastForward,
  fastRewind,
  loopIcon,
  muteIcon,
  pauseIcon,
  playIcon,
  volumeIcon,
} from "../../assets/icons/SvgIconList";
import { TOnChangeInput, TReactSetState } from "../../data/AppType";
import { encryptData } from "../../utils/AppFunctions";
import { GET_PRESIGNED_URL } from "../../services/user/UserServices";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../../utils/AppConstants";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { APP_IMAGE_URL } from "../../config/AppConfig";

interface IAudioPlayerProps {
  audioSrc: string;
  imgSrc: string;
  index: number;
  currentlyPlayingIndex: number;
  setCurrentlyPlayingIndex: TReactSetState<number>;
  isPrivate?: boolean;
  isDetail?: boolean;
}

function AudioPlayer({
  audioSrc,
  imgSrc,
  index,
  currentlyPlayingIndex,
  setCurrentlyPlayingIndex,
  isPrivate = false,
  isDetail,
}: IAudioPlayerProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isMute, setIsMute] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrcUrl, setAudioSrcUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioSource = async () => {
      if (audioSrc && isPrivate) {
        try {
          const resImage = await GET_PRESIGNED_URL(encryptData(audioSrc));
          if (resImage?.code === DEFAULT_STATUS_CODE_SUCCESS) {
            setAudioSrcUrl(resImage.data);
          } else {
            setAudioSrcUrl(null);
          }
        } catch (error) {
          setAudioSrcUrl(null);
        }
      } else {
        setAudioSrcUrl(APP_IMAGE_URL + audioSrc);
      }
    };

    fetchAudioSource();
  }, [audioSrc]);

  useEffect(() => {
    if (index === currentlyPlayingIndex) {
      if (isPlaying) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
      }
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isPlaying, index, currentlyPlayingIndex]);

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
    setCurrentlyPlayingIndex((prevState) => (prevState === index ? -1 : index));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (audioRef.current) {
      const boundingRect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - boundingRect.left;
      const newTime = (offsetX / boundingRect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        duration
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  function formatDuration(durationSeconds: number): string {
    const minutes: number = Math.floor(durationSeconds / 60);
    const seconds: number = Math.floor(durationSeconds % 60);
    const formattedSeconds: string = seconds.toString().padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [audioRef.current]);

  const toggleLoop = () => {
    setIsLooping((prevState) => !prevState);
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center player-card p-3 rounded-lg space-y-4">
      <div className="relative w-full flex items-center justify-between space-x-2">
        <button className="cursor" onClick={() => skipTime(-10)}>
          <div className="w-9 h-9 svg-color">{fastRewind}</div>
        </button>
        <button className="p-1 rounded-full cursor" onClick={handlePlayPause}>
          <div className="svg-color w-9 h-9">
            {isPlaying ? pauseIcon : playIcon}
          </div>
        </button>
        <div onClick={() => skipTime(10)} className="cursor">
          <div className="w-9 h-9 svg-color">{fastForward}</div>
        </div>
      </div>

      {isDetail && (
        <div className="flex items-center justify-between w-full mt-4 space-x-2">
          <p className="svg-color">{formatDuration(currentTime)}</p>
          <div
            className="w-full bg-white rounded-full h-1.5  cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="bg-main-primary h-1.5 rounded-full "
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <p className="svg-color">{formatDuration(duration)}</p>
        </div>
      )}

      {isDetail && (
        <div className="w-full flex justify-between">
          <button className="svg-color cursor" onClick={toggleLoop}>
            {isLooping ? (
              <div className="h-5 w-5 svg-color">{loopIcon}</div>
            ) : (
              <div className="h-5 w-5 text-[#a4a5a5]">{loopIcon}</div>
            )}
          </button>
          <button
            className="svg-color cursor"
            onClick={() => setIsMute((prevState) => !prevState)}
          >
            {isMute ? (
              <div className="h-5 w-5 svg-color">{muteIcon}</div>
            ) : (
              <div className="h-5 w-5 svg-color">{volumeIcon}</div>
            )}
          </button>
        </div>
      )}
      {audioSrcUrl && (
        <audio ref={audioRef} loop={isLooping} muted={isMute}>
          <source src={audioSrcUrl} type="audio/mp4" />
          <source src={audioSrcUrl} type="audio/x-m4a" />
          <source src={audioSrcUrl} type="audio/m4a-latm" />
          <source src={audioSrcUrl} type="audio/ogg" />
          <source src={audioSrcUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

export default AudioPlayer;
