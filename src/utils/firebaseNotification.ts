import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ADD_USER_NOTIFICATION_TOKEN } from "../services/user/UserServices";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG, FIREBASE_VAP_ID_KEY } from "../config/AppConfig";

// Initialize Firebase app
const app = initializeApp(FIREBASE_CONFIG);
export const fireBaseAuth = getAuth(app);

// Get messaging instance
export const messaging = getMessaging(app);

// Function to request notification permission
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: FIREBASE_VAP_ID_KEY,
      });

      ADD_USER_NOTIFICATION_TOKEN({ fcm_token: token });

      return token;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// Function to handle push notifications
const handlePushNotification = (onMessageReceived: any) => {
  onMessage(messaging, (payload) => {
    if (typeof onMessageReceived === "function") {
      onMessageReceived(payload);
    }
  });
};

export { requestNotificationPermission, handlePushNotification };
