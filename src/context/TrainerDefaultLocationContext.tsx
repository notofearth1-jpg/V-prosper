import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageUtils } from "../utils/LocalStorageUtil";
import { USER_ROLE, USER_STATUS } from "../utils/AppEnumerations";
import {
  ITrainerPreferredLocations,
  fetchTrainerDefaultLocationsApi,
} from "../screens/trainer-preferred-location/TrainerPreferredLocationController";
import { TReactSetState } from "../data/AppType";

interface ITrainerLocationContextProps {
  trainerDefaultLocation: ITrainerPreferredLocations | null;
  setTrainerDefaultLocation: TReactSetState<ITrainerPreferredLocations | null>;
  fetchTrainerLocation: () => void;
  clearLocationData: () => void;
}

const TrainerLocationContext = createContext<
  ITrainerLocationContextProps | undefined
>(undefined);

export const useTrainerLocationContext = () => {
  const context = useContext(TrainerLocationContext);
  if (!context) {
    throw new Error();
  }
  return context;
};

export const TrainerLocationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [trainerDefaultLocation, setTrainerDefaultLocation] =
    useState<ITrainerPreferredLocations | null>(null);
  const token = localStorageUtils.getAccessToken();
  const profileStatus = localStorageUtils.getUserProfileStatus();
  const userRole = Number(localStorageUtils.getRole());
  const fetchTrainerLocation = () => {
    fetchTrainerDefaultLocationsApi(setTrainerDefaultLocation);
  };

  const clearLocationData = () => {
    setTrainerDefaultLocation(null);
  };

  useEffect(() => {
    if (
      userRole === USER_ROLE.Trainer &&
      token &&
      profileStatus === Number(USER_STATUS.ProfileCompleted)
    ) {
      fetchTrainerLocation();
    }
  }, []);

  return (
    <TrainerLocationContext.Provider
      value={{
        trainerDefaultLocation,
        setTrainerDefaultLocation,
        fetchTrainerLocation,
        clearLocationData,
      }}
    >
      {children}
    </TrainerLocationContext.Provider>
  );
};
