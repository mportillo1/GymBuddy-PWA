import { auth, db } from "./firebaseConfig.js";

  import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile
  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import { doc,setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


  document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");
  const signUpForm = document.getElementById("sign-up-form");
  const showSignUp = document.getElementById("show-signup");
  const showSignIn = document.getElementById("show-signin");
  const SignUpBtn = document.getElementById("sign-up-btn");
  const SignInBtn = document.getElementById("sign-in-btn");

  showSignUp.addEventListener("click", () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
  });

  showSignIn.addEventListener("click", () => {
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });


  SignUpBtn.addEventListener("click", async () => {
      const name = "Anon"
      const email = document.getElementById("sign-up-email").value;
      const password = document.getElementById("sign-up-password").value;
      try{
        const authCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(authCredential.user, {
          displayName: name,
        });
        const docRef = doc(db, "users", authCredential.user.uid);
        const userProperties = await setDoc(docRef, {
          email: email,
          name: name,
        });
        console.log(userProperties);
        M.toast({html: "Sign up successful!"});
        window.location.href = "/";
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
      }
      catch(e){
        M.toast({html: e.message});
      }
    });

    SignInBtn.addEventListener("click", async () => {
      const email = document.getElementById("sign-in-email").value;
      const password = document.getElementById("sign-in-password").value;
      try{
        await signInWithEmailAndPassword(auth, email, password);
        M.toast({html: "Sign in successful!"});
        window.location.href = "/";
      }
      catch(e){
        M.toast({html: e.message});
      }
    });
  });

  