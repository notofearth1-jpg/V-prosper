import React, { createContext, useContext, useState, useEffect } from "react";
import {
  IAddress,
  fetchUserDefultAddress,
} from "../screens/user-location/UserLocation.controller";
import { localStorageUtils } from "../utils/LocalStorageUtil";
import { USER_STATUS } from "../utils/AppEnumerations";

interface IAddressContextProps {
  addressData: IAddress | null;
  setAddressData: React.Dispatch<React.SetStateAction<IAddress | null>>;
  fetchAddress: () => void;
  clearAddressData: () => void;
}

const AddressContext = createContext<IAddressContextProps | undefined>(
  undefined
);

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw Error;
  }
  return context;
};

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addressData, setAddressData] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorageUtils.getAccessToken();
  const profileStatus = localStorageUtils.getUserProfileStatus();

  const fetchAddress = () => {
    fetchUserDefultAddress(setAddressData, setLoading);
  };

  const clearAddressData = () => {
    setAddressData(null);
  };

  useEffect(() => {
    if (token && profileStatus === Number(USER_STATUS.ProfileCompleted)) {
      fetchAddress();
    }
  }, [token, profileStatus]);

  return (
    <AddressContext.Provider
      value={{ addressData, setAddressData, fetchAddress, clearAddressData }}
    >
      {children}
    </AddressContext.Provider>
  );
};
