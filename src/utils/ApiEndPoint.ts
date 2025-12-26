import { SERVICE_METHODS } from "./AppEnumerations";

export const API_ENDPOINTS = {
  login: { url: `login`, method: SERVICE_METHODS.POST },
  verify_otp: { url: `verify-otp`, method: SERVICE_METHODS.POST },
  resend_otp: { url: `resend-otp`, method: SERVICE_METHODS.POST },
  logout: { url: `logout`, method: SERVICE_METHODS.POST },
  crypto: { url: `cpr`, method: SERVICE_METHODS.POST_CONFIG },
  global_drop_down: { url: `ddl`, method: SERVICE_METHODS.POST },
  alternate_otp: {
    url: `alternate-otp`,
    method: SERVICE_METHODS.POST,
  },
  add_user_information: {
    url: `user-information`,
    method: SERVICE_METHODS.POST,
  },
  add_trainer_information: {
    url: `trainer-information`,
    method: SERVICE_METHODS.POST,
  },
  get_trainer_information: {
    url: `trainer-information`,
    method: SERVICE_METHODS.GET,
  },
  get_all_information: { url: `user-information`, method: SERVICE_METHODS.GET },
  get_all_services_category: {
    url: `service-category`,
    method: SERVICE_METHODS.GET,
  },
  get_all_service_sub_categories: {
    url: `service-subcategory`,
    method: SERVICE_METHODS.GET,
  },
  get_all_services_by_sub_category: {
    url: `serviceBySubcategory`,
    method: SERVICE_METHODS.GET,
  },
  get_all_service: {
    url: `service`,
    method: SERVICE_METHODS.GET,
  },
  get_all_faq: {
    url: `svcfaq`,
    method: SERVICE_METHODS.GET,
  },
  get_general_faq: {
    url: `gen-faqs`,
    method: SERVICE_METHODS.GET,
  },
  get_all_story: {
    url: `highlights`,
    method: SERVICE_METHODS.GET,
  },
  get_all_library_content: {
    url: `lc`,
    method: SERVICE_METHODS.GET,
  },
  get_library_directory: {
    url: `ld`,
    method: SERVICE_METHODS.GET,
  },
  get_library_hierarchy: {
    url: `lib-hierarchy`,
    method: SERVICE_METHODS.GET,
  },
  get_all_library: {
    url: `lib`,
    method: SERVICE_METHODS.GET,
  },
  get_all_premium_packages: {
    url: `subscription-package`,
    method: SERVICE_METHODS.GET,
  },
  add_premium_package_booking: {
    url: `subscription`,
    method: SERVICE_METHODS.POST,
  },
  get_library_directory_payment_summary: {
    url: `/ld`,
    method: SERVICE_METHODS.GET,
  },
  get_library_content_payment_summary: {
    url: `/lc`,
    method: SERVICE_METHODS.GET,
  },
  get_all_trainer_availability: {
    url: `trainer`,
    method: SERVICE_METHODS.GET,
  },
  add_user_favorite: { url: `favorites`, method: SERVICE_METHODS.POST },
  get_all_user_favorites: { url: `favorites`, method: SERVICE_METHODS.GET },
  add_trainer_details: { url: `user`, method: SERVICE_METHODS.POST },
  get_trainer_details_by_id: { url: `user`, method: SERVICE_METHODS.GET },
  get_trainer_keycode_by_id: {
    url: `application`,
    method: SERVICE_METHODS.GET,
  },
  add_trainer_application: { url: `application`, method: SERVICE_METHODS.POST },
  switch_profile: { url: `switch-interface`, method: SERVICE_METHODS.POST },

  get_all_blog_posts: { url: `blog`, method: SERVICE_METHODS.GET },
  get_my_blog_posts: { url: `my-blog`, method: SERVICE_METHODS.GET },
  get_blog_post_by_id: { url: `blog`, method: SERVICE_METHODS.GET },
  get_all_events: { url: `event`, method: SERVICE_METHODS.GET },
  get_events: { url: `pevents`, method: SERVICE_METHODS.GET },
  get_events_by_id: { url: `pevent`, method: SERVICE_METHODS.GET },
  add_error_handling_token: { url: `err`, method: SERVICE_METHODS.POST },
  add_error_handling_public_token: {
    url: `perr`,
    method: SERVICE_METHODS.POST,
  },
  add_zoom_meeting_session: {
    url: `generate-signature`,
    method: SERVICE_METHODS.POST,
  },
  get_all_service_course_content: {
    url: `service-courseContent`,
    method: SERVICE_METHODS.GET,
  },
  add_trainer: { url: `trainer`, method: SERVICE_METHODS.POST },
  update_trainer: { url: `trainer`, method: SERVICE_METHODS.PUT },
  delete_trainer_availability: {
    url: `trainer`,
    method: SERVICE_METHODS.DELETE,
  },
  create_post_for_trainer: { url: `blog`, method: SERVICE_METHODS.POST },
  event_registration: {
    url: `event-registration`,
    method: SERVICE_METHODS.POST,
  },
  get_all_grievance: { url: `grievances`, method: SERVICE_METHODS.GET },
  add_grievance: { url: "grievances", method: SERVICE_METHODS.POST },
  update_grievance: { url: "grievances", method: SERVICE_METHODS.PUT },
  get_grievance_by_id: { url: "grievances", method: SERVICE_METHODS.GET },
  mark_read_grievance: {
    url: "mark-read-grievances",
    method: SERVICE_METHODS.POST,
  },
  add_grievance_conversation: {
    url: "/grievances-conversation",
    method: SERVICE_METHODS.POST,
  },
  update_grievance_conversation: {
    url: "/grievances-conversation",
    method: SERVICE_METHODS.PUT,
  },
  get_grievance_bookings: {
    url: "/grievance-booking",
    metod: SERVICE_METHODS.GET,
  },
  get_all_trainer_certificates: {
    url: `trainer-certificates`,
    method: SERVICE_METHODS.GET,
  },
  add_trainer_certificate: {
    url: `trainer-certificates`,
    method: SERVICE_METHODS.POST,
  },
  update_trainer_certificate: {
    url: `trainer-certificates`,
    method: SERVICE_METHODS.PUT,
  },
  delete_trainer_certificate: {
    url: `trainer-certificates`,
    method: SERVICE_METHODS.DELETE,
  },
  delete_blog_post: { url: `blog`, method: SERVICE_METHODS.DELETE },
  update_blog_post: { url: `blog`, method: SERVICE_METHODS.PUT },
  get_all_help_category: {
    url: `help-category`,
    method: SERVICE_METHODS.GET,
  },
  // Like Blog Post By Id
  update_like_by_id: {
    url: `blog`,
    method: SERVICE_METHODS.POST,
  },
  get_all_system_help: {
    url: `system-help`,
    method: SERVICE_METHODS.GET,
  },

  // trainer preferred service
  get_all_preferred_services: {
    url: `trainer-preferred-service`,
    method: SERVICE_METHODS.GET,
  },
  get_remaining_preferred_services: {
    url: `remaining-trainer-preferred-service`,
    method: SERVICE_METHODS.GET,
  },

  add_preferred_service: {
    url: `trainer-preferred-service`,
    method: SERVICE_METHODS.POST,
  },

  start_offline_session: {
    url: `start-offline-session`,
    method: SERVICE_METHODS.POST,
  },
  end_offline_session: {
    url: `end-offline-session`,
    method: SERVICE_METHODS.POST,
  },
  resend_session_otp: {
    url: `send-session-otp`,
    method: SERVICE_METHODS.POST,
  },
  delete_preferred_service: {
    url: `trainer-preferred-service`,
    method: SERVICE_METHODS.DELETE,
  },

  // trainer preferred location
  get_all_preferred_locations: {
    url: `trainer-preferred-locations`,
    method: SERVICE_METHODS.GET,
  },
  get_default_location: {
    url: `trainer-default-location`,
    method: SERVICE_METHODS.GET,
  },
  get_remaining_preferred_locations: {
    url: `remaining-trainer-preferred-locations`,
    method: SERVICE_METHODS.GET,
  },
  add_preferred_location: {
    url: `trainer-preferred-locations`,
    method: SERVICE_METHODS.POST,
  },
  delete_preferred_location: {
    url: `trainer-preferred-locations`,
    method: SERVICE_METHODS.DELETE,
  },
  add_switch_interface_token: {
    url: `switch-interface`,
    method: SERVICE_METHODS.POST,
  },

  ///------booking--------
  get_all_bookings: {
    url: `bookings`,
    method: SERVICE_METHODS.GET,
  },
  get_booking_by_id: {
    url: `booking`,
    method: SERVICE_METHODS.GET,
  },
  booking_cancellation_charge: {
    url: `booking-cancellation-charge`,
    method: SERVICE_METHODS.GET,
  },
  cancel_booking_reason: {
    url: `cancel-booking`,
    method: SERVICE_METHODS.POST,
  },
  // theme
  get_user_theme: {
    url: `theme`,
    method: SERVICE_METHODS.GET,
  },
  add_user_theme: {
    url: `theme`,
    method: SERVICE_METHODS.POST,
  },
  get_content_type_by_id: { url: `app-content`, method: SERVICE_METHODS.GET },

  // booking

  get_service_dates: {
    url: `service-dates`,
    method: SERVICE_METHODS.GET,
  },
  get_service_timeslots: {
    url: `service-timeslots`,
    method: SERVICE_METHODS.GET,
  },
  add_service_booking: {
    url: `booking`,
    method: SERVICE_METHODS.POST,
  },
  get_booking_summary: {
    url: `payment_summary`,
    method: SERVICE_METHODS.GET,
  },
  get_all_transaction: {
    url: `payment-transaction`,
    method: SERVICE_METHODS.GET,
  },

  // auth
  get_google_is_allow: {
    url: `sc/ss_google`,
    method: SERVICE_METHODS.GET,
  },
  get_facebook_is_allow: {
    url: `sc/ss_facebook`,
    method: SERVICE_METHODS.GET,
  },
  get_apple_is_allow: {
    url: `sc/ss_apple`,
    method: SERVICE_METHODS.GET,
  },
  add_review: {
    url: `service/feedback`,
    method: SERVICE_METHODS.POST,
  },
  get_feedback_tags: {
    url: "service/",
    method: SERVICE_METHODS.GET,
  },
  get_service_ratings: {
    url: "service-ratings/",
    method: SERVICE_METHODS.GET,
  },
  get_all_trainer_certificates_public: {
    url: `tc`,
    method: SERVICE_METHODS.GET,
  },
  // insights
  get_all_insights: {
    url: `blog`,
    method: SERVICE_METHODS.GET,
  },

  get_all_insights_category: {
    url: `blog-category`,
    method: SERVICE_METHODS.GET,
  },

  get_all_blog_post_public: { url: `feed`, method: SERVICE_METHODS.GET },

  get_all_my_subscriptions_packages: {
    url: `subscription`,
    method: SERVICE_METHODS.GET,
  },
  renew_access_token: {
    url: `refresh-authorization-token`,
    method: SERVICE_METHODS.POST,
  },
  add_trainer_sessions_course: {
    url: `session-course`,
    method: SERVICE_METHODS.POST,
  },

  get_trainer_feedbacks: {
    url: "trainer-feedback",
    method: SERVICE_METHODS.GET,
  },
  add_update_trainer_feedbacks: {
    url: "trainer-feedback",
    method: SERVICE_METHODS.POST,
  },
  get_all_sessions: {
    url: `sessions`,
    method: SERVICE_METHODS.GET,
  },
  profile_menu_items: {
    url: "pmi",
    method: SERVICE_METHODS.GET,
  },
  get_session_meeting: {
    url: "session-meeting",
    method: SERVICE_METHODS.GET,
  },
  add_notification_token: {
    url: "notification-token",
    method: SERVICE_METHODS.POST,
  },
  get_all_search_history: {
    url: `search-history`,
    method: SERVICE_METHODS.GET,
  },
  add_recent_search_history: {
    url: `search-history`,
    method: SERVICE_METHODS.POST,
  },
  get_all_search_result: {
    url: `search`,
    method: SERVICE_METHODS.GET,
  },
  get_all_blogs_category: {
    url: `blog-category`,
    method: SERVICE_METHODS.GET,
  },
  get_report_by_id: { url: `reports`, method: SERVICE_METHODS.GET },
  get_all_address: { url: `address`, method: SERVICE_METHODS.GET },
  add_user_address: { url: `address`, method: SERVICE_METHODS.POST },
  update_user_address: { url: `address`, method: SERVICE_METHODS.PUT },
  delete_user_address: { url: `address`, method: SERVICE_METHODS.DELETE },
  change_default_address: {
    url: `change-default-address`,
    method: SERVICE_METHODS.POST,
  },
  get_default_address: {
    url: `default-address`,
    method: SERVICE_METHODS.GET,
  },
  get_presigned_url: {
    url: `vppsobj`,
    method: SERVICE_METHODS.GET,
  },
  get_public_presigned_url: {
    url: `vppsobj`,
    method: SERVICE_METHODS.GET,
  },
  delete_presigned_url: {
    url: `remove-image`,
    method: SERVICE_METHODS.DELETE,
  },
  upload_image: {
    url: `upload-image`,
    method: SERVICE_METHODS.POST_CONFIG,
  },
  add_contact_detail: { url: `inquiry`, method: SERVICE_METHODS.POST },
  get_public_service: { url: `psvc`, method: SERVICE_METHODS.GET },
  get_public_service_rating: {
    url: `psvc-ratings`,
    method: SERVICE_METHODS.GET,
  },
  delete_user: {
    url: `delete-user`,
    method: SERVICE_METHODS.POST,
  },
  get_system_configurations: {
    url: `system-configurations`,
    method: SERVICE_METHODS.GET,
  },
  add_newsletter_detail: {
    url: `newsletter-subscription`,
    method: SERVICE_METHODS.POST,
  },
  get_trainer_bank_info_by_trainer_id: {
    url: `trainer-bank-info`,
    method: SERVICE_METHODS.GET,
  },
  save_trainer_bank_info: {
    url: `trainer-bank-info`,
    method: SERVICE_METHODS.POST,
  },
  update_trainer_bank_info: {
    url: `trainer-bank-info`,
    method: SERVICE_METHODS.PUT,
  },
  get_system_version: {
    url: `sc`,
    method: SERVICE_METHODS.GET,
  },
  get_trainer_approved_services: {
    url: `trainer-approved-service`,
    method: SERVICE_METHODS.GET,
  },
  get_meeting_details: {
    url: `meeting-details`,
    method: SERVICE_METHODS.GET,
  },
  add_meeting_details: {
    url: `meeting-details`,
    method: SERVICE_METHODS.POST,
  },
  get_geocode: {
    url: `geocode`,
    method: SERVICE_METHODS.POST,
  },
  get_location: {
    url: `geo-location`,
    method: SERVICE_METHODS.POST,
  },
  get_all_service_by_category: {
    url: `service-by-category`,
    method: SERVICE_METHODS.GET,
  },
  check_free_booking: {
    url: `check-free-booking`,
    method: SERVICE_METHODS.POST,
  },
  related_service: {
    url: `related-service`,
    method: SERVICE_METHODS.GET,
  },
};
