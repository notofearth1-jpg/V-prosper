import { LOCAL_STORAGE_KEYS } from "./AppEnumerations";

export const localStorageUtils = {
  getAccessToken: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AccessToken);
    } catch (e) {
      return null;
    }
  },
  getRefreshToken: async () => {
    try {
      return await localStorage.getItem(LOCAL_STORAGE_KEYS.RefreshToken);
    } catch (e) {
      return null;
    }
  },
  setRefreshToken: async (token: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.RefreshToken, token);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setAccessToken: async (token: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AccessToken, token);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setTrainerDetails: async (token: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.TrainerDetails, token);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getTrainerDetails: async () => {
    try {
      return await localStorage.getItem(LOCAL_STORAGE_KEYS.TrainerDetails);
    } catch (e) {
      return null;
    }
  },

  setFilters: async (data: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AppliedFilters, data);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getFilters: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AppliedFilters);
    } catch (e) {
      return null;
    }
  },

  setTheme: async (data: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Theme, data);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getTheme: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Theme);
    } catch (e) {
      return null;
    }
  },
  removeTheme: () => {
    try {
      return localStorage.removeItem(LOCAL_STORAGE_KEYS.Theme);
    } catch (e) {
      return null;
    }
  },
  removeFilters: () => {
    try {
      return localStorage.removeItem(LOCAL_STORAGE_KEYS.AppliedFilters);
    } catch (e) {
      return null;
    }
  },
  setPmi: async (pmiList: any) => {
    try {
      await localStorage.setItem(
        LOCAL_STORAGE_KEYS.ProfileMenuItems,
        JSON.stringify(pmiList)
      );
      return 1;
    } catch (e) {
      return 0;
    }
  },

  getPmi: () => {
    try {
      const res = localStorage.getItem(LOCAL_STORAGE_KEYS.ProfileMenuItems);
      return res ? JSON.parse(res) : [];
    } catch (e) {
      return null;
    }
  },

  setTrainerKeyCode: async (code: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.keyCode, code);
      return 1;
    } catch (e) {
      return 0;
    }
  },

  setTrainerId: async (code: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.trainerId, code);
      return 1;
    } catch (e) {
      return 0;
    }
  },

  setUserId: async (token: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.userId, token);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setRole: async (roleId: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Role, roleId);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getRole: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Role);
    } catch (e) {
      return 0;
    }
  },
  setProfileUrl: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.ProfileUrl, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setMultipleProfile: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.MultipleProfile, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getMultipleProfile: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.MultipleProfile);
    } catch (e) {
      return 0;
    }
  },
  getProfileUrl: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.ProfileUrl);
    } catch (e) {
      return 0;
    }
  },
  setAlternateProfileUrl: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AlternateProfileUrl, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getAlternateProfileUrl: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AlternateProfileUrl);
    } catch (e) {
      return 0;
    }
  },
  setAlternateProfileName: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AlternateProfileName, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getAlternateProfileName: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AlternateProfileName);
    } catch (e) {
      return 0;
    }
  },
  getUserId: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.userId);
    } catch (e) {
      return 0;
    }
  },

  getTrainerId: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.trainerId);
    } catch (e) {
      return 0;
    }
  },

  getUserInfo: async () => {
    try {
      const jsonStr = await localStorage.getItem(LOCAL_STORAGE_KEYS.UserInfo);
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  setUserInfo: async (jsonObject: Object) => {
    try {
      await localStorage.setItem(
        LOCAL_STORAGE_KEYS.UserInfo,
        JSON.stringify(jsonObject)
      );
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getAlternatePhone: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AlternatePhone);
    } catch (e) {
      return null;
    }
  },
  setAlternatePhone: (phone: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AlternatePhone, phone);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserName: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.UserName);
    } catch (e) {
      return null;
    }
  },
  setUserName: (userName: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.UserName, userName);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getEmail: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Email);
    } catch (e) {
      return null;
    }
  },
  setEmail: (email: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.Email, email);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getIsAlternateMobileVerify: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.IsAlternateMobileVerify);
    } catch (e) {
      return null;
    }
  },
  setIsAlternateMobileVerify: (IsAlternateMobileVerify: string) => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.IsAlternateMobileVerify,
        IsAlternateMobileVerify
      );
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setUserRelation: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.RelationId, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserRelation: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.RelationId);
    } catch (e) {
      return null;
    }
  },
  setUserFullName: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.FullName, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserFullName: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.FullName);
    } catch (e) {
      return null;
    }
  },
  setUserAddressLine1: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AddressLine1, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserAddressLine1: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AddressLine1);
    } catch (e) {
      return null;
    }
  },
  setUserAddressLine2: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AddressLine2, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserAddressLine2: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AddressLine2);
    } catch (e) {
      return null;
    }
  },
  setUserAddressLine3: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.AddressLine3, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserAddressLine3: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AddressLine3);
    } catch (e) {
      return null;
    }
  },
  setUserCity: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.City, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserCity: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.City);
    } catch (e) {
      return null;
    }
  },
  setUserStateId: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.StateId, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserStateId: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.StateId);
    } catch (e) {
      return null;
    }
  },
  setUserPostCode: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Postcode, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserPostCode: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Postcode);
    } catch (e) {
      return null;
    }
  },
  setUserType: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Type, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserType: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Type);
    } catch (e) {
      return null;
    }
  },
  setUserValue: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Value, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserValue: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Value);
    } catch (e) {
      return null;
    }
  },
  setUserBirthDayType: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.BirthDayType, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserBirthDayType: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.BirthDayType);
    } catch (e) {
      return null;
    }
  },
  setUserBirthDayValue: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.BirthDayValue, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserBirthDayValue: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.BirthDayValue);
    } catch (e) {
      return null;
    }
  },
  setUserAnswer: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Answer, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserAnswer: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Answer);
    } catch (e) {
      return null;
    }
  },
  setUserInterest: async (url: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.Interest, url);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserInterest: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.Interest);
    } catch (e) {
      return null;
    }
  },

  removeTrainerDetail: () => {
    try {
      localStorage.removeItem(
        LOCAL_STORAGE_KEYS.TrainerDetails
        // LOCAL_STORAGE_KEYS.UserInfo,
      );
      return 1;
    } catch (e) {
      return 0;
    }
  },
  removeAccessToken: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AccessToken);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  removeRefreshToken: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.RefreshToken);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  removeAll: async () => {
    try {
      await localStorage.removeItem(
        LOCAL_STORAGE_KEYS.AccessToken
        // LOCAL_STORAGE_KEYS.UserInfo,
      );
      return 1;
    } catch (e) {
      return 0;
    }
  },
  setSplashScreen: (data: string) => {
    try {
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.hasSeenSplashScreen, data);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getSplashScreen: () => {
    try {
      return sessionStorage.getItem(LOCAL_STORAGE_KEYS.hasSeenSplashScreen);
    } catch (e) {
      return null;
    }
  },
  setUserProfileStatus: async (status: string) => {
    try {
      await localStorage.setItem(LOCAL_STORAGE_KEYS.ProfileStatus, status);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getUserProfileStatus: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.ProfileStatus);
    } catch (e) {
      return 0;
    }
  },
  setBloodGroup: (bloodGroup: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BloodGroup, bloodGroup);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getBloodGroup: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.BloodGroup);
    } catch (e) {
      return null;
    }
  },
  setAddressLabel: (addressLabel: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AddressLabel, addressLabel);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getAddressLabel: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.AddressLabel);
    } catch (e) {
      return null;
    }
  },
  setApplicationId: (ApplicationId: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ApplicationId, ApplicationId);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getApplicationId: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.ApplicationId);
    } catch (e) {
      return null;
    }
  },
  setCryptoKey: (cryptoKey: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CryptoKey, cryptoKey);
      return 1;
    } catch (e) {
      return 0;
    }
  },
  getCryptoKey: () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.CryptoKey);
    } catch (e) {
      return null;
    }
  },
};
