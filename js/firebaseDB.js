  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
  import {  
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCGTSjtfdXv5NIgNUIwsY3YNxLvh677Dh0",
    authDomain: "gymbuddy-ff2f1.firebaseapp.com",
    projectId: "gymbuddy-ff2f1",
    storageBucket: "gymbuddy-ff2f1.firebasestorage.app",
    messagingSenderId: "434342779104",
    appId: "1:434342779104:web:c9325c6e05ec5800fc5885",
    measurementId: "G-NL86WH6J3L"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  //Add a workout
  export async function addWorkoutLogToFirebase(workoutLog){
    try{
        const docRef = await await addDoc(collection(db, "workoutLog"), workoutLog);
        return { id: docRef.id, ...workoutLog};
    } catch(e){
        console.error("Error adding workout log: ", e);
    }
  }

  const workoutLogTest = {
    workoutName: "Squat",
    workoutDescription: "Legs",
    workoutDate: "Nov 18, 2024",
    weight: "140lbs",
    repetitions: 30,
    difficulty: "Hard"
  }

//   addWorkoutLogToFirebase(workoutLogTest);

  //Get workout
  export async function getWorkoutLogFromFirebase() {
    const workoutLogs = [];
    try {
      const querySnapshot = await getDocs(collection(db, "workoutLog"));
      querySnapshot.forEach((doc) => {
        workoutLogs.push({ id: doc.id, ...doc.data() });
      });
    } catch (e) {
      console.error("Error retrieving workout log: ", e);
    }
    return workoutLogs;
  }

  //Delete workout
export async function deleteWorkoutLogFromFirebase(id) {
  try {
    await deleteDoc(doc(db, "workoutLog", id));
  } catch (e) {
    console.error("Error deleting workout log: ", e);
  }
}

  //update workout
  export async function updateWorkoutLogInFirebase(id, updatedData) {
    console.log(updatedData, id);
    try {
      const workoutRef = doc(db, "workoutLog", id);
      await updateDoc(workoutRef, updatedData);
    } catch (e) {
      console.error("Error updating workout log: ", e);
    }
  }