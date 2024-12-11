# GymBuddy PWA

## Overview
GymBuddy is a Progressive Web App designed to help users track and manage their workouts. It allows fitness enthusiasts to log exercises and access workout data both online and offline. The app integrates Firebase for secure sign-ins and data synchronization across devices, and uses IndexedDB and service workers to maintain functionality even when offline. The goal was to create a responsive, user-friendly tool that supports fitness tracking from any device, including features like daily reminders to help users stay on track with their fitness goals.

## Features
- Log different types of workouts.
- Track workout metrics such as sets, reps, weight lifted, and difficulty.
- Browse an exercise database with exercises categorized by type.

## PWA Features
- **Service Worker**: 
  - Caches essential resources (HTML, CSS, JavaScript, icons) for offline functionality.
  - Uses a cache-first strategy to serve cached files, ensuring the app can load even when offline.
- **Web App Manifest**:
  - `name`, `short_name`, and `description` properties provide app information for easy identification.
  - `start_url` and `scope` define the main entry and accessible path for the app.
  - `icons` in multiple sizes to ensure responsiveness across devices.
  - `background_color` and `theme_color` are set to match the app’s design.
  - `screenshots` offer previews of key app screens for a seamless install experience.
  - `shortcuts` provide quick links to essential features such as "Track Workout" and "Exercise Database."
- **Firebase Database**:
  - Supports online data storage with Firestore or Realtime Database.
  - Ensures data consistency across sessions and devices.
- **Firebase Messages**:
  - Send daily reminder notifications to encourage consistent use of the app.
- **Firebase Authentication**:
  - Provide secure sign-in and sign-out for user accounts.
- **IndexedDB Integration**:
  - Provides offline storage for workout logs.
  - Syncs with Firebase when an internet connection is restored.

## How to View the Prototype
1. **Clone the Repository**:
   - Run the following command in your terminal to clone the project:
   ```bash
   git clone https://github.com/mportillo1/WorkoutTracker.git
   
   
## How to Use the App
 **Using the Workout Tracker**:
    - **Sign In/Sign Out**:
     - To sign in, you must first navigate to the Workout Log section of the app.
     - From there, use the sign-in or sign-up option to access your account and manage your workout logs.
   - **Tracking a Workout**:
     - Click on the **Track a Workout** button.
     - Fill in the required fields:
       - Select a date.
       - Enter the workout name, description, repetitions, weight, and difficulty level.
     - Click on the **Add Exercise** button to save the workout log.
   - **Editing a Workout Log**:
     - Locate the workout you wish to edit and click on the **Edit** button.
     - Update the workout information as needed.
     - Click on the **Edit** button again to save your changes.
   - **Deleting a Workout Log**:
     - Find the workout you want to remove and click on the **Delete** button.
   - **Testing Offline Functionality**:
     - In Google Chrome, right-click anywhere on the page and select **Inspect**.
     - Navigate to the **Application** tab in the developer tools.
     - In the **Service Workers** section, set the network to **Offline**.
     - Perform actions such as adding, editing, or deleting a workout while offline.
     - Switch back to **Online** mode and to sync the changes with Firebase.
  - **Enable Daily Notifications**:
     - To receive daily reminder notifications, press the "Enable Notifications" button in the workout tracker section.
     - Click "Allow" on the popup to grant permission for notifications.

## Technical Details
- **Firebase Integration**:
  - Firebase Firestore is used for online storage of workout logs.
  - Data in Firebase uses unique identifiers to prevent conflicts during synchronization.
- **IndexedDB Integration**:
  - IndexedDB is used to store workout logs offline.
  - Data in IndexedDB syncs with Firebase when the app goes online.
- **Data Synchronization**:
  - The app detects online/offline status and toggles storage between Firebase and IndexedDB.
  - Upon reconnecting, offline data stored in IndexedDB is uploaded to Firebase to maintain consistency.

