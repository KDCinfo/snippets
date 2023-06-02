const curPath = location.search.split('=')[1].replace(/_/g, '/'),
      curApp = 'training-progress-spa';

const staticCacheName = curApp + '-v35',
      staticAssetsVer = '20211015e';
      // staticAssetsVer = '20200329a';
// const staticCacheName = curApp + '-v9',
// const staticCacheName = curApp + '-v8',
//       staticAssetsVer = '20180820d';

self.addEventListener('install', function(event) {

  const urls = [
          curPath,
          curPath + 'training.css?v=' + staticAssetsVer,    // CSS and...
          curPath + 'training.js?v=' + staticAssetsVer,     // JS are cached with their own version parameter.
          // , curPath + 'training-list.js' // IndexedDB --> Network Fetch: cache: 'reload'
                                            // (Network; then update cache (maybe use `no-store` instead).)
          '/favicon.ico',
          'https://fonts.googleapis.com/css?family=Nanum+Gothic|Palanquin+Dark|Permanent+Marker',
          'https://fonts.gstatic.com/s/nanumgothic/v8/PN_3Rfi-oW3hYwmKDpxS7F_z-7r_xFtIsPV5MbNOyrVj67GNc972x-dpix2LdhN-iTB6aWWhDX3G.119.woff2',
          'https://fonts.gstatic.com/s/nanumgothic/v8/PN_3Rfi-oW3hYwmKDpxS7F_z-7r_xFtIsPV5MbNOyrVj67GNc972x-dpix2LdhN-iTB6aWWhDX3G.118.woff2',
          'https://fonts.gstatic.com/s/nanumgothic/v8/PN_3Rfi-oW3hYwmKDpxS7F_z-7r_xFtIsPV5MbNOyrVj67GNc972x-dpix2LdhN-iTB6aWWhDX3G.117.woff2',
          'https://fonts.gstatic.com/s/nanumgothic/v8/PN_3Rfi-oW3hYwmKDpxS7F_z-7r_xFtIsPV5MbNOyrVj67GNc972x-dpix2LdhN-iTB6aWWhDX3G.116.woff2',
          'https://fonts.gstatic.com/s/palanquindark/v3/xn75YHgl1nqmANMB-26xC7yuF86JRks.woff2',
          'https://fonts.gstatic.com/s/permanentmarker/v7/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.woff2'
          // , 'https://api.github.com/repos/KDCinfo/snippets/git/refs/heads/master'
          // , 'https://api.github.com/repos/KDCinfo/snippets/git/commits/9cab1823273d47f5f2d65b4b409657ad33dc05ac'
        ];

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      urls.forEach(function (url) {
        cache.add(url)
          // .then( () => console.log('result: ', url) )
          .catch( (e) => console.log('error: ', url, e) );
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(curApp) && cacheName !== staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
})

self.addEventListener('fetch', function(event) {

  const strUrl = event.request.url,
      requestUrl = new URL(event.request.url);

  // Fetch Then Update Cache
  const fetchThenCache = (eventRequest) => caches.open(staticCacheName).then(function(cache) {
          return fetch(eventRequest)
            .then(function(response) {

              if (response.url.match("^(http|https)://")) {
                // cache.put(request, copy);
                cache.put(eventRequest, response.clone());
                return response;
              } else {
                return response;
              }

            }).catch((e) => {
              console.log('CATCH [fetchThenCache]: ', eventRequest);
              return new Response("", {
                headers: {'Content-Type': 'text/plain'}
              });
            });
        });

  // [requestUrl.origin]    http://127.0.0.1:8887 | https://fonts.gstatic.com
  // [location.origin]      http://127.0.0.1:8887
  // [curPath]              /pwa/training/
  // [requestUrl.pathname]  /pwa/training/ | /pwa/training/training.css | /s/nanumgothic/v8/PN_3R

  if (requestUrl.origin === location.origin && requestUrl.pathname === curPath) {

    event.respondWith(caches.match(curPath));
    return;

  } else if (strUrl.indexOf('training.css') > 0 || strUrl.indexOf('training.js') > 0) {

    // Replace calls to training.js with training.js?v20180731a
    var versionedRequest = new Request(event.request.url.replace(/(\.css|\.js).*/, '$1?v=' + staticAssetsVer));

    // Cache falling back to the network
    event.respondWith(
      caches.match(versionedRequest).then(function(response) {
        return response || fetchThenCache(versionedRequest);
      })
    );

  } else if (strUrl.indexOf('training-list') > 0) {

    // IndexedDB is retrieving the data first; then fetch is used to update any stale data.
    // There is no need to rely on versioning the Service Worker to update any cached data.

    // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
       // reload -- The browser fetches the resource from the remote server without first
       // looking in the cache, but then will update the cache with the downloaded resource.

    event.respondWith(
      fetch(event.request, { cache: 'no-store' }) // reload
        .then(response => { return response; })
        .catch((e) => {
          // console.log('training-list: no-store: ', e); // TypeError: Failed to fetch
          console.log('CATCH [training-list]: ', event.request);
          return new Response("{}", {
            headers: {'Content-Type': 'application/javascript'}
          });
        }) // <-- No semicolon !!!
    );

  } else if (strUrl.indexOf('repos/') > 0) { // repos/KDCinfo/snippets/git/refs/heads/master

    event.respondWith(
      fetch(event.request, { cache: 'no-store' }) // reload
        .then(response => { return response; })
        .catch((e) => {
          // console.log('training-list: no-store: ', e); // TypeError: Failed to fetch
          console.log('CATCH [repos]: ', event.request);
          return new Response("{}", {
            headers: {'Content-Type': 'application/javascript'}
          });
        }) // <-- No semicolon !!!
    );

    // fetch --> update cache --> return response
    // if fetch fails --> return cache --> else return silent empty object

    // console.log('REPOS: ', event.request);

    // event.respondWith(
    //   caches.open(staticCacheName).then(function(cache) {
    //     return fetch(event.request, { cache: 'no-store' })
    //       .then(function(response) {
    //         cache.put(event.request, response.clone());
    //         return response;
    //       }).catch((e) => {
    //         caches.match(event.request).then(function(response) {
    //           console.log('CATCH [repos]: ', event.request);
    //           return response || new Response("{}", {
    //             headers: {'Content-Type': 'application/json'}
    //           });
    //         });
    //       });
    //   })
    // );

  } else if (strUrl.indexOf('sw-register') > 0 ||
             strUrl.indexOf('googletagmanager') > 0 ||
             strUrl.indexOf('google-analytics') > 0) {

    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
      .then(response => { return response; })
      .catch((e) => {
        console.log('CATCH [sw-reg]: ', event.request);
        return new Response("{}", {
          headers: {'Content-Type': 'application/javascript'}
        });
      }) // <-- No semicolon !!!
    );

  } else {

    // Cache falling back to the network
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetchThenCache(event.request);
      })
    );
  }
});

function getScopeName(_appName) {
  if (location.hostname === 'kdcinfo.com') {
    return _appName.replace(/_/g, '/').replace(/pwa/, 'app');
  }
  return _appName.replace(/_/g, '/');
}
