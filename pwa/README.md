# Progressive Web Apps

Chronological - Descending (reverse order)

## [2018-06]

> Work-In-Progress: [Educational Advancement: Course Summaries 2018](https://kdcinfo.com/app/training/)

In May 2018, I began investing time learning Progressive Web Apps (PWA). In that neither selected training vendor provides a public profile page, I'm in the process of creating a SPA showing my relevant course studies. 

The SPA's data store currently uses IndexedDB with a fallback to localStorage. Once complete, it will support service workers as well. In all cases, the overriding source of truth is an external `.js` file.

- [IP] UI [In Progress]

  - [x] Overall layout: 2 States

    - Course 'Listing' only: Summary of vendor-level courses (responsive).
    - 'Detail' View: Course listing with active detailed view (2 layouts).

      - Narrow [vertical] A short scrollable Listing over the Detail view.
      - Wide [side-by-side] A full-page Listing on the left with Detail (active course) on the right).

  - [x] Animate course listings between 'Listing' and 'Detail' layouts (allow for browser resizing).

    - CodePen: Figure out how to get CSS Flex wrapping to move smoothly to new positions.
    
      - My solution: [CSS Flex: Smooth Wrapping](https://codepen.io/KeithDC/pen/XYMgQj)
      
    - Apply CodePen results to Training project.

  - [IP] Implement course sub-subject listings in Detail view.

- [ ] Save SSOT (external `.js` file) back into either IndexedDB (or localStorage, as fallback).

- [ ] PWA: Add service worker as primary cache ahead of IndexedDB.

  - If SW not available, use IDB as backup; then try localStorage (if IDB isn't available).

## [2018-05]

Completed: [Your First Progressive Web App (Google Code Labs)](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/)

> Result: Weather PWA

    > [Demo](https://kdcinfo.com/app/your-first-pwapp/)
    > [Source Code (GitHub)](https://github.com/KDCinfo/snippets/tree/master/pwa/your-first-pwapp)

> Other Resources:

  - [Service Workers - Primer](https://developers.google.com/web/fundamentals/primers/service-workers/)
  - [Service Workers - Debugging](https://codelabs.developers.google.com/codelabs/debugging-service-workers/#0)
  - [Caching Strategy](https://jakearchibald.com/2014/offline-cookbook/)
