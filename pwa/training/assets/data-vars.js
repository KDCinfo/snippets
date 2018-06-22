allClassList: [],           // Continuously repopulated with progressive data retrieval (per above).
visibleClasses: {},         // Active Classes: ID's with specific class data to be displayed.
visibleClassSet: new Set(), // Class IDs (unique); Used to loop and match to `visibleClasses` object.

// [200]
  app.getClassList = function() {
    app.storage.getList().then( tmpClassList => {
      if (tmpClassList.length > 0) {
        app.allClassList = tmpClassList;        // Array: Empty or populated with vendor objects (classes).
      fetchClassList(url).then( data => {
        if (ourJson.classList) {
          if (app.visibleClassSet.size > 0) {
            app.updateLocalDB(ourJson.classList); // Replace entire local DB with this new data (could be empty).
          if (ourJson.classList.length > 0) {
            app.allClassList = ourJson.classList;
            app.updatedAllClassList('Fetched');

// [307]
  app.updatedAllClassList = function(msg = '') {
    if (app.allClassList.length > 0) {
      if (app.visibleClassSet.size > 0) { // Pre-populated // @TODO: Is `if` necessary? Quicker to just clear it?
        app.visibleClassSet.clear();      // Replace the data
      app.allClassList.forEach( classObj => {
        if (classObj.active) {                          // No non-active classes allowed inside `visibleClassSet`.
          app.visibleClassSet.add(classObj.id);         // Update Set with IDs
          const trimmedObj = app.getNewObj(classObj);
          app.visibleClasses[classObj.id] = trimmedObj; // Update visibleClasses object (actives)
      if (app.visibleClassSet.size > 0) {
        app.listClasses();

// [334]
  app.listClasses = function() {
    if (app.container.childElementCount > 0) {
      app.container.childNodes.forEach( (childNode, idx) => {
        if (childNode.nodeType === childNode.ELEMENT_NODE) {
          if (!app.visibleClassSet.has(childNode.id)) {
    app.visibleClassSet.forEach( classId => {
      if (!updatedItems.includes(classId)) {
        app.listCourse(classId);                          // ADD (class not in list; hasn't been replaced.)
    app.setAllCardsUI();

// [502]
  app.getClassCard = function(cid, existing = false) {
    let classWrapper = app.cardTemplate.cloneNode(true),
    const courseVendorName = app.visibleClasses[cid].courseVendorName,
    classWrapper.querySelector('.c-courseVendorName').textContent = courseVendorName;

// [584]
  app.listCourse = function(classId, existingChild = null) {
    if (existingChild) {  // REPLACE
      if (storedClassProgress !== app.visibleClasses[classId].courseProgress) {
        existingChild.parentNode.replaceChild(app.getClassCard(classId, true), existingChild);
    } else {              // ADD
