const CACHE_NAME =
  "carpma-v4";


const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];


self.addEventListener(
  "install",
  event => {

    self.skipWaiting();

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            FILES_TO_CACHE
          );

        })

    );

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(keys => {

          return Promise.all(

            keys
              .filter(
                key =>
                  key !== CACHE_NAME
              )
              .map(
                key =>
                  caches.delete(key)
              )

          );

        })

    );

    self.clients.claim();

  }
);


self.addEventListener(
  "fetch",
  event => {

    const request =
      event.request;


    if (
      request.method !== "GET"
    ) {
      return;
    }


    if (
      request.mode === "navigate"
    ) {

      event.respondWith(

        fetch(request)
          .then(response => {

            const copy =
              response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  "./index.html",
                  copy
                );

              });

            return response;

          })
          .catch(() => {

            return caches.match(
              "./index.html"
            );

          })

      );

      return;

    }


    event.respondWith(

      caches
        .match(request)
        .then(cachedResponse => {

          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request);

        })

    );

  }
);
