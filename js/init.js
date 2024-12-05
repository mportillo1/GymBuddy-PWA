document.addEventListener('DOMContentLoaded', function() {
    //Sidenav Init
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, {edge: "right"});

    //Modal
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    //Datepicker
    var datepicker = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepicker);
});

//Carousel
$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true,
  duration: 200
});

//Register service worker
if("serviceWorker" in navigator){
  navigator.serviceWorker
  .register("\serviceworker.js")
  .then(req => console.log("Service Worker Registered", req))
  .catch(err => console.log("Service Worker registration failed.", err));
}
