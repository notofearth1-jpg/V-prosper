import {
  aboutIcon,
  bankInfo,
  bookingsIcon,
  certificateIcon,
  faqsIcon,
  grievanceIcon,
  inviteFriendsIcon,
  logOutIcon,
  messagesIcon,
  myLocationIcon,
  myPosts,
  privacyPolicyIcon,
  ratingIcon,
  serviceCategoryIcon,
  sessionIcon,
  shareIcon,
  subscriptionIcon,
  termsAndConditionIcon,
  trainerAvailabilityIcon,
  trainerIcon,
  transactionIcon,
} from "./../assets/icons/SvgIconList";
import { favoriteIcon, helpIcon, themeIcon } from "../assets/icons/SvgIconList";
import translationEN from "../locales/en.json";
import {
  DAYS_OF_WEEK,
  PAYMENT_TRANSACTION_STATUS,
  SEARCH_SUB_TABS,
  SEARCH_SUB_TABS_LABEL,
  SEARCH_TABS,
  SEARCH_TABS_LABEL,
  SHORT_QUESTION_RADIO_BUTTON_LABEL,
  TRANSACTION_FOR,
  USER_FLOW_STATUS,
} from "./AppEnumerations";
export const MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED =
  "unknown_error_occured_try_again";
export const MESSAGE_LOCAL_SUCCESS = "success";
export const DEFAULT_STATUS_CODE_UNKNOWN_ERROR = 500;
export const DEFAULT_STATUS_CODE_SUCCESS = 200;
export const DEFAULT_STATUS_CODE_UNAUTHORIZED = 401;
export const UNPROCESSABLE_ENTITY_CODE = 422;
export const MESSAGE_UNKNOWN_ERROR_OCCURRED = "Unknown error occurred!";
export const MESSAGE_TOKEN_EXPIRED = "TokenExpiredError";
export const ENCRYPTION_DECRYPTION_FAIL = 'EncryptionDecryptionFail';
export const DEFAULT_STATUS_CODE_NO_CONTENT = " ";
export const US_CURRENCY = "USD";
export const CAD_CURRENCY = "CAD";
export const INR_CURRENCY = "INR";
// const APP_LANGUAGES_JSON_FILE_LOCATION = "idf/src/locales/";

export const LANGUAGE_LIST = [
  {
    country_code: null,
    code: "en",
    name: "English",
    local_name: "English",
    path: translationEN,
  },
];

export const ORDER_BY = {
  desc: "DESC",
  asc: "ASC",
};

export const TooltipPosition = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4,
};

export const GENERIC_QUESTION_RADIO_BUTTON_OPTION = [
  {
    label: SHORT_QUESTION_RADIO_BUTTON_LABEL.Yes,
    value: true,
  },
  {
    label: SHORT_QUESTION_RADIO_BUTTON_LABEL.No,
    value: false,
  },
];

export const DEFAULT_CREATED_BY = "System Administrator";
export const DEFAULT_MODIFIED_BY = "System Administrator";

export const PAGINATION_PER_PAGE_ROWS = {
  Nine: 9,
  Twenty: 20,
  Ten: 10,
  Eight: 8,
  Five: 5,
  Three: 3,
  Twelve: 12,
  Forty: 40,
  Fifty: 50,
  Four: 4,
  Hundred: 100,
  Thousand: 1000,
  Six: 6,
};
export const FILE_NAME_MAX_LENGTH = 20;

export const TRANSACTION_FOR_LABEL = {
  [TRANSACTION_FOR.Booking]: "booking",
  [TRANSACTION_FOR.LibraryContent]: "library_content",
  [TRANSACTION_FOR.LibraryDirectory]: "library_directory",
  [TRANSACTION_FOR.Subscription]: "subscription_package",
  [TRANSACTION_FOR.Event]: "event",
};

export const TRANSACTION_STATUS_LABEL = {
  [PAYMENT_TRANSACTION_STATUS.Initiated]: "initiated",
  [PAYMENT_TRANSACTION_STATUS.Captured]: "captured",
  [PAYMENT_TRANSACTION_STATUS.Refunded]: "refunded",
  [PAYMENT_TRANSACTION_STATUS.Failed]: "failed",
};

export const menuIconsList: any = {
  helpIcon: helpIcon,
  themeIcon: themeIcon,
  favoriteIcon: favoriteIcon,
  bookingsIcon: bookingsIcon,
  transactionIcon: transactionIcon,
  messagesIcon: messagesIcon,
  serviceCategoryIcon: serviceCategoryIcon,
  myLocationIcon: myLocationIcon,
  sessionIcon: sessionIcon,
  myPosts: myPosts,
  subscriptionIcon: subscriptionIcon,
  aboutIcon: aboutIcon,
  termsAndConditionIcon: termsAndConditionIcon,
  privacyPolicyIcon: privacyPolicyIcon,
  shareIcon: shareIcon,
  grievanceIcon: grievanceIcon,
  trainerIcon: trainerIcon,
  ratingIcon: ratingIcon,
  certificateIcon: certificateIcon,
  trainerAvailabilityIcon: trainerAvailabilityIcon,
  logOutIcon: logOutIcon,
  bankInfo: bankInfo,
  inviteFriendsIcon: inviteFriendsIcon,
  faqsIcon: faqsIcon,
};
export const DAYS_OF_WEEK_LABEL = {
  [DAYS_OF_WEEK.Sunday]: "sun",
  [DAYS_OF_WEEK.Monday]: "mon",
  [DAYS_OF_WEEK.Tuesday]: "tue",
  [DAYS_OF_WEEK.Wednesday]: "wed",
  [DAYS_OF_WEEK.Thursday]: "thu",
  [DAYS_OF_WEEK.Friday]: "fri",
  [DAYS_OF_WEEK.Saturday]: "sat",
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthShortNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const searchSubTabItems = [
  {
    value: SEARCH_SUB_TABS.All,
    label: SEARCH_SUB_TABS_LABEL.All,
  },
  {
    value: SEARCH_SUB_TABS.Image,
    label: SEARCH_SUB_TABS_LABEL.Image,
  },
  {
    value: SEARCH_SUB_TABS.Video,
    label: SEARCH_SUB_TABS_LABEL.Video,
  },
  {
    value: SEARCH_SUB_TABS.Audio,
    label: SEARCH_SUB_TABS_LABEL.Audio,
  },
  {
    value: SEARCH_SUB_TABS.Pdf,
    label: SEARCH_SUB_TABS_LABEL.Pdf,
  },
  {
    value: SEARCH_SUB_TABS.Directory,
    label: SEARCH_SUB_TABS_LABEL.Directory,
  },
];
export const searchTabItems = [
  {
    value: SEARCH_TABS.Services,
    label: SEARCH_TABS_LABEL.Services,
  },
  {
    value: SEARCH_TABS.Blogs,
    label: SEARCH_TABS_LABEL.Blogs,
  },
  {
    value: SEARCH_TABS.Library,
    label: SEARCH_TABS_LABEL.Library,
  },
];

export const userFlowStatusValue = [
  {
    title: "basic_Information",
    value: USER_FLOW_STATUS.BasicInfo,
  },
  // {
  //   title: "alternate_mobile_number",
  //   value: USER_FLOW_STATUS.AlternateMobile,
  // },
  // {
  //   title: "address",
  //   value: USER_FLOW_STATUS.UserAddress,
  // },
  {
    title: "gender",
    value: USER_FLOW_STATUS.UserGender,
  },
  {
    title: "date_of_birth",
    value: USER_FLOW_STATUS.UserBirthDate,
  },
  // {
  //   title: "health_details",
  //   value: USER_FLOW_STATUS.UserHealth,
  // },
  // {
  //   title: "wellness_interests",
  //   value: USER_FLOW_STATUS.UserInterests,
  // },
  {
    title: "language_preferences",
    value: USER_FLOW_STATUS.UserLanguage,
  },
];
