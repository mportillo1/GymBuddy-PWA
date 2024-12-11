importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyCGTSjtfdXv5NIgNUIwsY3YNxLvh677Dh0",
  authDomain: "gymbuddy-ff2f1.firebaseapp.com",
  projectId: "gymbuddy-ff2f1",
  storageBucket: "gymbuddy-ff2f1.firebasestorage.app",
  messagingSenderId: "434342779104",
  appId: "1:434342779104:web:c9325c6e05ec5800fc5885",
  measurementId: "G-NL86WH6J3L"
});

const messaging = firebase.messaging();

//Handle background messages
messaging.onBackgroundMessage(function (payload){
  console.log("[serviceworker.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/img/icons/GymBuddyIcon128.png"
  };

  self.ServiceWorkerRegistration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = "workout-buddy-v1";

const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/excercises.html",
    "/log.html",
    "/auth.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/materialize.min.js",
    "/js/ui.js",
    "/js/init.js",
    "/img",

];

//Install
self.addEventListener("install", (event) => {
    console.log("Service worker: Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service worker: Caching files");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

//Activate
self.addEventListener('activate', (event) =>{
    console.log("Service Worker: Activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if(cache !== CACHE_NAME){
                        console.log("Service Worker: Deleting old Cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
      const url = new URL(event.request.url);

      // Check if the request is for ping.json
      if (url.pathname === "/ping.json") {
          // Directly fetch without caching for ping.json
          event.respondWith(fetch(event.request));
          return; // Exit early to avoid further processing
      }

      // Handle other GET requests
      event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
              return (
                  cachedResponse ||
                  fetch(event.request)
                      .then((networkResponse) => {
                          return caches.open(CACHE_NAME).then((cache) => {
                              cache.put(event.request, networkResponse.clone());
                              return networkResponse;
                          });
                      })
                      .catch((error) => {
                          console.error("Network fetch failed:", error);
                      })
              );
          })
      );
  }
});



  //Listen for messages from ui.js
  self.addEventListener("message", (event) => {
    if(event.data && event.data.type === "FCM_TOKEN"){
      const fcmToken = event.data.token;
      console.log("Received FCM token in service worker: ", fcmToken);
    }
  });

  //Display notification for the background message
  self.addEventListener("push", (event) => {
    if(event.data){
      const payload = event.data.json();
      const { title, body, icon} = payload.notification;
      const options = {
        body,
        icon: icon || "/img/icons/GymBuddyIcon128.png",
      };
      event.waitUntil(self.registration.showNotification(title, options));
    }
  });