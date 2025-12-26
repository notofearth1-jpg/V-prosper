import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/common/BottomNavbar";
import MobileHeader from "../header/MobileHeader";
import { fetchServiceApi } from "./ProductServiceController";
import Loader from "../../components/common/Loader";
import { leftArrowIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { IService } from "./ProductServiceCategoryController";
import ICImage from "../../core-component/ICImage";
import { userRoute } from "../../routes/RouteUser";
import VideoPlayer from "../../components/common/VideoPlayer";
import NoData from "../../components/common/NoData";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";

const ProductServices = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState<IService[]>([]);
  const { isMobile } = UseMobileLayoutHook();
  useEffect(() => {
    fetchServiceApi(setServicesList, setLoading, t);
  }, []);
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);
  return (
    <>
      <div className={`comman-padding ${isMobile ? "main-bg" : ""}`}>
        <div>
          <MobileHeader />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {servicesList && servicesList.length > 0 ? (
              <div className="grid grid-cols-12 gap-4 mt-6 mb-20 md:mb-0">
                {servicesList.map((data, index) => (
                  <div
                    onClick={() =>
                      navigate(userRoute.serviceDescription, {
                        state: { id: data.id },
                      })
                    }
                    className="col-span-12 lg:col-span-4 md:col-span-6 cursor"
                    key={index}
                  >
                    <div className="flex justify-between items-center">
                      <p className="comman-black-big">{data.category_title}</p>
                      <div className="w-5	h-5">{leftArrowIcon}</div>
                    </div>

                    <div className="w-full  flex border-library services-bg box-shadow mt-2 overflow-hidden !rounded-lg gap-x-4">
                      <div className="w-full bg-skin-product-service flex items-center justify-center aspect-16/9  overflow-hidden !rounded-lg">
                        <>
                          {isVideo(data.poster_image) ? (
                            <div className="w-full aspect-16/9 object-contain overflow-hidden rounded-lg">
                              <VideoPlayer
                                control={["play-large"]}
                                source={data.poster_image}
                              />
                            </div>
                          ) : (
                            <ICImage
                              imageUrl={data?.poster_image}
                              alt={data.category_title}
                              className="w-full aspect-16/9 object-contain overflow-hidden"
                            />
                          )}
                        </>
                      </div>

                      <div className="w-full aspect-16/9 object-contain overflow-y-scroll  comman-black-text remove-scrollbar-width">
                        <ul>
                          {data.category_options.map(
                            (option: string, index: number) => (
                              <li key={index}>
                                {option.length > 20
                                  ? option.slice(0, 20) + "..."
                                  : option}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoData title={t("service")} height={200} width={200} />
            )}
          </>
        )}

        <BottomNavbar serviceActive />
      </div>
    </>
  );
};

export default ProductServices;
