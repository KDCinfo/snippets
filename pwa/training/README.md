# Educational Advancement 2018

`Educational Advancement` is a listing of courses I've been engaged with since May 2018.

## Training Progress SPA

In May 2018, I began investing time learning Progressive Web Apps (PWA). In that neither selected training vendor provides a public profile page, I decided to create a SPA showing my relevant and ongoing course studies.

The SPA's data store currently uses IndexedDB with a fallback to localStorage. Once complete, it will support service workers as well. In all cases, the overriding source of truth is an external `.js` file.

## SPA Progress

- [x] UI [In Progress]

  - [x] Overall layout: 2 States

    - Course 'Listing' only: Summary of vendor-level courses (responsive).
    - 'Detail' View: Course listing with active detailed view (2 layouts).

      - Narrow [vertical] A short scrollable Listing over the Detail view.
      - Wide [side-by-side] A full-page Listing on the left with Detail (active course) on the right).

  - [x] Animate course listings between 'Listing' and 'Detail' layouts (allow for browser resizing).

    - CodePen: Figure out how to get CSS Flex wrapping to move smoothly to new positions.

      - My solution: [CSS Flex: Smooth Wrapping](https://codepen.io/KeithDC/pen/XYMgQj)

    - Apply CodePen results to Training project.

  - [x] Implement course sub-subject listings in Detail view.

- [x] Save SSOT (external `.js` file) back into either IndexedDB (or localStorage, as fallback).

- [ ] [IP] PWA: Add service worker as primary cache ahead of IndexedDB.

  - If SW not available, use IDB as backup; then try localStorage (if IDB isn't available).

## In Other News...

As a part of creating this SPA, I also [created a CodePen](https://codepen.io/KeithDC/pen/XYMgQj) where I was able to successfully smooth out CSS's Flexbox wrapping using CSS transitions.

Previous educational advancements can be found in the [educational section of my resume](https://kdcinfo.com/resume.php?education).
