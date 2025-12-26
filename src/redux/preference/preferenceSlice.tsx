import { createSlice } from '@reduxjs/toolkit';
import { THEMES } from '../../utils/AppEnumerations';

export interface ICounterState {
  userPreference: {
    timeZoneOffset: string;
    localeCode: string;
    theme: string;
  };
  systemPreference: {};
  agencyPreference: {
    ISDCode: string;
    phoneFormat: string;
    currencySymbol: string;
    currencyCode: string;
    agencyLogo: string;
    agencyDemoGraphicInfo: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipCode: string;
      countryCode: string;
      phone: string;
    };
    helpLineNumber: string;
  };
}

const initialState: ICounterState = {
  userPreference: {
    timeZoneOffset: '+330',
    localeCode: 'en-US',
    theme: THEMES.Light,
  },
  systemPreference: {},
  agencyPreference: {
    ISDCode: '+1',
    phoneFormat: '(XXX)XXX-XXXX',
    currencySymbol: '$',
    currencyCode: 'USD',
    agencyLogo:
      'https://static.vecteezy.com/system/resources/previews/009/030/690/original/idf-logo-idf-letter-idf-letter-logo-design-initials-idf-logo-linked-with-circle-and-uppercase-monogram-logo-idf-typography-for-technology-business-and-real-estate-brand-vector.jpg',
    agencyDemoGraphicInfo: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      countryCode: '',
      phone: '',
    },
    helpLineNumber: '',
  },
};

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    ChangeTheme: (state, data) => {
      state.userPreference.theme = data.payload;
    },
    ChangePreference: (state, data) => {
      state = data.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ChangeTheme, ChangePreference } = preferenceSlice.actions;

export default preferenceSlice.reducer;
