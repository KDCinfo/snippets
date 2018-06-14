(function() {
  'use strict';

  /*****************************************************************************
   *
   * Try to load data (my classes) from IndexedDB; using localStorage as a fallback
   * A class list is then `fetch`ed and merged with any pre-loaded data.
   *
   ****************************************************************************/

   // Data Stores:
   //
   // allClassList: [] <-- First populate with 'browser data' (if any),
   //                      then overwrite with external `.js` file (most recent class data).
   //
   // Browser Data: Attempt to use `IndexedDB`, else then try `localStorage`
   //
   // @TODO: PWA (Service Workers; if available) will be primary data store (then IndexedDB; then localStorage).

  const app = {
          isLoading: true,
          allClassList: [],           // Continuously repopulated with progressive data retrieval (per above).
          visibleClasses: {},         // Active Classes: ID's with specific class data to be displayed.
          visibleClassSet: new Set(), // Class IDs (unique); Used to loop and match to `visibleClasses` object.
          spinner: document.querySelector('.loader'),
          container: document.querySelector('.main'),
          cardTemplate: document.querySelector('.card-template'),
          dataSource: (window.indexedDB) ? 'IDB' : 'LOCAL' // Determine which storage we'll use.
          // dataSource: (window.indexedDB) ? 'LOCAL' : 'LOCAL' // Determine which storage we'll use.
        };
        // visibleClassSet = new Set(); // Class IDs (unique); Used to loop and match to `visibleClasses` object.

  let appDB,
      appObjectStore;

  // CSS Flex: Smooth Wrapping - https://codepen.io/KeithDC/pen/XYMgQj
  //
  const boxes = [];

  let nodes = document.querySelectorAll(".item-node"), // .card-template, .item-node
      nodeCnt = 0,      // Node count: Loop through nodes[]
      totalNodes = nodes.length,
      resizeWaitID = 0, // setTimeout ID for window.resize()
      node = {},
      dupe = {};

  /*****************************************************************************
   *
   * Data Structures
   *
   ****************************************************************************/

  /**
   * [allClassList] An array of objects - Includes all vendor classes
   *
   * See [training-list.js].classList
   */

  /**
   * [visibleClasses] - Includes all sortable properties
   *
   * { 'udacity-1': {
   *     courseVendorName: '',  // Udacity
   *     courseVendor: '',      // Offline Web Applications
   *     courseDesc: '',        // (if any)
   *     courseDateStarted: '', // 2018 May
   *     courseDateLast: '',    // 2018 June
   *     courseProgress: 0,     // 0-100
   *     courseList: []
   *   }
   * }
   */

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  // app.updateForecastCard = function(data) {

  //   var card = app.visibleClasses[data.key];
  //   if (!card) {
  //     card = app.cardTemplate.cloneNode(true);
  //     card.classList.remove('card-template');
  //     card.querySelector('.location').textContent = data.label;
  //     card.removeAttribute('hidden');
  //     app.container.appendChild(card);
  //   }

  //   // Verifies the data provide is newer than what's already visible
  //   // on the card, if it's not bail, if it is, continue and update the
  //   // time saved in the card
  //   var cardLastUpdatedElem = card.querySelector('.card-last-updated');
  //   var cardLastUpdated = cardLastUpdatedElem.textContent;
  //   if (cardLastUpdated) {
  //     cardLastUpdated = new Date(cardLastUpdated);
  //     // Bail if the card has more recent data then the data
  //     if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
  //       return;
  //     }
  //   }
  //   cardLastUpdatedElem.textContent = data.created;

  //   if (app.isLoading) {
  //     app.spinner.setAttribute('hidden', true);
  //     app.container.removeAttribute('hidden');
  //     app.isLoading = false;
  //   }
  // };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * listCourse() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, listCourse() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  /*
    app.listCourseOld = function(key, label) {
        var statement = 'select * from weather.forecast where woeid=' + key;
        var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
            statement;

        // TODO add cache logic here
        if ('caches' in window) {
          /*
           * Check if the service worker has already cached this city's weather
           * data. If the service worker has the data, then display the cached
           * data while the app fetches the latest data.
           * /
          caches.match(url).then(function(response) {
            if (response) {
              response.json().then(function updateFromCache(json) {
                var results = json.query.results;
                results.key = key;
                results.label = label;
                results.created = json.query.created;
                app.updateForecastCard(results);
              });
            }
          });
        }

        // Fetch the latest data.
          if (request.readyState === XMLHttpRequest.DONE) {
              var response = JSON.parse(request.response);
              var results = response.query.results;
              results.key = key;
              results.label = label;
              results.created = response.query.created;
              app.updateForecastCard(results);
          } else {
            // Return the initial weather forecast since no data is available.
            app.updateForecastCard(initialTrainingData);
          }
        };
        request.open('GET', url);
        request.send();
    };
  */

  // @TODO add saveCourses function here
  // Save list of cities to localStorage.
  app.saveCourses = function() {
    // localStorage.classList = app.allClassList;
    app.storage.set('classList', app.allClassList);
  };

  /*****************************************************************************
   *
   * Methods for dealing with the app's model API
   *
   ****************************************************************************/

  app.storage = (function() {
    return {
      set: (key, val) => {
        if (app.dataSource === 'IDB') {
          // qID, questionText, correctAnswer, studentAnswer, result
        } else {
          localStorage[key] = JSON.stringify(val);
        }
      },
      getList: () => {  // Should just send back an array of classes.
        return new Promise((resolve, reject) => {

          /*// read "hello" in "keyval"
          dbPromise.then(function(db) {
            var tx = db.transaction('keyval');
            var keyValStore = tx.objectStore('keyval');
            return keyValStore.get('hello');
          }).then(function(val) {
            console.log('The value of "hello" is:', val);
          });
          */

          let tmpCourseList = [];

          if (app.dataSource === 'IDB') {
            appObjectStore = appDB.transaction('classList').objectStore('classList');
            // `appObjectStore` is established on app load (bottom of file)

            appObjectStore.openCursor().onsuccess = function(e) {
              var cursor = e.target.result;
              // if there is still another cursor to go, keep runing this code

              if (cursor) {
                console.log('getList IDB cursor: ', cursor);
                tmpCourseList.push(JSON.parse(cursor));
              } else { // if (cursor === null) {
                // tmpCourseList = 'No courses.';
              }
              console.log('getList tmpCourseList: ', tmpCourseList, tmpCourseList.length);
              console.log('getList app: ', app);
              resolve(tmpCourseList);
            };

          } else {
            tmpCourseList = localStorage['EducationalAdvancement'];
            tmpCourseList = JSON.parse(tmpCourseList).classList;
            console.log('getList tmpCourseList: ', tmpCourseList, tmpCourseList.length);
            console.log('getList app: ', app);
            resolve(tmpCourseList);
          }
        });
      },
      get: (key) => {
        return new Promise((resolve, reject) => {
          let tmpCourse;
          if (app.dataSource === 'IDB') {
            tmpCourse = IDB.TX.select( {'id': key} );
            // return 'got ' + key + '!';
          } else {
            tmpCourse = localStorage[key];
            // return localStorage[key];
          }
          console.log('get 1: ', JSON.parse(tmpCourse));
          console.log('get 2: ', tmpCourse);
          console.log('get 3: ', app);
          resolve(JSON.parse(tmpCourse));
        });
      }
    };
  })();

  /************************************************************************
   *
   * Code required to start the app
   *
   ************************************************************************/

  app.getNewObj = function(localObj) {
    const newObj = {};
    newObj.id = localObj.id;
    newObj.active = localObj.active;
    newObj.courseVendorName = localObj.courseVendorName;
    newObj.courseVendor = localObj.courseVendor;
    newObj.courseDesc = localObj.courseDesc;
    newObj.courseDateStarted = localObj.courseDateStarted;
    newObj.courseDateLast = localObj.courseDateLast;
    newObj.courseProgress = localObj.courseProgress;
    newObj.courseList = localObj.courseList;
    return newObj;
  };

  app.getClassList = function() {

    app.storage.getList().then( tmpClassList => {

      setTimeout( () => {
        if (app.isLoading) {                      // Turn spinner off.
          // app.spinner.setAttribute('hidden', true);
          app.spinner.style.opacity = 0;
          app.container.removeAttribute('hidden');
          app.isLoading = false;
        }
      }, 250);

// @TODO: Uncomment below
      // app.clearDisplayList();                   // Let's start clean; always; no unexpected side effects.

      // FIRST PASS - Populate with browser-saved data (if any; it will try IndexedDB first, then localStorage).

      if (tmpClassList.length > 0) {
        app.allClassList = tmpClassList;        // Array: Empty or populated with vendor objects (classes).
        app.updatedAllClassList('From Storage');
      }

      // SECOND PASS - Now get and update classes from external file (latest data).

      const url = 'training-list.js';           // 'https://kdcinfo.com/app/training/training-list.js'

      async function fetchClassList(urlToGet) {
        try {
          let response = await fetch(urlToGet, { method: 'GET' }); // , mode: 'no-cors', mode: 'same-origin'
          let text = await response.text();

          text = text.replace(/\n/g, '');       // ^^^ \n should be all that's needed.
          // text = text.replace(/\t/g, ' ');   // Tabs aren't used; possible future use.
          text = text.replace(/\`/g, '"');      // Convert string literals to quotes.
          text = text.replace(/[\s\s]+/g, ' '); // Remove double spacing
          text = text.replace(/\"\s/g, '"');    // Remove superfluous spaces after quotes.

          return text;

        } catch (e) {
          return {}; // Empty object
        }
      }

      fetchClassList(url).then( data => {

        const ourJson = data ? JSON.parse(data) : {};

        console.log('getClassList --> app: ', app);
        console.log('getClassList --> data: ', ourJson);

        if (ourJson.classList) {


          if (app.visibleClassSet.size > 0) {
            app.updateLocalDB(ourJson.classList); // Replace entire local DB with this new data (could be empty).
          }

          if (ourJson.classList.length > 0) {
            app.allClassList = ourJson.classList;
            app.updatedAllClassList('Fetched');
          }

        } else {
          app.errorMsg('There was an error with the classList.');
        }

      }).catch( (e) => {
        console.log('ERROR:');
        console.log(e);
        app.errorMsg('There was an error fetching the class listing.', e);
      });

      /* The user is using the app for the first time, or the user has not saved anything.
       *
        app.updateForecastCard(initialTrainingData);
        app.allClassList = [
          {key: initialTrainingData.key, label: initialTrainingData.label}
        ];
        app.saveCourses();
       */
    });
  };

  app.errorMsg = function(msg, e = '') {
    alert(msg + '\r\n\r\n' + e);
  }

  app.updateLocalDB = function(jsonData) {
    // @TODO: Need to update local DB with this new jsonData [array.length >= 0]
  }

  app.clearDisplayList = function() {
    while (app.container.childElementCount > 0) {
      app.container.removeChild(app.container.childNodes[0]);
    }
  };

  // Possible paths:
  // In from DB - empty
  // In from DB - data
  // In from JS - data

  /**
   * Populate both `visibleClassSet` and `visibleClasses`
   *
   */

  app.updatedAllClassList = function(msg = '') {
    if (app.allClassList.length > 0) {

      if (app.visibleClassSet.size > 0) { // Pre-populated // @TODO: Is `if` necessary? Quicker to just clear it?
        app.visibleClassSet.clear();      // Replace the data
      }

      // @TODO: Future 'sort' feature: app.allClassList.sort((a,b)=>1|-1|0)

      app.allClassList.forEach( classObj => {
        if (classObj.active) {                          // No non-active classes allowed inside `visibleClassSet`.
          app.visibleClassSet.add(classObj.id);         // Update Set with IDs
          const trimmedObj = app.getNewObj(classObj);
          app.visibleClasses[classObj.id] = trimmedObj; // Update visibleClasses object (actives)
        }
      });

      console.log('[updatedAllClassList]', msg);

      if (app.visibleClassSet.size > 0) {
        console.log('... [visibleClassSet]', app.visibleClassSet);
        app.listClasses();
      }
    } // Else; Nothing to do
  };

  // Iterate all of the classes and attempt to get the latest class data
  app.listClasses = function() {

    const updatedItems = [];

    console.log('listClasses children: ', app.container.childElementCount, app.container.childNodes);

    if (app.container.childElementCount > 0) {
      // Cycle thru NodeList        - Remove obsoletes
      // Cycle thru Set             - Remove obsoletes; Update existing classes.
      // Cycle thru `allClassList`  - Add remaining.
      // Check the rest for `courseDateLast`

      // const classItem = [].indexOf.call(app.container.childNodes, callback); // indexOf has no callback
      // const classItem = [].find.call(app.container.childNodes, callback);    // Need the index for replacements
         // callback = elem => elem.id === classId
      // let classItemIdx = -1;
      // const classItem = [].find.call(app.container.childNodes, (elem, idx) => {
      //   if (elem.id === classId) { classItemIdx = idx; return true; }
      // });

      app.container.childNodes.forEach( (childNode, idx) => {
        // `app.container` is a `querySelector`; not a live collection.

        console.log('forEach: ', idx, childNode);

        if (childNode.nodeType === childNode.ELEMENT_NODE) {
          if (!app.visibleClassSet.has(childNode.id)) {
            console.log('inside ^: ', childNode.parentNode.childElementCount, childNode.parentNode.childNodes);
// @TODO: Uncomment below (once storage of external file is complete)
            // childNode.parentNode.removeChild(childNode);  // REMOVE
            console.log('inside _: ', app.container.childElementCount, app.container.childNodes);
          } else {

            // @TODO: Don't overwite if not newer (or changed).
            // But need to know what the HTML (DOM) structure will be.
            // Might be able to do some hiddne inputs for checking.
            console.log('childNode: ', childNode);

            app.listCourse(childNode.id, childNode);      // REPLACE
            updatedItems.push(childNode.id);
          }
        }
      });
      console.log('outside >: ', app.container.childElementCount, app.container.childNodes);
    }

    app.visibleClassSet.forEach( classId => {
      if (!updatedItems.includes(classId)) {
        app.listCourse(classId);                          // ADD (class not in list; hasn't been replaced.)
      }
    });

    app.setAllCardsUI();
  };

  app.setAllCardsUI = function() {

    // Extracted from:

    nodes = document.querySelectorAll(".item-node");
    totalNodes = nodes.length;

    for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
      node = nodes[nodeCnt];

      dupe = node.cloneNode(true);         // We'll clone each node so it can "follow" its sibling `node` element around the UI.
      dupe.classList.remove("item-node"); // .item-node | visibility: hidden - Will move natively with Flex wrapping (snappy!).
      dupe.classList.add("item-dupe");     // .item-dupe | visibility: visible - Will smoothly follow sibling .item-node around.

      node.parentNode.appendChild(dupe);  // Position: `absolute` - Each clone stays relative to their shared parent container.

      dupe.addEventListener('click', app.clickClass.bind(node));

      dupe.style.top = node.offsetTop + 'px';   // Establish each dupe's `absolute` position.
      dupe.style.left = node.offsetLeft + 'px'; // <--^

      boxes[nodeCnt] = { node, dupe };
    }
  };

  app.moveNodes = function() {
    // CSS Flex: Smooth Wrapping - https://codepen.io/KeithDC/pen/XYMgQj
    //
    clearTimeout(resizeWaitID);
    resizeWaitID = setTimeout(() => {
      for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
        boxes[nodeCnt].dupe.style.left = boxes[nodeCnt].node.offsetLeft + 'px';
        boxes[nodeCnt].dupe.style.top = boxes[nodeCnt].node.offsetTop + 'px';
      }
    }, 101);
  }

  app.clickClass = function(e) {
    document.querySelector('.content-wrapper').style.opacity = 0;
    this.parentNode.parentNode.classList.add('maxit');
    app.moveNodes();
    setTimeout( () => {
      document.querySelector('.content-wrapper').style.opacity = 1;
    }, 500);

    // @TODO: Populate content pane
  }

  app.getClassCard = function(cid, existing = false) {

    let classWrapper = app.cardTemplate.cloneNode(true),
        updateMsg = document.createElement('span');

    classWrapper.classList.remove('card-template');
    classWrapper.classList.add('item-node');
    classWrapper.removeAttribute('hidden');

    const courseVendorName = app.visibleClasses[cid].courseVendorName,
          courseVendor = app.visibleClasses[cid].courseVendor,
          courseDesc = app.visibleClasses[cid].courseDesc,
          courseDateStarted = app.visibleClasses[cid].courseDateStarted,
          courseDateLast = app.visibleClasses[cid].courseDateLast,
          courseProgress = app.visibleClasses[cid].courseProgress,
          courseList = app.visibleClasses[cid].courseList;

    classWrapper.querySelector('.ch-id').textContent = cid;
    classWrapper.querySelector('.ch-courseProgress').textContent = courseProgress;

    classWrapper.querySelector('.c-courseVendorName').textContent = courseVendorName;
    classWrapper.querySelector('.c-courseVendor').textContent = courseVendor;
    classWrapper.querySelector('.c-courseProgress').textContent = courseProgress;
    classWrapper.querySelector('.c-courseDateLast').textContent = courseDateLast;

    classWrapper.querySelector('.ch-courseDateStarted').textContent = courseDateStarted;
    classWrapper.querySelector('.ch-courseDesc').textContent = courseDesc;

    // @TODO: Do the same with course sections.

    classWrapper.querySelector('.ch-courseList').textContent = courseList;

    if (existing) {                           // Add <span> overlay: "Updated!"
      updateMsg.textContent = 'Updated!';
      classWrapper.appendChild(updateMsg);
    }

    // classWrapper.addEventListener('click', app.clickClass.bind(classWrapper));

    return classWrapper;

    /*
      var cardLastUpdatedElem = card.querySelector('.ch-courseProgress');
      var cardLastUpdated = cardLastUpdatedElem.textContent;
      if (cardLastUpdated) {
        cardLastUpdated = new Date(cardLastUpdated);
        if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
          return;
        }
      }
      cardLastUpdatedElem.textContent = data.created;
    */
  }

  app.listCourse = function(classId, existingChild = null) {

    if (existingChild) {  // REPLACE
      const storedClassProgress = existingChild.querySelector('.ch-courseProgress').textContent;

      console.log('listCourse 1: ', typeof storedClassProgress, storedClassProgress);
      console.log('listCourse 2: ', typeof app.visibleClasses[classId].courseProgress, app.visibleClasses[classId].courseProgress);

      if (storedClassProgress !== app.visibleClasses[classId].courseProgress) {
        // Note: `classId` and `existingChild.id` are the same.
        existingChild.parentNode.replaceChild(app.getClassCard(classId, true), existingChild);
      }

    } else {              // ADD
      app.container.appendChild(app.getClassCard(classId));
    }
  };

  /*****************************************************************************
   *
   * Setup IndexedDB (if applicable)
   *
   ****************************************************************************/

  app.initialDBCheck = function() {
    if (app.dataSource === 'IDB') {

      // var dbPromise = window.indexedDB.open('EducationalAdvancement', 1, function(upgradeDb) {
      //   var keyValStore = upgradeDb.createObjectStore('classList');
      //   // keyValStore.put("world", "hello");
      // });

      let request = window.indexedDB.open("EducationalAdvancement", 1);

      request.onupgradeneeded = function(e) {
        appDB = e.target.result; // request.result,
        appObjectStore = appDB.createObjectStore("classList", { keyPath: "id" }); // { autoIncrement: true });

        appDB.onerror = function(event) {
          // note.innerHTML += '<li>Error loading database.</li>';
          app.dataSource = 'LOCAL';
          app.message('Error loading database with IndexedDB. Switching to localStorage.');
          app.initialDBCheck(); // Re-run with localStorage
        };

        // index = store.createIndex("courseVendorName", "courseVendorName", {unique: false});
      };

      request.onsuccess = function(e) {
        appDB = e.target.result; // Establish `appDB` as our global DB Table.
        app.getClassList(); // Classes are extracted into an array from: appObjectStore.openCursor()
      }

      request.onerror = function(e) {
        app.dataSource = 'LOCAL';
        app.message('Error opening database with IndexedDB. Switching to localStorage.');
        app.initialDBCheck(); // Re-run with localStorage
      };

    } else { // Local

      if (typeof window.localStorage !== 'undefined') {

        appDB = localStorage.getItem('EducationalAdvancement');

      } else {
        alert('Your browsing device has no storage (i.e., no data persistence.) ' +
              'You can still run the app, but nothing will be saved when you leave.');
      }

      if (appDB === null || typeof appDB === 'undefined') {
        appDB = JSON.stringify({ "classList": [] });
        localStorage.setItem('EducationalAdvancement', appDB);
      }

      app.getClassList();
    }
  };

  app.initialDBCheck(); // Let's get the ball rolling!

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.querySelector('.main-wrapper .content-wrapper .close-it').addEventListener('click', () => {
    document.querySelector('.content-wrapper').style.opacity = 0;
    setTimeout( () => {
      document.querySelector('.main-wrapper').classList.remove('maxit');
      app.moveNodes();
    }, 500);
  });

  window.addEventListener("resize", app.moveNodes); // CSS Flex: Smooth Wrapping - https://codepen.io/KeithDC/pen/XYMgQj

  /*
   * Initial data presented when app has no saved data (e.g., first time app is used).
  let initialTrainingData = {
    key: 'google-training',
    label: 'Progressive Web Apps',
    courseList: [] // { id: 1, courseName: '', ... }
  };
   */

  // TODO add service worker code here
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', function() {
  //     navigator.serviceWorker
  //              .register('./service-worker.js')
  //              .then( () => console.log('Service Worker Registered') );
  //   });
  // }
})();
