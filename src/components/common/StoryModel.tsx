import React, { useState, FC, useEffect } from "react";
import Modal from "react-responsive-modal";
import Stories from "react-insta-stories";
import { Story } from "react-insta-stories/dist/interfaces";
import { IAppMedia } from "../../data/AppInterface";
import { MEDIA_TYPE } from "../../utils/AppEnumerations";
import ICImage from "../../core-component/ICImage";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import { APP_IMAGE_URL } from "../../config/AppConfig";
import { crossRemove } from "../../assets/icons/SvgIconList";

interface IStoryModalProps {
  open: boolean;
  onClose: () => void;
  appMedia: IAppMedia[];
  selectedStoryIndex: number;
  reallyclose: () => void;
  title?: string;
}

const StoryModal: FC<IStoryModalProps> = ({
  open,
  onClose,
  appMedia,
  reallyclose,
  title,
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { t } = UseTranslationHook();
  const { isMobile } = UseMobileLayoutHook();

  const convertToStory = async (media: IAppMedia): Promise<Story> => {
    if (media.media_type === MEDIA_TYPE.image) {
      return {
        content: ({ action, isPaused }) => (
          <div key={media.id} className="h-full w-full">
            <ICImage
              imageUrl={media.media_url}
              alt={media.media_title}
              scaled={false}
              onLoad={() => action("play")}
              showOriginal
            />
          </div>
        ),
        duration: 3000,
      };
    } else if (media.media_type === MEDIA_TYPE.video) {
      try {
        return {
          url: APP_IMAGE_URL + media.media_url,
          type: "video",
          duration: 3000,
          styles: {
            width: "400px !importent",
          },
        };
      } catch (error: any) {
        return {
          content: () => (
            <div key={media.id}>
              {t("error_loading_video")} {error.message}
            </div>
          ),
          duration: 3000,
        };
      }
    } else {
      return {
        content: () => (
          <div key={media.id}>
            {t("unsupported_media_type")} {media.media_type}
          </div>
        ),
        duration: 3000,
      };
    }
  };

  useEffect(() => {
    const fetchStories = async () => {
      if (appMedia.length > 0) {
        const initialStories = await Promise.all(appMedia.map(convertToStory));
        setStories(initialStories);
      }
    };

    fetchStories();
  }, [appMedia]);

  const handleStoryEnd = (index: number) => {
    if (index < stories.length - 1) {
      setCurrentIndex(index + 1); // Move to the next story
    } else {
      setCurrentIndex(0); // Reset to the first story when all stories are completed
    }
  };

  const handleAllStoriesEnd = () => {
    setCurrentIndex(0);
    onClose();
  };

  const handleStoryNavigation = (type: "next" | "previous") => {
    if (type === "next" && currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (type === "previous" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      center
      classNames={{ modal: "custom-modal" }}
    >
      {stories.length > 0 && (
        <Stories
          stories={stories}
          defaultInterval={3000}
          loop={false}
          width={isMobile ? "100%" : "400px"}
          keyboardNavigation
          height={"100%"}
          currentIndex={currentIndex}
          onStoryEnd={handleStoryEnd}
          onAllStoriesEnd={handleAllStoriesEnd}
          onNext={() => handleStoryNavigation("next")} // Handle manual navigation
          onPrevious={() => handleStoryNavigation("previous")} // Handle manual navigation
        />
      )}

      <div
        className="absolute cursor top-5 right-2 w-10 h-10 cursor-pointer z-[9999]"
        onClick={(e) => {
          e.stopPropagation();
          reallyclose();
        }}
      >
        {crossRemove}
      </div>

      <div className="absolute top-7 left-4 cursor-pointer z-[9999] text-white">
        {title}
      </div>
    </Modal>
  );
};

export default StoryModal;
