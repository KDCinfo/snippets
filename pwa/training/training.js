(function() {
  'use strict';

  /*****************************************************************************
   *
   * Load data (courses) from IndexedDB; Use localStorage as a fallback.
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

  // Initialize App
  //
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
        },
        boxes = [];

  // Initialize Database / Storage
  //
  let appDB,
      appObjectStore;

  // Initialize DOM Nodes
  //
  let nodes = document.querySelectorAll(".item-node"), // .card-template, .item-node
      dupeIDnodes = document.querySelectorAll(".item-dupe"),
      nodeCnt = 0,      // Node count: Loop through nodes[]
      totalNodes = nodes.length,
      resizeWaitID = 0, // setTimeout ID for window.resize()
      lastMsg = '',
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
   *   See [training-list.js].classList
   *
   * [visibleClasses] - Includes all sortable properties
   *
   *   { 'udacity-1': {
   *       courseVendorName: '',  // Udacity
   *       courseVendor: '',      // Offline Web Applications
   *       courseDesc: '',        // (if any)
   *       courseDateStarted: '', // 2018 May
   *       courseDateLast: '',    // 2018 June
   *       courseProgress: 0,     // 0-100
   *       courseList: []
   *     }
   *   }
   */

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
    app.listCourseOld = function(key, label) {
        var statement = 'select * from weather.forecast where woeid=' + key;
        var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;

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
    };
  */

  /*****************************************************************************
   *
   * Methods for dealing with the app's model API
   *
   ****************************************************************************/

  app.addDataIDB = function(val) {
    // open a read/write db transaction, ready for adding the data
    var thisObjectStore = appDB.transaction(["classList"], "readwrite");
    // report on the success of the transaction completing, when everything is done
    thisObjectStore.oncomplete = function() {
      // console.log('<li>Transaction completed: database modification finished.</li>');
      app.message('IndexedDB transaction complete.');
    };
    thisObjectStore.onerror = function() {
      // console.log('<li>Transaction not opened due to error: ' + thisObjectStore.error);
      app.dataSource = 'LOCAL';
      app.message('Error with IndexedDB transaction. Switching to localStorage.');
      app.initialDBCheck(); // Re-run with localStorage
    };
    // Transaction not opened due to error: ConstraintError: Key already exists in the object store.
    // call an object store that's already been added to the database

    appObjectStore = thisObjectStore.objectStore("classList");
      // console.log('appObjectStore ... ... ...');
      // console.log(appObjectStore.indexNames);
      // console.log(appObjectStore.keyPath);
      // console.log(appObjectStore.name);
      // console.log(appObjectStore.transaction);
      // console.log(appObjectStore.autoIncrement);

    // Make a request to add our newItem object to the object store
    for (let thisV of val) {
      let objectStoreRequest = appObjectStore.put(thisV);
      objectStoreRequest.onsuccess = function(event) {
        // report the success of our request
        // to detect whether it has been succesfully added to the database, look at transaction.oncomplete
        app.message('IndexedDB request successful.');
        // console.log('<li>Request successful.</li>', event, thisV);
      };
    }
  };

  app.message = function(msg) {
    if (msg !== lastMsg) {
      lastMsg = msg;
      document.querySelector('.message').textContent += ' ' + msg;
    }
  }

  app.storage = (function() {
    return {
      set: (val, key = 'EducationalAdvancement') => {
        if (app.dataSource === 'IDB') {
          app.addDataIDB(val);
        } else {
          localStorage[key] = JSON.stringify(val);
        }
      },
      getList: (key = 'EducationalAdvancement') => {  // Should just send back an array of classes.
        return new Promise((resolve, reject) => {
          let tmpCourseList = [];

          if (app.dataSource === 'IDB') {
            appObjectStore = appDB.transaction('classList').objectStore('classList');
            // `appObjectStore` is established on app load (bottom of file)

            appObjectStore.openCursor().onsuccess = function(e) {
              var cursor = e.target.result;
              // if there is still another cursor to go, keep runing this code

              if (cursor) {
                tmpCourseList.push(JSON.parse(JSON.stringify(cursor.value)));
                cursor.continue();

              } else { // if (cursor === null) { // End of cursor.
                resolve(tmpCourseList);
              }
            };

          } else {
            tmpCourseList = localStorage[key];
            tmpCourseList = JSON.parse(tmpCourseList);
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
          resolve(JSON.parse(tmpCourse));
        });
      }
    };
  })();

  /************************************************************************
   *
   * ALL THE METHODS!!
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
        if (app.isLoading) {                    // Turn spinner off.
          // app.spinner.setAttribute('hidden', true);
          app.spinner.style.opacity = 0;
          app.container.removeAttribute('hidden');
          app.isLoading = false;
        }
      }, 250);

      app.clearDisplayList();                   // Let's start clean; always; no unexpected side effects.

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

        if (ourJson.classList) {

          // if (app.visibleClassSet.size > 0) {
          //   app.updateLocalDB(ourJson.classList); // Replace entire local DB with this new data (could be empty).
          // }

          if (ourJson.classList.length > 0) {
            app.allClassList = ourJson.classList;
            app.updatedAllClassList('Fetched');
            app.updateLocalDB(ourJson.classList); // Replace entire local DB with this new data (could be empty).
          }

        } else {
          app.errorMsg('There was an error with the classList.');
        }

      }).catch( (e) => {
        if (console && console.log) {
          console.log('ERROR:');
          console.log(e);
        }
        app.errorMsg('There was an error fetching the class listing.', e);
      });
    });
  };

  app.errorMsg = function(msg, e = '') {
    app.message(msg + ' :: ' + e);
  }

  app.updateLocalDB = function(jsonData) {
    // if (app.visibleClassSet.size > 0) {
    //   app.updateLocalDB(ourJson.classList); // Replace entire local DB with this new data (could be empty).

    app.storage.set(jsonData);

      // ^ Happens before... \/

    // if (ourJson.classList.length > 0) {
    //   app.allClassList = ourJson.classList;
    //   app.updatedAllClassList('Fetched');
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

      if (app.visibleClassSet.size > 0) {
        app.visibleClassSet.clear();                    // Pre-populated: Replace the data
        app.visibleClasses = {};
      }

      // @TODONE: 'sort' feature
      app.allClassList.sort( (a, b) => {
        // if (a.courseProgress > b.courseProgress) {
        //   return -1;
        // } else if (a.courseProgress < b.courseProgress) {
        //   return 1;
        // } else {
          if (a.courseVendorName < b.courseVendorName) {
            return -1;
          } else if (a.courseVendorName > b.courseVendorName) {
            return 1;
          } else {
            return 0;
          }
        // }
      });

      app.allClassList.forEach( classObj => {

        if (classObj.active) {                          // No non-active classes allowed inside `visibleClassSet`.
          app.visibleClassSet.add(classObj.id);         // Update Set with IDs
          const trimmedObj = app.getNewObj(classObj);
          app.visibleClasses[classObj.id] = trimmedObj; // Update visibleClasses object (actives)
        }
      });

      if (app.visibleClassSet.size > 0) {
        app.listClasses();
      }
    } // Else; Nothing to do
  };

  // Iterate all of the classes and attempt to get the latest class data
  app.listClasses = function() {

    const updatedItems = [];

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

      Array.from(app.container.childNodes).forEach( (childNode) => {

        if (childNode.nodeType === childNode.ELEMENT_NODE && childNode.classList.contains('item-node')) {

          let childNodeID = childNode.querySelector('.ch-id').textContent;

          if (!app.visibleClassSet.has(childNodeID)) {

            childNode.parentNode.removeChild(childNode);  // REMOVE

            dupeIDnodes = app.container.querySelectorAll('.item-dupe');
            if (dupeIDnodes.length > 0) {
              for (var k = 0; k < dupeIDnodes.length; k++) {
                if (dupeIDnodes[k].querySelector('.ch-id').textContent === childNode.querySelector('.ch-id').textContent) {
                  dupeIDnodes[k].parentNode.removeChild(dupeIDnodes[k]); // querySelectorAll is not a live collection.
                  break;
                }
              }
            }
            // app.visibleClassSet.delete(childNodeID);   // Already gone.
            // delete app.visibleClasses[childNodeID];

          } else {

            // These are all getting replaced, but it can still be determined if display needs updating.
            app.listCourse(childNodeID, childNode);       // REPLACE
            updatedItems.push(childNodeID);
          }
        }
      });
    }

    app.visibleClassSet.forEach( classId => {
      if (!updatedItems.includes(classId)) {
        app.listCourse(classId);                          // ADD (class not in list; hasn't been replaced.)
      }
    });

    app.setAllCardsUI();
  };

  app.listCourse = function(classId, existingChild = null) {
    // Note: `classId` and `existingChild.id` are the same.

    if (existingChild) {  // REPLACE
      const storedClassProgress = existingChild.querySelector('.ch-courseProgress').textContent, // Same as: `.c-courseProgress`
            storedClassVendorName = existingChild.querySelector('.c-courseVendorName').textContent,
            storedClassVendor = existingChild.querySelector('.c-courseVendor').textContent,
            storedClassDateLast = existingChild.querySelector('.c-courseDateLast').textContent,
            storedClassDesc = existingChild.querySelector('.ch-courseDesc').textContent;

      if (storedClassProgress !== app.visibleClasses[classId].courseProgress.toString() ||
          storedClassVendorName !== app.visibleClasses[classId].courseVendorName ||
          storedClassDesc !== app.visibleClasses[classId].courseDesc ||
          storedClassVendor !== app.visibleClasses[classId].courseVendor ||
          storedClassDateLast !== app.visibleClasses[classId].courseDateLast
         ) {
        existingChild.parentNode.replaceChild(app.getClassCard(classId, true), existingChild);
      } else {
        existingChild.parentNode.replaceChild(app.getClassCard(classId), existingChild);
      }

    } else {              // ADD
      app.container.appendChild(app.getClassCard(classId));
    }
  };

  // Creating the initial `item-node` cards.
  //
  app.getClassCard = function(cid, replaceExisting = false) {

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

    // courseList = [ { courseClassTitle, courseClassProgress, courseClassContent } ]

    classWrapper.querySelector('.ch-id').textContent = cid;
    classWrapper.querySelector('.ch-courseProgress').textContent = courseProgress;

    classWrapper.querySelector('.c-courseVendorName').textContent = courseVendorName;
    classWrapper.querySelector('.c-courseVendor').textContent = courseVendor;
    classWrapper.querySelector('.c-courseProgress').textContent = courseProgress;
    classWrapper.querySelector('.c-courseDateLast').textContent = courseDateLast;

    classWrapper.querySelector('.ch-courseDateStarted').textContent = courseDateStarted;
    classWrapper.querySelector('.ch-courseDesc').textContent = courseDesc;

    // @TODONE: Do the same with course sections.
    // classWrapper.querySelector('.ch-courseList').textContent = courseList;
    // <div class="c-courseList">
    //   <div class="cardList course-template">
    //     <div class="c-listitem cl-courseClassTitle"></div>

    let courseListWrapper = classWrapper.querySelector('.ch-courseList'),
        courseTemplate = courseListWrapper.querySelector('.course-template');

    if (courseList.length > 0) {

      courseList.forEach( (course, idx) => {
        let courseWrapper = courseTemplate.cloneNode(true);

        courseWrapper.classList.remove('course-template');
        courseWrapper.classList.add('course-node'); // , 'cc-course-' + cid);
        courseWrapper.removeAttribute('hidden');

        courseWrapper.querySelector('.cl-courseClassTitle').textContent = course.courseClassTitle;
        courseWrapper.querySelector('.cl-courseClassProgress').textContent = course.courseClassProgress;
        courseWrapper.querySelector('.cl-courseClassContent').innerHTML = course.courseClassContent;

        courseListWrapper.appendChild(courseWrapper);
      });

      courseListWrapper.removeChild(courseTemplate);
      classWrapper.appendChild(courseListWrapper);
    }

    if (replaceExisting) {                           // Add <span> overlay: "Updated!"
      updateMsg.textContent = 'Updated!';
      classWrapper.appendChild(updateMsg);
    }

    // classWrapper.addEventListener('click', app.clickClass.bind(classWrapper));
    // ^^^ Moved to: app.setAllCardsUI

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

  app.setAllCardsUI = function() {
    nodes = app.container.querySelectorAll(".item-node"); // These are all the HTML Elements that will be monitored for movement.
    dupeIDnodes = app.container.querySelectorAll('.item-dupe');
    totalNodes = nodes.length;

    for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
      node = nodes[nodeCnt];

      if (dupeIDnodes.length > 0) {
        for (var k = 0; k < dupeIDnodes.length; k++) {
          if (dupeIDnodes[k].querySelector('.ch-id').textContent === node.querySelector('.ch-id').textContent) {
            dupeIDnodes[k].parentNode.removeChild(dupeIDnodes[k]); // querySelectorAll is not a live collection.
            break;
          }
        }
      }

      dupe = node.cloneNode(true);        // We'll clone each node so it can "follow" its sibling `node` element around the UI.
      dupe.classList.remove("item-node"); // .item-node | visibility: hidden - Will move natively with Flex wrapping (snappy!).
      dupe.classList.add("item-dupe");    // .item-dupe | visibility: visible - Will smoothly follow sibling .item-node around.
      dupe.setAttribute('tabindex', 0);

      // Remove superfluous content that will only serve to make the node's `dupe` heavier to move around.
      const courseDesc = dupe.querySelector('.ch-courseDesc'),
            courseList = dupe.querySelector('.ch-courseList');
      dupe.removeChild(courseDesc);
      dupe.removeChild(courseList);

      node.parentNode.appendChild(dupe);  // Position: `absolute` - Each clone stays relative to their shared parent container.

      dupe.addEventListener('click', app.clickClass.bind(nodeCnt));

      dupe.addEventListener('keydown', function(e) {
        // [event.keyCode] is deprecated.
        // [event.key] is its replacement.
        // [event.code] is not supported well (2017-11-07).
        if (e.key.charCodeAt() === 32 || e.key.toLowerCase() === 'enter') { // 32 = space
          e.target.click();
        }
      });

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
    }, 50);
  };

  app.focusCloseIt = function() {
    setTimeout( () => {
      const closeIt = document.querySelector('.close-it');
      closeIt.scrollIntoView({behavior: 'smooth'});
      setTimeout( () => closeIt.focus(), 500);
    }, 300);
  };

  app.clickClass = function(e) {
    // `this` refers to clicked DOM Node's index in: boxes

    //    .ch-id, .ch-courseProgress
    //    .c-courseVendorName, .c-courseVendor, .c-courseProgress, .c-courseDateLast
    //    .ch-courseDateStarted, .ch-courseDesc, .ch-courseList

    //                                                             .cc-courseDateLast
    //    .cc-courseDateStarted, .cc-courseDesc, .cc-courseList

    const nodeIdx = this;                // Passed in as a number from: app.setAllCardsUI

    let nodeContent = boxes[nodeIdx].node,
        dupeContent = boxes[nodeIdx].dupe,
        classContent = document.querySelector('.content-wrapper .content');

    classContent.style.opacity = 0;      // Turn off main content

    document.querySelectorAll('.item-dupe').forEach(elem => elem.classList.remove('active'));
    dupeContent.classList.add('active'); // De-activate all nodes, then activate clicked element.

    setTimeout( () => {
      classContent.querySelector('.cc-courseProgress').textContent = nodeContent.querySelector('.ch-courseProgress').textContent;
      classContent.querySelector('.cc-courseDateLast').textContent = nodeContent.querySelector('.c-courseDateLast').textContent;
      classContent.querySelector('.cc-courseDateStarted').textContent = nodeContent.querySelector('.ch-courseDateStarted').textContent;
      classContent.querySelector('.cc-courseDesc').textContent = nodeContent.querySelector('.ch-courseDesc').textContent;

      // .main-wrapper .content-wrapper
      if (classContent.querySelector('.cc-courseList')) {
        classContent.removeChild(classContent.querySelector('.cc-courseList'));
      }

      let newCourse = nodeContent.querySelector('.ch-courseList').cloneNode(true);
      newCourse.classList.remove('ch-courseList');
      newCourse.classList.add('cc-courseList');
      newCourse.removeAttribute('hidden');
      classContent.appendChild(newCourse); // course-template

      // Now that it's attached to the DOM, we can cycle through and attach an event listener to each topic.
      classContent.querySelector('.cc-courseList').querySelectorAll('.course-node').forEach( elem => {

        let expandElem = elem.querySelector('.expand-it');

        expandElem.setAttribute('tabindex', 0);
        expandElem.addEventListener('click', e => app.expandTopic(e));
        expandElem.addEventListener('keydown', function(e) {
          // [event.keyCode] is deprecated.
          // [event.key] is its replacement.
          // [event.code] is not supported well (2017-11-07).
          if (e.key.charCodeAt() === 32 || e.key.toLowerCase() === 'enter') { // 32 = space
            e.target.click();
          }
        });
      });
    }, 250);

    nodeContent.parentNode.parentNode.classList.add('maxit');
    app.moveNodes();
    setTimeout( () => {
      document.querySelector('.content-wrapper .content').style.opacity = 1;
      app.focusCloseIt();
    }, 501);
  };

  app.expandTopic = function(e) { // e = Clicked '.expand-it' DIV
    let isOwn = false;
    if (e.target.nextElementSibling.style.maxHeight === '250px') {
      isOwn = true;
    }
    e.target.parentNode.parentNode.querySelectorAll('.course-node .c-expandable').forEach(
      elem => elem.style.maxHeight = '62px'
    );
    if (!isOwn) {
      e.target.nextElementSibling.style.maxHeight = '250px';
    }
  };

  /*****************************************************************************
   *
   * Setup IndexedDB (if applicable)
   *
   ****************************************************************************/

  app.initialDBCheck = function() {

    // TODO add service worker code here
    // if ('serviceWorker' in navigator) {
    //   window.addEventListener('load', function() {
    //     navigator.serviceWorker
    //              .register('./service-worker.js')
    //              .then( () => console.log('Service Worker Registered') );
    //   });
    // }

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
   * Event listeners
   *
   ****************************************************************************/

  let closeIt = document.querySelector('.main-wrapper .content-wrapper .close-it');
  closeIt.addEventListener('click', () => {
    document.querySelector('.content-wrapper .content').style.opacity = 0;
    setTimeout( () => {
      document.querySelector('.main-wrapper').classList.remove('maxit');
      document.querySelectorAll('.item-dupe').forEach(elem => {
        if (elem.classList.contains('active')) {
          elem.classList.remove('active');
          setTimeout( () => {
            elem.focus();
          }, 250);
        }
      });
      app.moveNodes();
    }, 250);
  });
  closeIt.addEventListener('keydown', function(e) {
    // [event.key] is replacement for [event.keyCode]. [event.code] is not supported well (2017-11-07).
    if (e.key.charCodeAt() === 32 || e.key.toLowerCase() === 'enter') { // 32 = space
      e.target.click();
      setTimeout( () => {
        document.querySelector('.item-dupe').focus();
      }, 500);
    }
  });

  window.addEventListener("resize", app.moveNodes); // CSS Flex: Smooth Wrapping - https://codepen.io/KeithDC/pen/XYMgQj

  // <button>: Web App 'About'
  document.getElementById('button-toggle-webapp-help').addEventListener('click', (e) => {
    document.getElementById('app-message').classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    // Thanks to:
       // https://github.com/KDCinfo/expired-to-be/blob/master/public/extensions/chrome/popup.js
    if (!e.target.closest('#button-toggle-webapp-help') && !e.target.closest('#app-message')) {
      document.getElementById('app-message').classList.toggle('open', false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'escape') {
      document.getElementById('app-message').classList.toggle('open', false);
    }
  });
})();
