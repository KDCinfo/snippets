const curPath = location.search.split('=')[1].replace(/_/g, '/'),
      curApp = 'training-progress-spa';

const staticCacheName = curApp + '-v1',
      staticAssetsVer = '20180731a';

self.addEventListener('install', function(event) {

  const urls = [
          curPath
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
              cache.put(eventRequest, response.clone());
              return response;
            })
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
    );

  } else if (strUrl.indexOf('sw-register') > 0) {

    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
      .then(response => { return response; })
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
