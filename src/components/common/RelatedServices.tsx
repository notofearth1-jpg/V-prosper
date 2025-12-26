import ICImage from "../../core-component/ICImage";
import ICLable from "../../core-component/ICLable";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { userRoute } from "../../routes/RouteUser";
import { MEDIA_TYPE } from "../../utils/AppEnumerations";
import VideoPlayer from "./VideoPlayer";
import { IServiceForSubCategory } from "../../screens/product-services/Web/ProductServiceDetailsWebController";
import { NavigateFunction } from "react-router-dom";

interface IRelatedServicesProps {
  services: IServiceForSubCategory[];
  navigate: NavigateFunction;
  closeModal: () => void;
}

const RelatedServices: React.FC<IRelatedServicesProps> = ({
  services,
  navigate,
  closeModal,
}) => {
  const { t } = UseTranslationHook();

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="col-span-1 comman-black-lg flex items-center">
          {t("related_service")}
        </div>
      </div>
      <div className="top grid md:grid-cols-2 grid-cols-1 gap-4">
        {services &&
          services.length > 0 &&
          services.map((value, index) => (
            <div className="comman-black-text cursor" key={index}>
              <div
                className="overflow-hidden border relative"
                onClick={() => {
                  closeModal();
                  navigate(userRoute.serviceDetails, {
                    state: { id: value?.id },
                  });
                }}
              >
                {Number(value.service_cost) === 0 && (
                  <ICLable label={t("free")} />
                )}
                {value.app_media && value.app_media.length > 0 ? (
                  value.app_media[0].media_type === MEDIA_TYPE.image ? (
                    <ICImage
                      imageUrl={value.app_media[0]?.media_url}
                      alt={value.service_title}
                      className="w-full h-full rounded-lg aspect-16/9"
                      scaled={false}
                    />
                  ) : (
                    <>
                      {value.app_media.length > 0 && (
                        <VideoPlayer
                          control={[
                            "play",
                            "progress",
                            "current-time",
                            "mute",
                            "fullscreen",
                            "play-large",
                          ]}
                          source={value.app_media[0].media_url}
                        />
                      )}
                    </>
                  )
                ) : (
                  <ICImage
                    height={194}
                    width={345}
                    alt={value.service_title}
                    className="w-full h-full rounded-lg aspect-16/9"
                    scaled={false}
                  />
                )}
              </div>
              <div className="mt-[10px]">{value.service_title}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default RelatedServices;
