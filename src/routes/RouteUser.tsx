import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../screens/header/home-page/HomePageView";
import SlotBooking from "../screens/booking/BookingSlot";
import Profile from "../screens/header/profile/Profile";
import EditProfile from "../screens/header/profile/EditProfile";
import Search from "../screens/header/search/Search";
import Messages from "../screens/header/messages/Messages";
import Notifications from "../screens/header/notification/Notification";
import HomePageWebView from "../screens/header/home-page/Web/HomePageView";
import LibraryWeb from "../screens/library/LibraryWeb";
import BookingCancellationWeb from "../screens/booking/booking-cancellation/BookingCancellationWeb";
import ProductServiceDetailsWeb from "../screens/product-services/Web/ProductServiceDetailsWeb";
import ProductServicesDetails from "../screens/product-services/ProductServicesDetails";
import ProductServiceDescription from "../screens/product-services/ProductServiceDescription";
import BlogPost from "../screens/blog-post/BlogPost";
import Favorites from "../screens/favorites/Favorites";
import FolderDetail from "../components/FolderDetail";
import EventComponent from "../components/EventComponent";
import EventDetail from "../components/event-details/EventDetail";
import ServiceComponent from "../components/ServiceComponent";
import LibraryComponent from "../components/LibraryComponent";
import UserLayout from "../components/layouts/user/UserLayout";
import UseMobileLayoutHook from "../hooks/UseMobileLayoutHook";
import { commonRoute } from "./RouteCommon";
import AboutView from "../screens/about/AboutView";
import PrivacyPolicyView from "../screens/privacy-policy/PrivacyPolicyView";
import TermsServiceView from "../screens/terms-service/TermsServiceView";
import ProductServices from "../screens/product-services/ProductServiceCategory";
import ProductServiceCategoryWeb from "../screens/product-services/Web/ProductServiceDescriptionWeb";
import BookingList from "../screens/booking/booking-list/BookingList";
import Preferences from "../screens/preferences/preferences";
import ThemePreference from "../screens/preferences/theme-preference/ThemePreference";
import GrievanceView from "../screens/grievance/GrievanceView";
import AddUpdateGrievance from "../screens/grievance/AddGrievance";
import GrievanceConversation from "../screens/grievance/GrievanceConversation";
import Transactions from "../screens/transaction/Transaction";
import TransactionDetails from "../screens/transaction/TransactionDetails";
import TrainerDetailProfile from "../screens/trainer-detail-profile/TrainerDetailsProfile";
import AllPremiumPackage from "../screens/premium-package/AllPremiumPackage";
import MySubscriptionsView from "../screens/my-subscription/MySubscriptionsView";
import ZoomUser from "../components/zoom/ZoomUser";
import TrainerHelpCenter from "../screens/trainer-profile/trainer-help-center/TrainerHelpCenter";
import TrainerHelpTopic from "../screens/trainer-profile/trainer-help-center/TrainerHelpTopic";
import TrainerHelpTopicDetails from "../screens/trainer-profile/trainer-help-center/TrainerHelpTopicDetails";
import PostDetail from "../components/PostDetail";
import UserLocation from "../screens/user-location/UserLocation";
import Trainer from "../screens/trainer/Trainer";
import LibraryDetails from "../screens/library/LibraryDetails";
import InviteFriends from "../screens/invite-friends/InviteFriends";
import GeneralFaqs from "../screens/general-faqs/GeneralFaqs";

const RouterUser = () => {
  const { isMobile } = UseMobileLayoutHook();

  return (
    <Routes>
      <Route path={routeMasterUser.user} element={<UserLayout />}>
        <Route
          path={userRoute.home}
          element={isMobile ? <Home /> : <HomePageWebView />}
        />
        <Route path={userRoute.services} element={<ProductServices />} />
        <Route
          path={userRoute.serviceDescription}
          element={
            isMobile ? (
              <ProductServiceDescription />
            ) : (
              <ProductServiceCategoryWeb />
            )
          }
        />
        <Route
          path={userRoute.serviceDetails}
          element={
            isMobile ? <ProductServicesDetails /> : <ProductServiceDetailsWeb />
          }
        />
        <Route path={userRoute.serviceAll} element={<ServiceComponent />} />
        <Route path={userRoute.community} element={<BlogPost />} />
        <Route path={userRoute.profile} element={<Profile />} />
        <Route path={userRoute.favorites} element={<Favorites />} />
        <Route path={userRoute.editProfile} element={<EditProfile />} />
        <Route path={userRoute.search} element={<Search />} />
        <Route path={userRoute.slotBooking} element={<SlotBooking />} />
        <Route
          path={userRoute.bookingDetails}
          element={<BookingCancellationWeb />}
        />
        <Route path={userRoute.bookingList} element={<BookingList />} />
        <Route path={userRoute.messages} element={<Messages />} />
        <Route path={userRoute.notification} element={<Notifications />} />
        <Route path={userRoute.library} element={<LibraryWeb />} />
        <Route path={userRoute.folderDetail} element={<FolderDetail />} />
        <Route path={userRoute.libraryAll} element={<LibraryComponent />} />
        <Route path={userRoute.events} element={<EventComponent />} />
        <Route path={userRoute.eventDetail} element={<EventDetail />} />

        <Route path={userRoute.about} element={<AboutView />} />
        <Route path={userRoute.privacyPolicy} element={<PrivacyPolicyView />} />
        <Route
          path={userRoute.termsConditions}
          element={<TermsServiceView />}
        />
        <Route path={userRoute.themePreference} element={<ThemePreference />} />
        <Route path={userRoute.preference} element={<ThemePreference />} />
        {/* <Route path={userRoute.preference} element={<Preferences />} /> */}
        <Route path={userRoute.grievance} element={<GrievanceView />} />
        <Route
          path={userRoute.addUpdateGrievance}
          element={<AddUpdateGrievance />}
        />
        <Route
          path={userRoute.grievanceConversation}
          element={<GrievanceConversation />}
        />
        <Route path={userRoute.transaction} element={<Transactions />} />
        <Route
          path={userRoute.transactionDetails}
          element={<TransactionDetails />}
        />
        <Route
          path={userRoute.trainerDetailsProfile}
          element={<TrainerDetailProfile />}
        />
        <Route path={userRoute.zoom} element={<ZoomUser />} />
        <Route
          path={userRoute.premiumPackages}
          element={<AllPremiumPackage />}
        />
        <Route
          path={userRoute.subscriptions}
          element={<MySubscriptionsView />}
        />
        <Route path={userRoute.helpCenter} element={<TrainerHelpCenter />} />
        <Route path={userRoute.helpTopic} element={<TrainerHelpTopic />} />
        <Route
          path={userRoute.helpTopicDetails}
          element={<TrainerHelpTopicDetails />}
        />
        <Route path={userRoute.postDetail} element={<PostDetail />} />
        <Route path={userRoute.locations} element={<UserLocation />} />
        <Route path={userRoute.trainer} element={<Trainer />} />
        <Route path={userRoute.libraryDetails} element={<LibraryDetails />} />
        <Route path={userRoute.inviteFriends} element={<InviteFriends />} />
        <Route path={userRoute.generalFaqs} element={<GeneralFaqs />} />
      </Route>
    </Routes>
  );
};

export default RouterUser;

export const routeMasterUser = {
  user: "user",
};

export const userRoute: any = {
  home: `/${routeMasterUser.user}/home`,
  services: `/${routeMasterUser.user}/offerings`,
  serviceDescription: `/${routeMasterUser.user}/offering-description`,
  trainerDetailsProfile: `/${routeMasterUser.user}/trainer-detail-profile`,
  serviceDetails: `/${routeMasterUser.user}/offering-details`,
  serviceAll: `/${routeMasterUser.user}/offerings-all`,
  community: `/${routeMasterUser.user}/${commonRoute.community}`,
  profile: `/${routeMasterUser.user}/profile`,
  editProfile: `/${routeMasterUser.user}/edit-profile`,
  favorites: `/${routeMasterUser.user}/${commonRoute.favorites}`,
  search: `/${routeMasterUser.user}/search`,
  slotBooking: `/${routeMasterUser.user}/slot-booking`,
  bookingDetails: `/${routeMasterUser.user}/booking-details`,
  bookingList: `/${routeMasterUser.user}/booking-list`,
  messages: `/${routeMasterUser.user}/messages`,
  notification: `/${routeMasterUser.user}/notification`,
  library: `/${routeMasterUser.user}/${commonRoute.library}`,
  libraryAll: `/${routeMasterUser.user}/${commonRoute.libraryAll}`,
  folderDetail: `/${routeMasterUser.user}/${commonRoute.folderDetail}`,
  events: `/${routeMasterUser.user}/event-all`,
  eventDetail: `/${routeMasterUser.user}/event-detail`,
  about: `/${routeMasterUser.user}/${commonRoute.about}`,
  privacyPolicy: `/${routeMasterUser.user}/${commonRoute.privacyPolicy}`,
  termsConditions: `/${routeMasterUser.user}/${commonRoute.termsConditions}`,
  themePreference: `/${routeMasterUser.user}/${commonRoute.themePreference}`,
  preference: `/${routeMasterUser.user}/preference`,
  grievance: `/${routeMasterUser.user}/${commonRoute.grievance}`,
  grievanceConversation: `/${routeMasterUser.user}/${commonRoute.grievanceConversation}`,
  addUpdateGrievance: `/${routeMasterUser.user}/${commonRoute.addUpdateGrievance}`,
  premiumPackages: `/${routeMasterUser.user}/${commonRoute.premiumPackages}`,
  subscriptions: `/${routeMasterUser.user}/subscriptions`,
  transaction: `/${routeMasterUser.user}/${commonRoute.transaction}`,
  transactionDetails: `/${routeMasterUser.user}/${commonRoute.transactionDetails}`,
  zoom: `/${routeMasterUser.user}/zoom`,
  helpCenter: `/${routeMasterUser.user}/${commonRoute.helpCenter}`,
  helpTopic: `/${routeMasterUser.user}/${commonRoute.helpTopic}`,
  helpTopicDetails: `/${routeMasterUser.user}/${commonRoute.helpTopicDetails}`,
  postDetail: `/${routeMasterUser.user}/${commonRoute.postDetails}`,
  locations: `/${routeMasterUser.user}/locations`,
  trainer: `/${routeMasterUser.user}/join-as-trainer`,
  libraryDetails: `/${routeMasterUser.user}/${commonRoute.libraryDetails}`,
  inviteFriends: `/${routeMasterUser.user}/${commonRoute.inviteFriends}`,
  generalFaqs: `/${routeMasterUser.user}/${commonRoute.generalFaqs}`,
};
