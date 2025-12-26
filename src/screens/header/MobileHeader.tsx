import React, { useEffect, useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import { useNavigate } from "react-router-dom";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import ICImage from "../../core-component/ICImage";
import { userRoute } from "../../routes/RouteUser";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import { USER_ROLE } from "../../utils/AppEnumerations";
import { routeTrainer } from "../../routes/RouteTrainer";
import {
  IAddress,
  fetchUserDefultAddress,
} from "../user-location/UserLocation.controller";
import { downArrowIcon } from "../../assets/icons/SvgIconList";
import ShrinkText from "../../components/common/ShrinkText";
import { useTrainerLocationContext } from "../../context/TrainerDefaultLocationContext";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { fetchTrainerDefaultLocationsApi } from "../trainer-preferred-location/TrainerPreferredLocationController";
import { useAddressContext } from "../../context/AddressContext";

const MobileHeader = () => {
  const navigate = useNavigate();
  const profileImage = localStorageUtils.getProfileUrl();
  const { isMobile } = UseMobileLayoutHook();
  // const [addressData, setAddressData] = useState<IAddress | null>(null);
  const userRole = Number(localStorageUtils.getRole());
  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();
  const { trainerDefaultLocation, setTrainerDefaultLocation } =
    useTrainerLocationContext();
  const { addressData, setAddressData } = useAddressContext();

  useEffect(() => {
    if (userRole && userRole === USER_ROLE.Customer && isMobile) {
      if (!addressData) {
        fetchUserDefultAddress(setAddressData, setLoading);
      }
    }
    if (
      userRole &&
      userRole === USER_ROLE.Trainer &&
      isMobile &&
      !trainerDefaultLocation
    ) {
      fetchTrainerDefaultLocationsApi(setTrainerDefaultLocation);
    }
  }, []);

  return (
    <>
      {isMobile && (
        <div>
          <div className="flex justify-between items-center">
            {userRole && userRole === USER_ROLE.Customer ? (
              <div>
                <div
                  onClick={() => {
                    navigate(userRoute.locations);
                  }}
                >
                  {addressData ? (
                    <>
                      {addressData.address_line_1 &&
                        addressData.address_line_2 && (
                          <p>
                            <ShrinkText
                              text={`${addressData.address_line_1} ,${addressData.address_line_2}`}
                              maxLength={28}
                              className="comman-black-text"
                            />
                          </p>
                        )}

                      <p className="comman-grey flex">
                        <ShrinkText
                          text={`${
                            addressData.city ? addressData.city + "," : ""
                          } ${addressData.state_name} ${
                            addressData.postcode
                          } - ${addressData.country_name}`}
                          maxLength={25}
                        />

                        <div className="w-5 h-5 ml-1">{downArrowIcon}</div>
                      </p>
                    </>
                  ) : (
                    <p className="comman-black-lg">{t("manage_address")}</p>
                  )}
                </div>
              </div>
            ) : (
              <div onClick={() => navigate(routeTrainer.preferredLocation)}>
                <div className="comman-black-text">{t("services_in")}</div>
                <div className="comman-black-text">
                  {trainerDefaultLocation?.location_name}
                </div>
              </div>
            )}
            <div
              className="rounded-full home-image overflow-hidden"
              onClick={() =>
                userRole && userRole === USER_ROLE.Trainer
                  ? navigate(routeTrainer.trainerProfile)
                  : navigate(userRoute.profile)
              }
            >
              <ICImage
                className="w-full h-full object-cover "
                imageUrl={
                  profileImage == "null" || profileImage == "undefined"
                    ? undefined
                    : (profileImage as string)
                }
                fallbackSrc={require("../../assets/image/avatar.png")}
                isPrivate
              />
            </div>
          </div>
          {userRole && userRole === USER_ROLE.Customer && (
            <div className="top">
              <SearchBar disableSearch={true} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileHeader;
