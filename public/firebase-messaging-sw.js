// // Retrieve an instance of Firebase Messaging so that it can handle background messages.
// import { FIREBASE_CONFIG } from "../src/config/AppConfig";
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js"
);

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDEdCpHDAiYRAFDdOPSmjGh3Z7viqaynL0",
  authDomain: "vp-dev-7a1f2.firebaseapp.com",
  projectId: "vp-dev-7a1f2",
  storageBucket: "vp-dev-7a1f2.appspot.com",
  messagingSenderId: "679877003249",
  appId: "1:679877003249:web:5f523744f5adf8bf83a650",
};

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

// Set up foreground message handler
// messaging.onMessage((payload) => {
//   console.log(222222);
//   console.log(payload);
//   // Customize notification handling here (optional)
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   // Display the notification
//   // new Notification(notificationTitle, notificationOptions);
// });

// Set up background message handler
// messaging.onBackgroundMessage((payload) => {
//   console.log(111111);
//   console.log(payload);
//   // Customize notification handling here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   Display the notification
//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });
