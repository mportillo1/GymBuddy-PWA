import {openDB} from "https:unpkg.com/idb?module";
import {
  addWorkoutLogToFirebase,
  getWorkoutLogFromFirebase,
  deleteWorkoutLogFromFirebase,
  updateWorkoutLogInFirebase,
} from "./firebaseDB.js";
import {
  collection,
  addDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { messaging, getToken, onMessage, db } from "./firebaseConfig.js";
import { currentUser } from "./auth.js";

// ---Constants---
let serviceWorkerRegistration = null;

document.addEventListener('DOMContentLoaded', function() {
    checkStorageUsage();
});

//Created indexDB database
async function createDB(){
const db = await openDB("GymBuddy", 1, {
  upgrade(db){
    const store = db.createObjectStore("workoutLogs", {
      keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("status", "status");
  },
});
return db;
}

//Checks to see if there is an internet connection
async function isReallyOnline() {
  try {
      const response = await fetch("./ping.json", { cache: "no-store" }); // Adjust path if ping.json is in a subfolder
      if (response.ok) {
          const data = await response.json();
          return data.status === "ok";
      }
      return false;
  } catch (error) {
      console.error("Error checking online status:", error);
      return false;
  }
}

//Add workout Log
async function addWorkoutLog(workoutLog){
  const db = await createDB();
  let workoutLogId;
  const onlineStatus = await isReallyOnline();
  if (onlineStatus) {
    // Online - Add workout to Firebase and get the Firebase ID
    console.log("Online")
    const savedWorkoutLog = await addWorkoutLogToFirebase(workoutLog);
    workoutLogId = savedWorkoutLog.id;

    // Add workout with Firebase ID to IndexedDB for consistency
    const tx = db.transaction("workoutLogs", "readwrite");
    const store = tx.objectStore("workoutLogs");
    await store.put({ ...workoutLog, id: workoutLogId, synced: true });
    await tx.done;
  } else {
    // Offline - Ensure a unique temporary ID is generated if none exists
    workoutLogId = `temp-${Date.now()}`;

    // Check if workoutLogId is valid before adding to IndexedDB
    const workoutLogToStore = { ...workoutLog, id: workoutLogId, synced: false };
    if (!workoutLogToStore.id) {
      console.error("Failed to generate a valid ID for the workout.");
      return; // Exit if the ID is invalid
    }

    //start transnaction
    const tx = db.transaction("workoutLogs", "readwrite");
    const store = tx.objectStore("workoutLogs");
    //Add workout log to store
    await store.put(workoutLogToStore);
    //complete transaction
    await tx.done;
  }
  checkStorageUsage();

  // Return workout with ID
  return { ...workoutLog, id: workoutLogId };
}

//Edit workout
async function editWorkoutLog(id, updatedData){
  if(!id){
    console.error("InvalidID passed to Edit WorkoutLog");
    return;
  }
  const db = await createDB();
  const onlineStatus = await isReallyOnline();
  if (onlineStatus) {
    try{
      // Online - Edit workout to Firebase
      await updateWorkoutLogInFirebase(id, updatedData);

      // Add workout with Firebase ID to IndexedDB for consistency
      const tx = db.transaction("workoutLogs", "readwrite");
      const store = tx.objectStore("workoutLogs");
      await store.put({ ...updatedData, id: id, synced: true });
      await tx.done;
      loadWorkoutLog();
    } catch(e){
      console.error("Error updating workout in Firebase", e);
    }    
  } else {
    // Offline - make an indexedDB transaction
    const tx = db.transaction("workoutLogs", "readwrite");
    const store = tx.objectStore("workoutLogs");
    await store.put({ ...updatedData, id: id, synced: false });
    await tx.done;
    loadWorkoutLog();
  }
}

//Sync workout from indeDB to firebaseDB
export async function syncWorkoutLogs() {
  const db = await createDB();
  const onlineStatus = await isReallyOnline();

  if (!onlineStatus) return;

  try {
    // Start a transaction for reading workout logs from IndexedDB
    const tx = db.transaction("workoutLogs", "readonly");
    const store = tx.objectStore("workoutLogs");
    const workoutLogs = await store.getAll();
    await tx.done;

    // Sync new and edited logs
    for (const workoutLog of workoutLogs) {
      if (!workoutLog.synced) {
        try {
          if (workoutLog.id.startsWith("temp-")) {
            // Add new log to Firebase
            const savedWorkoutLog = await addWorkoutLogToFirebase({
              workoutName: workoutLog.workoutName,
              workoutDescription: workoutLog.workoutDescription,
              workoutDate: workoutLog.workoutDate,
              repetitions: workoutLog.repetitions,
              weight: workoutLog.weight,
              difficulty: workoutLog.difficulty,
            });

            // Update IndexedDB with Firebase ID
            const txUpdate = db.transaction("workoutLogs", "readwrite");
            const storeUpdate = txUpdate.objectStore("workoutLogs");
            await storeUpdate.delete(workoutLog.id);
            await storeUpdate.put({
              ...workoutLog,
              id: savedWorkoutLog.id,
              synced: true,
            });
            await txUpdate.done;
          } else {
            // Update existing log in Firebase
            await updateWorkoutLogInFirebase(workoutLog.id, workoutLog);

            // Mark as synced in IndexedDB
            const txUpdate = db.transaction("workoutLogs", "readwrite");
            const storeUpdate = txUpdate.objectStore("workoutLogs");
            await storeUpdate.put({ ...workoutLog, synced: true });
            await txUpdate.done;
          }
        } catch (error) {
          console.error("Error syncing workout log:", error);
        }
      }
    }

    // Fetch updated Firebase logs
    const firebaseLogs = await getWorkoutLogFromFirebase();
    const txFetch = db.transaction("workoutLogs", "readonly");
    const storeFetch = txFetch.objectStore("workoutLogs");
    const indexedDBKeys = await storeFetch.getAllKeys(); // Fetch all IndexedDB keys
    await txFetch.done;

    // Compare and delete logs in Firebase that are not in IndexedDB
    for (const firebaseLog of firebaseLogs) {
      if (!indexedDBKeys.includes(firebaseLog.id)) {
        try {
          await deleteWorkoutLogFromFirebase(firebaseLog.id);
          console.log(`Deleted stale log from Firebase: ${firebaseLog.id}`);
        } catch (error) {
          console.error(`Error deleting stale log from Firebase: ${firebaseLog.id}`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error in syncWorkoutLogs:", error);
  }
}

//Delete workout log
async function deleteWorkoutLog(id){

  if (!id) {
    console.error("Invalid ID passed to deleteWorkoutLog.");
    return;
  }

  const db = await createDB();
  const onlineStatus = await isReallyOnline();
  //Delete from firebase if online
  // if (onlineStatus) {
  //   await deleteWorkoutLogFromFirebase(id);
  // }

  if (onlineStatus) {
    try {
      await deleteWorkoutLogFromFirebase(id);
    } catch (error) {
      console.error("Error deleting log from Firebase:", error);
    }
  }

   //start transaction
   const tx = db.transaction("workoutLogs", "readwrite");
   const store = tx.objectStore("workoutLogs");

   try {
    await store.delete(id);
    } catch (e) {
      console.error("Error deleting workout from IndexedDB:", e);
    }

   await tx.done;

   //Remove log from UI
   const workoutCard = document.querySelector(`[data-id="${id}"]`);
   if(workoutCard){
    workoutCard.remove();
   }

   checkStorageUsage();
}


//Load workout log with transaction
export async function loadWorkoutLog(){
  const db = await createDB();

  const workoutLogContainer = document.querySelector(".workoutLogs");
  workoutLogContainer.innerHTML = ""; // Clear current workout
  const onlineStatus = await isReallyOnline();
    // Load workouts from Firebase if online
    if (onlineStatus) {
      const firebaseWorkoutLogs = await getWorkoutLogFromFirebase();
      const tx = db.transaction("workoutLogs", "readwrite");
      const store = tx.objectStore("workoutLogs");
  
      for (const workoutLog of firebaseWorkoutLogs) {
        // Save workouts to IndexedDB with 'synced' flag
        await store.put({ ...workoutLog, synced: true });
        displayWorkoutLog(workoutLog); // Display each workout in the UI
      }
      await tx.done;
    } else {
      // Load workouts from IndexedDB if offline
        const tx = db.transaction("workoutLogs", "readonly");
        const store = tx.objectStore("workoutLogs");
        const workoutLogs = await store.getAll();
  
        workoutLogs.forEach((workoutLog) => {
          displayWorkoutLog(workoutLog);
        });
        await tx.done;
    }
}

//Display workout log using existing HTML structure
function displayWorkoutLog(workoutLog){
  const workoutLogContainer = document.querySelector(".workoutLogs");
  const oneSetHtml = `
  
        <div class="col s12 m4" data-id="${workoutLog.id}">
            <div class="card">
            <div class="col s12" >
                <span class="card-title workout-name">${workoutLog.workoutName}</span>
                <div class="workout-description">${workoutLog.workoutDescription}</div> 
                <p class="workout-date">${workoutLog.workoutDate}</p>
            </div>
            <div class="card-content">
                <div class="workout-sets">                        
                <table class="table-responsive2 center-align">
                    <thead>
                    <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Difficulty</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="first-set">1</td>
                        <td class="firstRepAmount">${workoutLog.repetitions}</td>
                        <td class="firstWeightAmount">${workoutLog.weight}</td>
                        <td class="firstDifficulty">${workoutLog.difficulty}</td>
                    </tr>
                    </tbody>
                </table>
                </div>                      
            </div>
            <div class="card-action">
                <button class="workout-delete btn-flat" aria-label="Delete workout">
                    <i class="material-icons red-text large">delete</i>
                </button>
                <button class="workout-edit btn-flat" aria-label="Edit workout">
                    <i class="material-icons light-blue-text text-darken-4 large">edit</i>
                </button>
            </div>
            </div>
            </div>
            `
  
  workoutLogContainer.insertAdjacentHTML("beforeend", oneSetHtml);

    // Attach delete event listener
    const deleteButton = workoutLogContainer.querySelector(
      `[data-id="${workoutLog.id}"] .workout-delete`
    );
    deleteButton.addEventListener("click", () => deleteWorkoutLog(workoutLog.id));

    //Attach edit event listener
    const editButton = workoutLogContainer.querySelector(
      `[data-id="${workoutLog.id}"] .workout-edit`
    );
    editButton.addEventListener("click", () => openEditForm(workoutLog.id, workoutLog.workoutName, workoutLog.workoutDescription, workoutLog.workoutDate, workoutLog.repetitions, workoutLog.weight, workoutLog.difficulty));
}

// Add workout Button Listener
const addWorkoutButton = document.querySelector("#form-action-btn");
addWorkoutButton.addEventListener("click", async () => {
  const workoutInput = document.querySelector("#workoutName");
  const descriptionInput = document.querySelector("#workoutDescription");
  const dateInput = document.querySelector("#workoutDate");
  const repInput = document.querySelector("#repetitions");
  const weightInput = document.querySelector("#weight");
  const difficultyInput = document.querySelector("#difficulty");
  const workoutLogIdInput = document.querySelector("#workoutLog-id");
  
  const workoutLogId = workoutLogIdInput.value; // If editing, this will have a value
  const workoutLogData = {
      workoutName: workoutInput.value,
      workoutDescription: descriptionInput.value,
      workoutDate: dateInput.value,
      repetitions: repInput.value,
      weight: weightInput.value,
      difficulty: difficultyInput.value
  };
  
  if(!workoutLogId){
    const savedWorkoutLog = await addWorkoutLog(workoutLogData); // Add workout to IndexedDB
    displayWorkoutLog(savedWorkoutLog); // Add workout to the UI
  } else{
    await editWorkoutLog(workoutLogId, workoutLogData);
    // loadWorkoutLog();
  }  

  // Clear input fields after adding
  closeForm();
});


// Open Edit Form with Existing workout Data
function openEditForm(id, workoutName, workoutDescription, workoutDate, repetitions, weight, difficulty) {
  const workoutNameInput = document.querySelector("#workoutName");
  const workoutDescriptionInput = document.querySelector("#workoutDescription");  
  const workoutDateInput = document.querySelector("#workoutDate");
  const repetitionsInput = document.querySelector("#repetitions");
  const weightInput = document.querySelector("#weight");
  const difficultyInput = document.querySelector("#difficulty");
  const workoutLogIdInput = document.querySelector("#workoutLog-id");
  const formActionButton = document.querySelector("#form-action-btn");

  // Fill in the form with existing workout data
  workoutNameInput.value = workoutName;
  workoutDescriptionInput.value = workoutDescription;
  workoutDateInput.value = workoutDate;
  repetitionsInput.value = repetitions;
  weightInput.value = weight;
  difficultyInput.value = difficulty;
  workoutLogIdInput.value = id; // Set workoutLogIdInput for the edit operation
  formActionButton.textContent = "Edit"; // Change the button text to "Edit"

  M.updateTextFields(); // Materialize CSS form update

  // formActionButton.onclick = async () => {
  //   const updatedWorkoutLog = {
  //     workoutName: workoutNameInput.value,
  //     workoutDescription: workoutDescriptionInput.value,
  //     workoutDate: workoutDateInput.value,
  //     repetitions: repetitionsInput.value,
  //     weight: weightInput.value,
  //     difficulty: difficultyInput.value
  //   };

  //   await editWorkoutLog(id, updatedWorkoutLog);
  //   // loadWorkoutLog();
  //   closeForm();
  // };

  // Open the modal form
  var elem = document.querySelector("#track");
  var instance = M.Modal.getInstance(elem);
  instance.open();
}

function closeForm(){
  const workoutNameInput = document.querySelector("#workoutName");
  const workoutDescriptionInput = document.querySelector("#workoutDescription");  
  const workoutDateInput = document.querySelector("#workoutDate");
  const repetitionsInput = document.querySelector("#repetitions");
  const weightInput = document.querySelector("#weight");
  const difficultyInput = document.querySelector("#difficulty");
  const workoutLogIdInput = document.querySelector("#workoutLog-id");
  const formActionButton = document.querySelector("#form-action-btn");
  
  workoutNameInput.value = "";
  workoutDescriptionInput.value = "";
  workoutDateInput.value = "";
  repetitionsInput.value = "";
  weightInput.value = "";
  difficultyInput.value = "";
  workoutLogIdInput.value = "";

  formActionButton.textContent = "Add";
  var elem = document.querySelector("#track");
  var instance = M.Modal.getInstance(elem);
  instance.close();
}

async function checkStorageUsage(){
  if(navigator.storage && navigator.storage.estimate){
      const {usage, quota} = await navigator.storage.estimate();

      const usageInMB = (usage / (1024 * 1024)).toFixed(2);
      const quotaInMB = (quota / (1024 * 1024)).toFixed(2);

      console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);

      //Update the UI
      const storageInfo = document.querySelector("#storage-info");
      if(storageInfo){
          storageInfo.textContent = `Storage used: ${usageInMB} MB of ${quotaInMB} MB`;
      }

      if(usage/quota > 0.8){
          const storageWarning = document.querySelector("#storage-warning");
          if(storageWarning){
              storageWarning.textContent = "Warning: You are running low on data";
              storageWarning.computedStyleMap.display = "block";
          } 
          else{
              const storageWarning = document.querySelector("#storage-warning");
              if(storageWarning){
                  storageWarning.textContent = "";
                  storageWarning.computedStyleMap.display = "none";
              }
          }
      }
  }
}

async function initNotificationPermission(){
  try{
    const permission = await Notification.requestPermission();
    if (permission === "granted"){
      if(!serviceWorkerRegistration){
        serviceWorkerRegistration = await navigator.serviceWorker.ready;
      }
      const token = await getToken(messaging, {
        vapidKey: "BDsf28H4id-7wqodCie5wshUs3daR2pMGgWYtLfOvHCH_G1Fb1cg8uTA5JD0sUCEH3HHltBf7bMIHB6pNQlV80U",
        serviceWorkerRegistration: serviceWorkerRegistration
      });
      console.log("FCM Token: ", token);
      if(token && currentUser){
        const userRef = doc(db, "users", currentUser.uid);
        const tokeRef = collection(userRef, "fcmTokens");
        await addDoc(tokeRef, {token: token});
        console.log("Token saved to FireStore");
      } else{
        console.log("No valid user or token found!");
      }
    } else{
      console.log("Notification permission denied");
    }
  }catch(e){
    console.error("Error requesting notification permission: ", e);
  }
}


onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/img/icons/GymBuddyIcon128.png"
  };
  new Notification(notificationTitle, notificationOptions);
});

// Event listener to detect online status and sync
window.addEventListener("online", async () => {
  await syncWorkoutLogs(); // Ensure sync is completed first
  await loadWorkoutLog();     // Then load the workout logs
});
window.initNotificationPermission = initNotificationPermission;