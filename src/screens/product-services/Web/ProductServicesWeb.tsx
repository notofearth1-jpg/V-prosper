import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServiceApi } from "../ProductServiceController";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { IService } from "../ProductServiceCategoryController";
import ICImage from "../../../core-component/ICImage";
import { userRoute } from "../../../routes/RouteUser";

const ProductServicesWeb = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState<IService[]>([]);

  useEffect(() => {
    fetchServiceApi(setServicesList, setLoading, t);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full container mx-auto">
          <div className=" grid sm:grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  m-1 md:m-2  ">
            {servicesList &&
              servicesList.length > 0 &&
              servicesList.map((data, index) => (
                <div
                  key={index}
                  className=" pt-6 cursor-pointer transition-all duration-700 ease-in-out hover:scale-105 hover:-translate-y-1 m-1 md:m-5"
                  onClick={() =>
                    navigate(userRoute.serviceDescription, {
                      state: { id: data.id },
                    })
                  }
                >
                  <div className="m-1 ">{data.category_title}</div>
                  <div className="flex w-full h-[200px] rounded-lg  services-bg box-shadow cursor-pointer ">
                    <div className="w-full rounded-lg">
                      <div className=" ">
                        <ICImage
                          imageUrl={data?.poster_image}
                          alt={data.category_title}
                          height={198}
                          width={200}
                          scaled={false}
                        />
                      </div>
                    </div>
                    <div className="w-full flex items-center ml-3">
                      <div className="services-box overflow-scroll pl-3">
                        <ul>
                          {data.category_options.map(
                            (option: string, index: number) => (
                              <li key={index}>
                                {option.length > 18
                                  ? option.slice(0, 18) + "..."
                                  : option}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductServicesWeb;
