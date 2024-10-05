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