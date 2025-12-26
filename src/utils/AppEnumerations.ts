export enum SERVICE_METHODS {
  GET = "GET",
  GET_CONFIG = "GET_CONFIG",
  POST = "POST",
  POST_CONFIG = "POST_CONFIG",
  PUT = "PUT",
  PUT_CONFIG = "PUT_CONFIG",
  DELETE = "DELETE",
  DELETE_CONFIG = "DELETE_CONFIG",
  REQUEST = "REQUEST",
}

export enum LOCAL_STORAGE_KEYS {
  AccessToken = "AccessToken",
  UserInfo = "UserInfo",
  TrainerDetails = "trainerDetails",
  userId = "userId",
  keyCode = "keyCode",
  trainerId = "trainerId",
  AlternatePhone = "AlternatePhone",
  UserName = "UserName",
  ProfileUrl = "ProfileUrl",
  AlternateProfileUrl = "AlternateProfileUrl",
  AlternateProfileName = "AlternateProfileName",
  MultipleProfile = "MultipleProfile",
  RelationId = "RelationId",
  FullName = "FullName",
  AddressLine1 = "AddressLine1",
  AddressLine2 = "AddressLine2",
  AddressLine3 = "AddressLine3",
  City = "City",
  StateId = "StateId",
  Postcode = "Postcode",
  Type = "Type",
  Value = "Value",
  BirthDayType = "BirthDayType",
  BirthDayValue = "BirthDayValue",
  Answer = "Answer",
  Interest = "Interest",
  Role = "Role",
  RefreshToken = "RefreshToken",
  ProfileMenuItems = "ProfileMenuItems",
  AppliedFilters = "AppliedFilters",
  Theme = "Theme",
  hasSeenSplashScreen = "hasSeenSplashScreen",
  ProfileStatus = "ProfileStatus",
  Email = "Email",
  IsAlternateMobileVerify = "IsAlternateMobileVerify",
  BloodGroup = "BloodGroup",
  AddressLabel = "AddressLabel",
  ApplicationId = "ApplicationId",
  CryptoKey = "CryptoKey",
}

export enum DATE_FORMAT {
  "DD-Mon-YYYY" = 1, // 01-Mar-2023
  "DD-MM-YYYY" = 2, // 01-03-2023
  "YYYY-MM-DD" = 3, // 2023-01-03
  "MM-DD-YYYY" = 4,
}

export enum THEMES {
  Light = "Light",
  Dark = "Dark",
  Cold = "Cold",
  Winter = "Winter",
}

export enum FORGOT_PASSWORD_FLOW_STATUS {
  EmailId = 1,
  OTP = 2,
  SetPassword = 3,
}
export enum TIME_FORMAT {
  "hh:mm XM" = 1,
  "hh:mm" = 2,
}

export enum USER_FLOW_STATUS {
  BasicInfo = 0,
  // AlternateMobile = 1,
  // AltMobileVerify = 2,
  // UserAddress = 3,
  UserGender = 1,
  UserBirthDate = 2,
  // UserHealth = 6,
  // UserInterests = 7,
  UserLanguage = 3,
}

export enum APPLICATION_STATUS {
  Draft = 1,
  SubmittedForReview = 2,
  ReviewInProgress = 3,
  ChangeRequested = 4,
  ScheduledInterview = 5,
  Hold = 6,
  Rejected = 7,
  Approved = 8,
  Archive = 9,
  Locked = 10,
  PartialApproved = 11,
}

export enum PROOF_TYPE {
  Identity = "identity",
  Address = "address",
}

export enum TRAINER_ON_BOARD {
  TrainerWellness = 0,
  TrainerGrowth = 1,
  TrainerProfileOverview = 2,
  TrainerAgreement = 3,
  TrainerCategory = 4,
  TrainerCity = 5,
  TrainerAddress = 6,
  TrainerGender = 7,
  TrainerBirthDate = 8,
  TrainerEvents = 9,
  TrainerHealth = 10,
  TrainerSpace = 11,
  TrainerIdentity = 12,
  TrainerCertificates = 13,
  TrainerVerification = 14,
  TrainerKeycodeUpload = 15,
  TrainerReviewApplication = 16,
}

export enum FILE_TYPE {
  "PDF" = "PDF",
  "IMAGE" = "IMAGE",
  "AUDIO" = "AUDIO",
  "DIRECTORY" = "DIRECTORY",
  "VIDEO" = "VIDEO",
}
export enum FILE_TYPE_DIRECTORY {
  "DIRECTORY" = "1",
}
export enum IS_FAV {
  isTrue = "1",
  isFalse = "0",
}
export enum FAV_TABS {
  services = 1,
  library = 2,
}
export enum SUBSCRIPTION_TABS {
  PremiumPackage = 1,
  Library = 2,
  Event = 3,
}

export enum IS_PAID_EVENT {
  isTrue = "1",
  isFalse = "0",
}
export enum VIEW_TYPE {
  Trending = "trending",
  Discover = "discover",
  Other = "other",
  FreeService = "freeService",
  ServiceCategory = "ServiceCategory",
}

export enum MEDIA_TYPE {
  image = "i",
  video = "v",
  pdf = "p",
}

export enum IS_FAV_PAYLOAD {
  isTrue = "1",
  isFalse = "0",
}
export enum BLOG_DATA_PUBLISHED {
  isTrue = "1",
  isFalse = "0",
}
export enum BLOG_POST_ANONYMOUSLY {
  isTrue = "1",
  isFalse = "0",
}
export enum IS_ADMIN {
  isTrue = "1",
  isFalse = "0",
}
// Define enums
export enum IDENTIFY_PROOF {
  PanCard = 1,
  AadhaarCard = 2,
  ElectionCard = 3,
  DrivingLicence = 4,
}

export enum ADDRESS_PROOF {
  AadhaarCard = 1,
  ElectionCard = 2,
}

export enum PROOF_LABEL {
  PanCard = "PanCard",
  AadhaarCard = "AadhaarCard",
  ElectionCard = "ElectionCard",
  DrivingLicence = "DrivingLicence",
}

export enum PROFILE_OVERVIEW {
  Framework = 1,
  Questionnaire = 2,
  UploadDocuments = 3,
  IdentityVerification = 4,
  Interview = 5,
}

export enum TRAINER_APPLICATION_DOCUMENT_SECTION {
  IdentityVerification = 1,
  AddressVerification = 2,
  KeycodeVerification = 3,
}

export enum SHORT_QUESTION_RADIO_BUTTON_LABEL {
  Yes = "Yes",
  No = "No",
}

export enum GrievancesStatus {
  Pending = 1,
  InReview = 2,
  Closed = 3,
}
export enum APP_CONTENT_TYPE {
  AboutVp = 1,
  PrivacyPolicy = 2,
  TermsOfService = 3,
  VPContact = 4,
}
export enum CONTACT_US_TYPE {
  "contact_number" = "Contact Number",
  "email_address" = "Email Address",
  "address" = "Address",
}
export enum FILE_UPLOAD {
  Pdf = "application/pdf",
  Png = "image/png",
  Jpeg = "image/jpeg",
  Video = "video/mp4",
}
export enum CAROUSEL_NEXT_PREV_BUTTON_VALUE {
  Next = "next",
  Previous = "previous",
}

export enum CAROUSEL_SLIDE_PRE_CLICK {
  One = 1,
}

export enum USER_ROLE {
  SuperAdmin = 1,
  Customer = 2,
  Trainer = 3,
}
export enum FILE_UPLOAD_TYPE {
  Pdf = "pdf",
  Png = "png",
  Jpeg = "jpeg",
  Video = "mp4",
  Jpg = "jpg",
}

export enum SERVICE_TYPE {
  Days = "Days",
  Hours = "Hours",
  Months = "Months",
  Weeks = "Weeks",
}

export enum DAYS_Of_WEEK {
  Sunday = "Sun",
  Monday = "Mon",
  Tuesday = "Tue",
  Wednesday = "Wed",
  Thursday = "Thu",
  Friday = "Fri",
  Saturday = "Sat",
}

export enum CURRENCY {
  INR = "₹",
}

export enum TRANSACTION_TYPE {
  Debit = "Debit",
  Credit = "Credit",
}

export enum TRANSACTION_TYPE_LABEL {
  Debit = "D",
  Credit = "C",
}

export enum TRANSACTION_FOR {
  Booking = "booking",
  LibraryDirectory = "library_directory",
  LibraryContent = "library_content",
  Subscription = "subscription",
  Event = "event",
}

export enum BOOKING_STATUS {
  AwaitingConfirmation = 1,
  BookingConfirmed = 2,
  Cancelled = 3,
  Failed = 4,
}

export enum FEEDBACK_GIVEN {
  Yes = "1",
  No = "0",
}

export enum IS_PREMIUM {
  Yes = "1",
  No = "0",
}
export enum IS_SUBSCRIBED {
  Yes = "1",
  No = "0",
}

export enum ENTITY_TYPE {
  SubscriptionPackages = 2,
  LibraryDirectory = 3,
  LibraryContent = 4,
  Event = 5,
}
export enum BUBBLE_CONTENTS {
  "work_responsibility" = "Work Responsibility",
  "home_responsibility" = "Home Responsibility",
  "poor_mental_health" = "Poor Mental Health",
  "bad_food_habits" = "Bad Food Habits",
  "poor_sleep" = "Poor Sleep",
  "less_communication_with_family" = "Less Communication with family",
  "anxiety" = "Anxiety",
  "no_message" = "No message",
  "wellness_values" = "Wellness Values",
  "wisdom" = "Wisdom",
  "healing_techniques" = "Healing Techniques",
  "less_energy_leakages" = "Less Energy Leakages",
  "balance" = "Balance",
  "wellness_community" = "Wellness Community",
  "support" = "Support",
}
export enum BUBBLE_REVERSE_CONTENT {
  "diseases" = "Diseases",
  "depression" = "Depression",
  "negativity" = "Negativity",
  "loneliness" = "Loneliness",
  "anxiety" = "Anxiety",
  "weakness" = "Weakness",
  "stress" = "STRESS",
}
export enum MONTHS_NUMBER {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum DAYS_OF_WEEK {
  Sunday = "Sun",
  Monday = "Mon",
  Tuesday = "Tue",
  Wednesday = "Wed",
  Thursday = "Thu",
  Friday = "Fri",
  Saturday = "Sat",
}

export enum ZOOM_MEETING_ROLE {
  Trainer = 1,
  User = 2,
}

export enum SEARCH_TABS {
  Services = "1",
  Library = "2",
  Blogs = "3",
}
export enum SEARCH_TABS_LABEL {
  Services = "service",
  Library = "library",
  Blogs = "blog",
}
export enum SEARCH_SUB_TABS {
  All = "All",
  Image = "IMAGE",
  Pdf = "PDF",
  Video = "VIDEO",
  Audio = "AUDIO",
  Directory = "DIRECTORY",
}
export enum SEARCH_SUB_TABS_LABEL {
  All = "All",
  Image = "Image",
  Pdf = "PDF",
  Video = "Video",
  Audio = "Audio",
  Directory = "Directory",
}

export enum SEARCH_CATEGORY {
  Service = 1,
  Blog = 2,
  LibraryContent = 3,
  LibraryDirectory = 4,
}

export enum LIBRARY_VIEW_TYPE {
  Trending = "T",
  Discover = "D",
  Other = "O",
}

export enum PAYMENT_TRANSACTION_STATUS {
  Initiated = 1,
  Captured = 2,
  Refunded = 3,
  Failed = 4,
}

export enum IS_OFFLINE {
  Yes = "1",
  No = "0",
}

export enum IS_OFFLINE_VALUES {
  Offline = "offline",
  Online = "online",
}

export enum IS_DEFAULT {
  Yes = "1",
  No = "0",
}

export enum REPORT_ID {
  TotalRevenue = 1,
  MonthlyServiceRevenue = 2,
  MonthlySubscriptionRevenue = 3,
  TotalSession = 4,
  VisitorsImpression = 5,
  TopServices = 6,
  ServiceCategoryWiseSession = 7,
  TrainerRating = 8,
}

export enum USER_STATUS {
  PendigVerification = 1,
  Verified = 2,
  ProfileCompleted = 3,
}

export enum LIBRARY_FILE_TYPE {
  Pdf = 1,
  Image = 2,
  Video = 3,
  Audio = 4,
  Directory = 5,
}

export enum IMAGE_TYPE {
  Highlight = "1",
  Services = "2",
  Identity = "3",
  Post = "4",
  Events = "5",
  Blogs = "6",
  Profile = "7",
  Certificates = "8",
  Session = "9",
  Grievances = "15",
}
export enum ICIMAGE_TYPE {
  Video = "video",
}
export enum DEVICE_TYPES {
  Mobile = "Mobile",
  Tablet = "Tablet",
  Laptop = "Laptop",
}
export enum PUBLIC_HEADER_TABS {
  Home = "home",
  AboutUs = "aboutUs",
  ContactUs = "contactUs",
  Events = "events",
  Offerings = "offering",
  Insights = "insights",
  PrivacyPolicy = "privacyPolicy",
  TermsAndCondition = "termsAndCondition",
}
export enum PUBLIC_TABS {
  Home = "Home | V Prosper",
  AboutUs = "About-us | V Prosper",
  ContactUs = "Contact-us | V Prosper",
  Events = "Events | V Prosper",
  Offerings = "Offerings | V Prosper",
  Insights = "Insights | V Prosper",
  PrivacyPolicy = "Privacy-Policy | V Prosper",
  TermsAndCondition = "Terms and Condition | V Prosper",
  VProsper = "V Prosper",
}

export enum SYSTEM_CONFIGURATION_KEYS {
  FrameworkAgreement = "framework_agreement",
  PanNote = "pan_note",
  PwaVersion = "pwa_app_version",
}

export enum IS_PUBLISHED {
  Yes = "1",
  No = "0",
}

export enum DETAILS_TYPE {
  Service = "service",
  CourseContent = "Course Content",
}

export enum USER_TYPE {
  Customer = "U",
  Trainer = "T",
}

export enum BIT_VALUE {
  One = "1",
  Zero = "0",
}
