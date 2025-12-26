import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import TrainerLayout from "../components/layouts/trainer/TrainerLayout";
import TrainerTask from "../screens/trainer-task/TrainerTask";
import TrainerProfile from "../screens/trainer-profile/TrainerProfile";
import EditTrainerProfile from "../screens/trainer-profile/EditTrainerProfile";
import TrainerDetailProfile from "../screens/trainer-detail-profile/TrainerDetailsProfile";
import TrainerAvailabilityView from "../screens/trainer-availability/TrainerAvailabilityView";
import TrainerCreatePost from "../screens/blog-post/trainer-create-blog-post/TrainerCreateBlogPost";
import TrainerProfileCertificates from "../screens/trainer-profile/trainer-profile-certificates/TrainerProfileCertificates";
import MyPosts from "../screens/blog-post/trainer-create-blog-post/MyPosts";
import PostDetail from "../components/PostDetail";
import TrainerHelpCenter from "../screens/trainer-profile/trainer-help-center/TrainerHelpCenter";
import TrainerHelpTopic from "../screens/trainer-profile/trainer-help-center/TrainerHelpTopic";
import TrainerHelpTopicDetails from "../screens/trainer-profile/trainer-help-center/TrainerHelpTopicDetails";
import TrainerPreferredServiceView from "../screens/trainer-preferred-service/TrainerPreferredServiceView";
import TrainerPreferredLocationView from "../screens/trainer-preferred-location/TrainerPreferredLocationView";
import TrainerDashboard from "../screens/trainer-home/TrainerDashboard";
import UseMobileLayoutHook from "../hooks/UseMobileLayoutHook";
import AboutView from "../screens/about/AboutView";
import { commonRoute } from "./RouteCommon";
import PrivacyPolicyView from "../screens/privacy-policy/PrivacyPolicyView";
import TermsServiceView from "../screens/terms-service/TermsServiceView";
import Post from "../screens/blog-post/BlogPost";
import ZoomTrainer from "../components/zoom/ZoomTrainer";
import TrainerAllTasks from "../screens/trainer-task/TrainerAllTasks";
import LibraryWeb from "../screens/library/LibraryWeb";
import Preferences from "../screens/preferences/preferences";
import GrievanceView from "../screens/grievance/GrievanceView";
import MySubscriptionsView from "../screens/my-subscription/MySubscriptionsView";
import ThemePreference from "../screens/preferences/theme-preference/ThemePreference";
import GrievanceConversation from "../screens/grievance/GrievanceConversation";
import AddUpdateGrievance from "../screens/grievance/AddGrievance";
import AllPremiumPackage from "../screens/premium-package/AllPremiumPackage";
import LibraryComponent from "../components/LibraryComponent";
import Transactions from "../screens/transaction/Transaction";
import TransactionDetails from "../screens/transaction/TransactionDetails";
import Favorites from "../screens/favorites/Favorites";
import FolderDetail from "../components/FolderDetail";
import LibraryDetails from "../screens/library/LibraryDetails";
import BankInfoView from "../screens/bank-info/BankInfoView";
import InviteFriends from "../screens/invite-friends/InviteFriends";
import GeneralFaqs from "../screens/general-faqs/GeneralFaqs";

const RouteTrainer = () => {
  return (
    <Routes>
      <Route path={routeMasterTrainer.trainer} element={<TrainerLayout />}>
        <Route path={routeTrainer.trainerTask} element={<TrainerTask />} />
        <Route path={routeTrainer.community} element={<Post />} />
        <Route
          path={routeTrainer.trainerProfile}
          element={<TrainerProfile />}
        />
        <Route
          path={routeTrainer.trainerEditProfile}
          element={<EditTrainerProfile />}
        />
        <Route
          path={routeTrainer.trainerDetailsProfile}
          element={<TrainerDetailProfile />}
        />

        <Route
          path={routeTrainer.trainerAvailability}
          element={<TrainerAvailabilityView />}
        />
        <Route
          path={routeTrainer.trainerAddPost}
          element={<TrainerCreatePost />}
        />
        <Route
          path={routeTrainer.trainerProfileCertificate}
          element={<TrainerProfileCertificates />}
        />
        {/* feature use */}
        {/* <Route path={routeTrainer.myPosts} element={<MyPosts />} /> */}

        <Route path={routeTrainer.postDetail} element={<PostDetail />} />
        <Route path={routeTrainer.helpCenter} element={<TrainerHelpCenter />} />
        <Route path={routeTrainer.helpTopic} element={<TrainerHelpTopic />} />
        <Route
          path={routeTrainer.helpTopicDetails}
          element={<TrainerHelpTopicDetails />}
        />
        <Route
          path={routeTrainer.preferredService}
          element={<TrainerPreferredServiceView />}
        />
        <Route
          path={routeTrainer.preferredLocation}
          element={<TrainerPreferredLocationView />}
        />
        <Route path={routeTrainer.trainerHome} element={<TrainerDashboard />} />

        <Route path={routeTrainer.about} element={<AboutView />} />
        <Route
          path={routeTrainer.privacyPolicy}
          element={<PrivacyPolicyView />}
        />
        <Route
          path={routeTrainer.termsConditions}
          element={<TermsServiceView />}
        />
        <Route path={routeTrainer.zoom} element={<ZoomTrainer />} />
        <Route path={routeTrainer.allTask} element={<TrainerAllTasks />} />
        <Route path={routeTrainer.library} element={<LibraryWeb />} />
        <Route path={routeTrainer.preference} element={<ThemePreference />} />
        {/* <Route path={routeTrainer.preference} element={<Preferences />} /> */}
        <Route path={routeTrainer.grievance} element={<GrievanceView />} />
        <Route
          path={routeTrainer.subscriptions}
          element={<MySubscriptionsView />}
        />
        <Route
          path={routeTrainer.themePreference}
          element={<ThemePreference />}
        />
        <Route
          path={routeTrainer.grievanceConversation}
          element={<GrievanceConversation />}
        />
        <Route
          path={routeTrainer.addUpdateGrievance}
          element={<AddUpdateGrievance />}
        />
        <Route
          path={routeTrainer.premiumPackages}
          element={<AllPremiumPackage />}
        />
        <Route path={routeTrainer.libraryAll} element={<LibraryComponent />} />
        <Route path={routeTrainer.transaction} element={<Transactions />} />
        <Route
          path={routeTrainer.transactionDetails}
          element={<TransactionDetails />}
        />
        <Route path={routeTrainer.favorites} element={<Favorites />} />
        <Route path={routeTrainer.folderDetail} element={<FolderDetail />} />
        <Route
          path={routeTrainer.libraryDetails}
          element={<LibraryDetails />}
        />
        <Route path={routeTrainer.trainerBankInfo} element={<BankInfoView />} />
        <Route path={routeTrainer.inviteFriends} element={<InviteFriends />} />
        <Route path={routeTrainer.generalFaqs} element={<GeneralFaqs />} />
      </Route>
    </Routes>
  );
};
export default RouteTrainer;

export const routeMasterTrainer = {
  trainer: `trainer`,
};

export const routeTrainer = {
  trainerCertificate: `/${routeMasterTrainer.trainer}/trainer-certificate`,
  trainerIdentity: `/${routeMasterTrainer.trainer}/trainer-Identity`,
  trainerDetailsProfile: `/${routeMasterTrainer.trainer}/trainer-detail-profile`,
  trainerHome: `/${routeMasterTrainer.trainer}/trainer-home`,
  trainerTask: `/${routeMasterTrainer.trainer}/trainer-task`,
  community: `/${routeMasterTrainer.trainer}/${commonRoute.community}`,
  createPost: `/${routeMasterTrainer.trainer}/create-post`,
  library: `/${routeMasterTrainer.trainer}/${commonRoute.library}`,
  trainerProfile: `/${routeMasterTrainer.trainer}/trainer-profile`,
  trainerEditProfile: `/${routeMasterTrainer.trainer}/edit-TrainerProfile`,
  trainerAvailability: `/${routeMasterTrainer.trainer}/trainer-availability`,
  trainerAddPost: `/${routeMasterTrainer.trainer}/add-trainer-post`,
  trainerProfileCertificate: `/${routeMasterTrainer.trainer}/trainer-profile-certificate`,
  helpCenter: `/${routeMasterTrainer.trainer}/${commonRoute.helpCenter}`,
  helpTopic: `/${routeMasterTrainer.trainer}/${commonRoute.helpTopic}`,
  helpTopicDetails: `/${routeMasterTrainer.trainer}/${commonRoute.helpTopicDetails}`,
  // feature use
  // myPosts: `/${routeMasterTrainer.trainer}/my-posts`,
  postDetail: `/${routeMasterTrainer.trainer}/${commonRoute.postDetails}`,
  preferredService: `/${routeMasterTrainer.trainer}/preferred-service`,
  preferredLocation: `/${routeMasterTrainer.trainer}/preferred-location`,
  zoom: `/${routeMasterTrainer.trainer}/zoom`,
  // trainerVerification: `/${routeMasterTrainer.trainer}/trainer-verification`,
  about: `/${routeMasterTrainer.trainer}/${commonRoute.about}`,
  termsConditions: `/${routeMasterTrainer.trainer}/${commonRoute.termsConditions}`,
  privacyPolicy: `/${routeMasterTrainer.trainer}/${commonRoute.privacyPolicy}`,
  preference: `/${routeMasterTrainer.trainer}/${commonRoute.preference}`,
  allTask: `/${routeMasterTrainer.trainer}/all-tasks`,
  grievance: `/${routeMasterTrainer.trainer}/${commonRoute.grievance}`,
  subscriptions: `/${routeMasterTrainer.trainer}/${commonRoute.subscriptions}`,
  themePreference: `/${routeMasterTrainer.trainer}/${commonRoute.themePreference}`,
  grievanceConversation: `/${routeMasterTrainer.trainer}/${commonRoute.grievanceConversation}`,
  addUpdateGrievance: `/${routeMasterTrainer.trainer}/${commonRoute.addUpdateGrievance}`,
  premiumPackages: `/${routeMasterTrainer.trainer}/${commonRoute.premiumPackages}`,
  libraryAll: `/${routeMasterTrainer.trainer}/${commonRoute.libraryAll}`,
  transaction: `/${routeMasterTrainer.trainer}/${commonRoute.transaction}`,
  transactionDetails: `/${routeMasterTrainer.trainer}/${commonRoute.transactionDetails}`,
  favorites: `/${routeMasterTrainer.trainer}/${commonRoute.favorites}`,
  folderDetail: `/${routeMasterTrainer.trainer}/${commonRoute.folderDetail}`,
  libraryDetails: `/${routeMasterTrainer.trainer}/${commonRoute.libraryDetails}`,
  trainerBankInfo: `/${routeMasterTrainer.trainer}/bank-info`,
  inviteFriends: `/${routeMasterTrainer.trainer}/${commonRoute.inviteFriends}`,
  generalFaqs: `/${routeMasterTrainer.trainer}/${commonRoute.generalFaqs}`,
};
