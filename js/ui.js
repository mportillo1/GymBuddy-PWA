import {openDB} from "https:unpkg.com/idb?module";


document.addEventListener('DOMContentLoaded', function() {
    //Sidenav Init
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, {edge: "right"});

    //Modal
    var elems = document.querySelectorAll('.modal');
     M.Modal.init(elems);

    loadWoroutLog();
    checkStorageUsage();
});

if("serviceWorker" in navigator){
  navigator.serviceWorker
  .register("\serviceworker.js")
  .then(req => console.log("Service Worker Registered", req))
  .catch(err => console.log("Service Worker registration failed.", err));
}

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

document.addEventListener('DOMContentLoaded', function() {
  var selects = document.querySelectorAll('select');
  var diffSelect = M.FormSelect.init(selects);
});


  $('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true,
    duration: 200
  });

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems);
  }); 



//Add workout Log
async function addWorkoutLog(workoutLog){
  const db = await createDB();

  //start transnaction
  const tx = db.transaction("workoutLogs", "readwrite");
  const store = tx.objectStore("workoutLogs");

  //Add workout log to store
  await store.add(workoutLog);

  //complete transaction
  await tx.done;

  checkStorageUsage();
}


//Delete workout log
async function deleteWorkoutLog(id){
  const db = await createDB();

   //start transaction
   const tx = db.transaction("workoutLogs", "readwrite");
   const store = tx.objectStore("workoutLogs");

   //Delete workout log by ID
   await store.delete(id);
   await tx.done;

   //Remove log from UI
   const workoutCard = document.querySelector(`[data-id="${id}"]`);
   if(workoutCard){
    workoutCard.remove();
   }

   checkStorageUsage();
}


//Load workout log with transaction
async function loadWoroutLog(){
  const db = await createDB();

   //start transaction
   const tx = db.transaction("workoutLogs", "readonly");
   const store = tx.objectStore("workoutLogs");

   //Get all workout logs
   const workoutLogs = await store.getAll();

   await tx.done;

   const workoutLogContainer = document.querySelector(".workoutLogs");
   workoutLogContainer.innerHTML = ""; // Clear current tasks

   workoutLogs.forEach((workoutLog) => {
    displayWorkoutLog(workoutLog);
   });
}

//Display workout log using existing HTML structure
function displayWorkoutLog(workoutLog){
  const workoutLogContainer = document.querySelector(".workoutLogs");
  const oneSetHtml = `
  <div class="row">
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
            </div>`
  
  workoutLogContainer.insertAdjacentHTML("beforeend", oneSetHtml);

    // Attach delete event listener
    const deleteButton = workoutLogContainer.querySelector(
      `[data-id="${workoutLog.id}"] .workout-delete`
    );
    deleteButton.addEventListener("click", () => deleteWorkoutLog(workoutLog.id));
}

// Add workout Button Listener
const addWorkoutButton = document.querySelector("#form-action-btn");
addWorkoutButton.addEventListener("click", async () => {
  const workoutInput = document.querySelector("#workoutName");
  const descriptionInput = document.querySelector("#workoutDescription");
  const dateInput = document.querySelector("#workoutDate");
  const repInput = document.querySelector("#repetitions");
  const weightInput = document.querySelector("#weight");
  // const difficultyInput = document.querySelector("#difficulty");

  const selectOption = document.querySelector("#diffSelect");
  const selInstance = M.FormSelect.getInstance(selectOption);
  selInstance.getSelectedValues();
  var selectedValues = selInstance.getSelectedValues();

  console.log(selInstance.getSelectedValues());

  if(selectedValues == ""){
    selectedValues = "Not working or Empty";
  }

  const workoutLog = {
    workoutName: workoutInput.value,
    workoutDescription: descriptionInput.value,
    workoutDate: dateInput.value,
    repetitions: repInput.value,
    weight: weightInput.value,
    difficulty: selectedValues,
  };
  
  await addWorkoutLog(workoutLog); // Add workout to IndexedDB
  
  displayWorkoutLog(workoutLog); // Add workout to the UI

  // Clear input fields after adding
  workoutInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  repInput.value = "";
  weightInput.value = "";
  // difficultyInput.value = "";

  // Close the side form after adding
  // const forms = document.querySelector("#track");
  // const instance = M.Sidenav.getInstance(forms);
  // instance.close();
});


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