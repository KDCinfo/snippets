# Training Progress SPA

(a.k.a., Educational Advancement 2018)

This `Training Progress SPA` is a listing of courses I've been engaged with since May 2018.

[See it live!](https://kdcinfo.com/app/training/)

## Training Progress

In May 2018, I began investing time learning Progressive Web Apps (PWA). In that neither selected training vendor provides a public profile page, I decided to create a SPA showing my relevant and ongoing course studies.

The SPA's data store currently uses IndexedDB with a fallback to localStorage. Once complete, it will support service workers as well. In all cases, the overriding source of truth is an external `.js` file.

## SPA Progress

- [x] UI

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

- [x] PWA: Added service worker.

  - I implemented this SPA's service worker after I'd completed at least three `Progressive Web App` courses (check the `Completed` button on the app). I then spent a week on a wild goose chase; chasing a `/skeleton` no less. (What I thought was a part of the Web Cache API turned out to be proprietary functionality within one of the courses.)

  - Once I got that ironed out, I determined and implemented 5 caching strategies across both development and production. I spent the better part of two days in and around `fetch` and `cache`.

> [See it live!](https://kdcinfo.com/app/training/)

## Finale

### [2018-07-31] - Tuesday

@11:05 PM

  - Deployed to kdcinfo.com -- Live test.

    - Fixed issue with it not finding the correct path
    (added `getAppName` alongside `getScopeName`)

  - My first service worker is installed and active: https://kdcinfo.com/app/training/

  I did research on testing; there is none. For testing, I will continue to monitor, update, and keep an eye on updates as I do daily.
  ~~@TODONE: Check Safari.~~

@11:35 PM
  - Fixed service worker not caching but just 3 files.
  - Removed Google Analytics from being cached.

@12:01 AM
  - Updated `README.md`.

> [See it live!](https://kdcinfo.com/app/training/)

## In Other News...

As a part of creating this SPA, I also [created a CodePen](https://codepen.io/KeithDC/pen/XYMgQj) where I was able to successfully smooth out CSS's Flexbox wrapping using CSS transitions.

Previous educational advancements can be found in the [educational section of my resume](https://kdcinfo.com/resume.php?education).

## Q: Why do I develop free apps?

### A:

I'm a web/app developer by trait: Developing open source projects fills two purposes for me; I get more programming experience _(something I never tire of gaining)_, and I get a utility that can be crossed off my life's `@TODO:` list _(where it's likely been for years)_.

Additionally...

> Sharing is a building block for making lives better.

## Resources

Too many to count... but the two links below from Google Developers were among the top resources (I did one of the Google Labs as my very first go with PWAs):

  - [working-with-the-fetch-api](https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api)
  - [caching-files-with-service-worker](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
