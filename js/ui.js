document.addEventListener('DOMContentLoaded', function() {
    //Sidenav Init
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, {edge: "right"});
    //Add task
    const forms = document.querySelector(".side-form");
    M.Sidenav.init(forms, {edge: "left"});
});


if("serviceWorker" in navigator){
    navigator.serviceWorker
    .register("/serviceworker.js")
    .then(req => console.log("Service Worker Registered", req))
    .catch(err => console.log("Service Worker registration failed.", err));
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
     M.Modal.init(elems, options);
  });

  $(document).ready(function(){
    $('.modal').modal();
  });