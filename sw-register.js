if ('serviceWorker' in navigator) {
  window.addEventListener('load',  () => {

    const appName = document.getElementById('sw-register').getAttribute('data-app-name'),
          // appName = document.getElementById('sw-register').dataset.appName,
          appNames = ['_pwa_training_']; // data-app-name="_pwa_training_"

    if (appNames.includes(appName)) {     // Only execute for pre-approved app names.
      let scopeName = getScopeName(appName);

      // appName:   _ | _pwa_ | _pwa_training_
      // scopeName: / | /pwa/ | /pwa/training/

      navigator.serviceWorker.register(scopeName + 'sw.js' + '?appName=' + encodeURIComponent(getAppName(appName)), {
        scope: scopeName
      })
        .then(registration => {           // 'appName' is (later) extracted from within [sw.js]
                                          // --> curPath = location.search.split('=')[1].replace(/_/g, '/')
          // console.log('Service Worker Registration successful: Scope is:', registration.scope);
        })
        .catch(function(error) {
          console.log('Service worker registration failed: Error:', error);
        });
    }
  });

  function getScopeName(_appName) {
    if (location.hostname === 'kdcinfo.com') {
      return _appName.replace(/_/g, '/').replace(/pwa/, 'app');
    }
    return _appName.replace(/_/g, '/');
  }

  function getAppName(_appName) {
    if (location.hostname === 'kdcinfo.com') {
      return _appName.replace(/pwa/, 'app');
    }
    return _appName;
  }
}
