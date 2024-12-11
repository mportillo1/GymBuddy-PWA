import { auth } from "./firebaseConfig.js";

// Import the functions you need from the SDKs you need
import { 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// Your web app's Firebase configuration
import { loadWorkoutLog, syncWorkoutLogs } from "./ui.js";
export let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtns = document.querySelectorAll(".logout-btn");
    onAuthStateChanged(auth, (user) => {
        if(user){
          //User is signed in
          currentUser = user;
          console.log("UserId: ", user.uid);
          console.log("Email: ", user.email);
          // logoutBtn.style.display = "block";

          logoutBtns.forEach((logoutBtn) => {
              logoutBtn.style.display = "block";
          });
          loadWorkoutLog();
          syncWorkoutLogs();
        } else{
            console.log("No user is currently signed in");
            window.location.href = "./auth.html"
        }
    });

    logoutBtns.forEach((logoutBtn) => {
      logoutBtn.addEventListener("click", async () => {
        try{
          await signOut(auth);
          M.toast({html: "Logout successful!"});
          logoutBtn.style.display = "none";
          window.location.href = "./index.html";
        }
        catch(e){
          M.toast({html: e.message});
        }
     });
    });
    
})

