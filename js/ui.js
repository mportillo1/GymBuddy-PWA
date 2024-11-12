document.addEventListener('DOMContentLoaded', function() {
    //Sidenav Init
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, {edge: "right"});

    //Modal
    var elems = document.querySelectorAll('.modal');
     M.Modal.init(elems);
});

$('.dropdown-trigger').dropdown();



  $(document).ready(function(){
    $('.modal').modal();
  });

  
  $('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true,
    duration: 200
  });

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems);
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

//Add workout Log
async function addWorkoutLog(workoutLog){
  const db = await createDB();

  //start transnaction
  const tx = db.transaction("workoutLogs", "readwrite");
  const store = tx.objectStore("woroutLogs");

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
   const store = tx.objectStore("woroutLogs");

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
   const store = tx.objectStore("woroutLogs");

   //Get all workout logs
   const workoutLogs = await store.getAll();

   await tx.done;

   const workoutLogContainer = document.querySelector(".workoutLogs");
   workoutLogContainer.innerHTML = "";
   workoutLogs.forEach((workoutLog) => {
    displayWorkoutLog(workoutLog);
   });
}

//Display workout log using existing HTML structure
function displayWorkoutLog(workoutLog){
  const workoutLogContainer = document.querySelector(".workoutLogs");
}