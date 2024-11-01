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

## How to View the Prototype
1. **Clone the Repository**:
   - Run the following command in your terminal to clone the project:
   ```bash
   git clone https://github.com/mportillo1/WorkoutTracker.git
   