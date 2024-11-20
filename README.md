# GymBuddy PWA

## Overview
GymBuddy is a progressive web application (PWA) designed to help users track their workouts and explore a built-in exercise database. The app enables users to log their exercises. Offline functionality is available.

## Features
- Log different types of workouts.
- Track workout metrics such as sets, reps, weight lifted, and duration.
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
  - **Firebase Integration**:
  - Supports online data storage with Firestore or Realtime Database.
  - Ensures data consistency across sessions and devices.
- **IndexedDB Integration**:
  - Provides offline storage for workout logs.
  - Syncs with Firebase when an internet connection is restored.

## How to View the Prototype
1. **Clone the Repository**:
   - Run the following command in your terminal to clone the project:
   ```bash
   git clone https://github.com/mportillo1/WorkoutTracker.git
   
   
## How to Test Firebase and IndexedDB
 **Using the Workout Tracker**:
   - **Tracking a Workout**:
     - Navigate to the Workout Tracker page.
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
     - Switch back to **Online** mode and refresh the page to sync the changes with Firebase.

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

