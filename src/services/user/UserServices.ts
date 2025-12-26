import { encryptData } from "./../../utils/AppFunctions";
import { serviceMaker } from "..";
import { IUserTheme } from "../../screens/preferences/PreferenceController";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import {
  IAddress,
  IGeocode,
} from "../../screens/user-location/UserLocation.controller";
import { ILocationLatLong } from "../../screens/user/user-address/UserAddressController";
import { IAlternateMobileNumber } from "../../screens/header/profile/alternate-mobile/AlternateMobileController";
import { IAddressModel } from "../../screens/address/AddressController";

interface IUserField<T> {
  type: string;
  value: T;
}
interface IUserAlternative {
  type: string;
  value: {
    alternate_phone: string;
    relation_id?: number;
    is_alternate?: boolean;
  };
}

interface IUserAddress {
  type: string;
  value: {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string | undefined;
    city: string;
    state_id: number | null;
    country_id: number;
    postcode: string;
  };
}

interface IUserEmail {
  type: string;
  value: {
    email: string;
  };
}

interface IUserHealthQue {
  type: string;
  value: [
    {
      question_id: number;
      answer: string;
    }
  ];
}

export interface ITrainerField {
  type: string;
  value: string | number | number[] | ITrainerInfoValue;
}

interface IUserNotificationToken {
  fcm_token: string;
}

export interface ITrainerInfoValue {
  has_own_session_space: string;
  has_space_for_rent: string;
  is_marketing_partner: string;
  headline: string;
  bio: string;
}

type IUser =
  | IUserField<string>
  | IUserHealthQue
  | IUserField<string>
  | IUserField<string>
  | IUserField<string>
  | IUserField<string | number | number[]>
  | IUserField<number>
  | IUserAddress
  | IUserAlternative
  | IUserField<string>
  | ITrainerField
  | IUserEmail;

type TUserPayload = IUser[];

export const ADD_USER_INFORMATION = (payload: TUserPayload) =>
  serviceMaker(
    API_ENDPOINTS.add_user_information.url,
    API_ENDPOINTS.add_user_information.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );

export const GET_ALL_USER_INFO = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_information.url,
    API_ENDPOINTS.get_all_information.method
  );

export const UPDATE_INFO = (payload: TUserPayload) =>
  serviceMaker(
    API_ENDPOINTS.add_user_information.url,
    API_ENDPOINTS.add_user_information.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );

export const UPDATE_TRAINER_INFO = (payload: TUserPayload) =>
  serviceMaker(
    API_ENDPOINTS.add_trainer_information.url,
    API_ENDPOINTS.add_trainer_information.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );

export const GET_TRAINER_INFO = () =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_information.url,
    API_ENDPOINTS.get_trainer_information.method
  );
export const GET_TRAINER_INFO_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_information.url + `/${id}`,
    API_ENDPOINTS.get_trainer_information.method
  );
export const SWITCH_PROFILE = () =>
  serviceMaker(
    API_ENDPOINTS.switch_profile.url,
    API_ENDPOINTS.switch_profile.method
  );

export const GET_USER_THEME = () =>
  serviceMaker(
    API_ENDPOINTS.get_user_theme.url,
    API_ENDPOINTS.get_user_theme.method
  );

export const ADD_USER_THEME = (payload: IUserTheme) =>
  serviceMaker(
    API_ENDPOINTS.add_user_theme.url,
    API_ENDPOINTS.add_user_theme.method,
    payload
  );

export const GET_PROFILE_MENU_ITEMS = () =>
  serviceMaker(
    API_ENDPOINTS.profile_menu_items.url,
    API_ENDPOINTS.profile_menu_items.method
  );

export const ADD_USER_NOTIFICATION_TOKEN = (token: IUserNotificationToken) =>
  serviceMaker(
    API_ENDPOINTS.add_notification_token.url,
    API_ENDPOINTS.add_notification_token.method,
    token
  );

export const GET_ALL_ADDRESS = () =>
  serviceMaker(
    API_ENDPOINTS.get_all_address.url,
    API_ENDPOINTS.get_all_address.method
  );

export const ADD_USER_ADDRESS = (payload: IAddress) =>
  serviceMaker(
    API_ENDPOINTS.add_user_address.url,
    API_ENDPOINTS.add_user_address.method,
    payload
  );

export const GET_ADDRESS_BY_ID = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.get_all_address.url + `/${id}`,
    API_ENDPOINTS.get_all_address.method
  );

export const UPDATE_USER_ADDRESS = (payload: IAddress, id: number) =>
  serviceMaker(
    API_ENDPOINTS.update_user_address.url + `/${id}`,
    API_ENDPOINTS.update_user_address.method,
    payload
  );

export const DELETE_USER_ADDRESS = (id: number) =>
  serviceMaker(
    API_ENDPOINTS.delete_user_address.url + `/${id}`,
    API_ENDPOINTS.delete_user_address.method
  );

export const CHANGE_USER_DEFULT_ADDRESS = (payload: { id: number }) =>
  serviceMaker(
    API_ENDPOINTS.change_default_address.url,
    API_ENDPOINTS.change_default_address.method,
    payload
  );

export const GET_USER_DEFULT_ADDRESS = () =>
  serviceMaker(
    API_ENDPOINTS.get_default_address.url,
    API_ENDPOINTS.get_default_address.method
  );

export const GET_PRESIGNED_URL = (url: string) =>
  serviceMaker(
    API_ENDPOINTS.get_presigned_url.url + `/${url}`,
    API_ENDPOINTS.get_presigned_url.method
  );
export const GET_PUBLIC_PRESIGNED_URL = (url: string) =>
  serviceMaker(
    API_ENDPOINTS.get_public_presigned_url.url + `/${url}`,
    API_ENDPOINTS.get_public_presigned_url.method
  );
export const DELETE_PRESIGNED_URL = (url: string) =>
  serviceMaker(
    API_ENDPOINTS.delete_presigned_url.url + `/${url}`,
    API_ENDPOINTS.delete_presigned_url.method
  );

export const DELETE_USER = () =>
  serviceMaker(API_ENDPOINTS.delete_user.url, API_ENDPOINTS.delete_user.method);

export const GET_GEOCODE = (address: string) =>
  serviceMaker(
    API_ENDPOINTS.get_geocode.url,
    API_ENDPOINTS.get_geocode.method,
    { address }
  );

export const GET_LOCATION = (payload: ILocationLatLong) =>
  serviceMaker(
    API_ENDPOINTS.get_location.url,
    API_ENDPOINTS.get_location.method,
    payload
  );

export const ALTERNATE_OTP = (payload: IAlternateMobileNumber) =>
  serviceMaker(
    API_ENDPOINTS.alternate_otp.url,
    API_ENDPOINTS.alternate_otp.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );

  export const ADD_ADDRESS = (payload: IAddressModel) =>
    serviceMaker(
      API_ENDPOINTS.add_user_address.url,
      API_ENDPOINTS.add_user_address.method,
      payload
    );
