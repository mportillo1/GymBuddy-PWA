import { currentUser } from "./auth.js";
import { db } from "./firebaseConfig.js";
  // Import the functions you need from the SDKs you need
  import {
    collection,
    addDoc,
    setDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

  //Add a workout
  export async function addWorkoutLogToFirebase(workoutLog){
    try{
      console.log(currentUser);
      if(!currentUser){
        throw new Error("user is not authenticated");
      }
      const userId = currentUser.uid;
      console.log("userID: ", userId);
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {email: currentUser.email}, {merge: true});
      const workoutLogRef = collection(userRef, "workoutLog");
      const docRef = await addDoc(workoutLogRef, workoutLog)
      // const docRef = await await addDoc(collection(db, "workoutLog"), workoutLog);
      return { id: docRef.id, ...workoutLog};
    } catch(e){
        console.error("Error adding workout log: ", e);
    }
  }

  //Get workout
  export async function getWorkoutLogFromFirebase() {
    const workoutLogs = [];
    try {
      if(!currentUser){
        throw new Error("user is not authenticated");
      }
      const userId = currentUser.uid;
      const workoutLogRef = collection(doc(db, "users", userId), "workoutLog");
      const querySnapshot = await getDocs(workoutLogRef);
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
    if(!currentUser){
      throw new Error("user is not authenticated");
    }
    const userId = currentUser.uid;
    await deleteDoc(doc(db, "users", userId, "workoutLog", id));
  } catch (e) {
    console.error("Error deleting workout log: ", e);
  }
}

  //update workout
  export async function updateWorkoutLogInFirebase(id, updatedData) {
    console.log(updatedData, id);
    try {
      if(!currentUser){
        throw new Error("user is not authenticated");
      }
      const userId = currentUser.uid;
      const workoutRef = doc(db, "users", userId, "workoutLog", id);
      await updateDoc(workoutRef, updatedData);
    } catch (e) {
      console.error("Error updating workout log: ", e);
    }
  }