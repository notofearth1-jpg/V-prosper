import React, { useEffect, useState } from "react";
import {
  IAddress,
  fetchUserDefultAddress,
} from "../../screens/user-location/UserLocation.controller";
import ShrinkText from "./ShrinkText";
import { locationIcon } from "../../assets/icons/SvgIconList";
import { localStorageUtils } from "../../utils/LocalStorageUtil";

const SplashScreen = () => {
  const [addressData, setAddressData] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorageUtils.getAccessToken();

  useEffect(() => {
    if (token) {
      fetchUserDefultAddress(setAddressData, setLoading);
    }
  }, []);

  return (
    <div className="h-screen flex items-center flex-col bg-black">
      <div>
        <img src="/Yoga.gif" alt="Loading..." className="h-[80vh]" />
      </div>
      {addressData && (
        <>
          <div className="animate-bounce w-10 h-10 text-white">
            {locationIcon}
          </div>
          <div className="h-[20vh]">
            {addressData.address_line_1 && addressData.address_line_2 && (
              <p>
                <div className="flex items-center justify-between mt-5">
                  <ShrinkText
                    text={`${addressData.address_line_1} ,${addressData.address_line_2}`}
                    maxLength={27}
                    className="comman-black-lg !text-white"
                  />
                </div>
              </p>
            )}

            <p>
              <ShrinkText
                text={`${addressData.city ? addressData.city + "," : ""} ${
                  addressData.state_name
                } ${addressData.postcode} - ${addressData.country_name}`}
                maxLength={42}
                className="comman-grey !text-white"
              />
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SplashScreen;
