const CACHE_NAME = "task-manager-v2";

const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/excercises.html",
    "/log.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/materialize.min.js",
    "/js/ui.js",
    "/js/jquery-3.7.1.min.js",
    "/img",

];

//Install
self.addEventListener("install", (event) => {
    console.log("Service worker: Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service worker: Caching files");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

//Activate
self.addEventListener('activate', (event) =>{
    console.log("Service Worker: Activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if(cache !== CACHE_NAME){
                        console.log("Service Worker: Deleting old Cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async function(){
            const cachedResponse = await caches.match(event.request);

            if(cachedResponse){
                return cachedResponse;
            }

            try{
                const networkResponse = await fetch(event.request);
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, networkResponse.clone()); //Update cache with the fetched response
                return networkResponse;
            } catch(error){
                console.error("Fetch failed, returning offline page: ", error);
                //Optionally return an offline page here if available in the cache
            }
        })()
    );
});




//Fetch
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: Fetching...", event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if(cachedResponse){
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
            })
        })
    );
});