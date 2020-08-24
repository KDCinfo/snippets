# KD-reCall - A mobile app suite of simple reminder apps.

- In-Progress
- Pilot app target date: Mid to end of Sept 2020.

## Site and Primary Pages

- https://kdrecall.com

  `-> https://kdcinfo.com/kdrecall/
  
      | https://kdcinfo.com/kdrecall/preferences.php
      
      | https://kdcinfo.com/kdrecall/auth/login.php
      
      | https://kdcinfo.com/kdrecall/auth/logout.php

## Tech Used

- Flutter, Dart, SharedPrefs, SecureStorage
- HTML, CSS, JavaScript, PHP, MySQL

## Revision Synopsis

The basic beginnings:

- Database tables and relationships outlined, structured, and modeled.
- Web-based authentication system setup (based primarily on my custom auth system from both petrefapp.com and storycore34.com).
- Web-based authentication testing setup with Selenium IDE.
- Mobile app structure created.
- Mobile app authentication routing and page setup.
- Mobile app auth testing setup with Flutter testing.
- Web-based pages refactored to reflect mobile app theming.

## Revision History

> 2020‑05‑08

- [web] Initial commit for KD-reCall.
- [web] Incremental development update.

> 2020‑05‑14

- [web] Incremental development updates.

> 2020‑05‑16

- [web] Working on session handling.
- [web] Finished PHP session handling.

> 2020‑05‑21

- [web] Initial split between auth for both web and app.

> 2020‑05‑24

- [web] Worked on /auth. Renamed /app to /api.
- [web] Auth path still working. API: Login and Logout are done (w/ JWT).

> 2020‑05‑28

- [web] Progress: Auth flow, session control, and some security (removed JWT)

> 2020‑06‑01

- [web] Started userData object population from server for client on login.
- [web] Added pertinent user obj props. Setup whichApp and app_id usage.

> 2020‑06‑09

- [web] Authentication implementation / merge / refactor.
- [web] Authentication: Added app_id
- [web] Authentication: Added removeAll(). 'app_id' adjustments.
- [web] Authentication: Added [whichApp|whichForm]_array, api/[verify|reset|dnd], api/http_responses. Bug fixes.
- [web] Authentication: Finished api/DND.
- [web] Authentication: Finished auth/DND. Bug fixes and code tweaks.
- [web] Authentication: E-mail adjustments. DND refactor. Finished auth/reset.

> 2020‑06‑10

- [web] Auth: Refactored auth/reset to require username if not logged in. Changed PASSWORD_BCRYPT to PASSWORD_DEFAULT.
- [web] Auth: Completed final revision of flowchart diagram.

> 2020‑06‑12

- [web] Auth flow source asset file updates.
- [web] Auth: Added login logic to reset ref. name. Added 'resend'.
- [web] Added 'api/reset'. Added active user orphan token check. Fixed expiration check.

> 2020‑06‑13

- [web] Auth: 2 DB updates. Implemented create_user_tables. Began allowing for multi-app registrations.

> 2020‑06‑15

- [web] Auth: Working on allowing login to register a new app - having to do some refactoring.
- [web] Auth: Cleaned up files and fixed some bugs. Adjusted tests.
- [web] Auth: Got user preferences showing on preferences page.


> 2020-06

- [browser extension] Took two weeks off to create a browser extension.


> 2020‑07‑03

- [mobile] Initial commit of mobile app source files.

> 2020‑07‑05

- [mobile] Structural refactor and UI completion of login screen.

> 2020‑07‑22

- [mobile] Login UI complete. Began testing.

> 2020‑07‑24

- [mobile] Got some testing to work using lists, maps, and loops.

> 2020‑07‑31

- [mobile] Getting caught up: Field-level testing is done. Login is done.
- [web] Getting caught up: Field-level testing done. Login done.

> 2020‑08‑03

- [mobile] Just preserving where I'm at: API token logins ~70-80%.

> 2020‑08‑05

- [mobile] Login and logout with token working through app via API.
- [web] Added app_user_access table w token. Began login/logout auth flows.
- [web] Progress on login/logout flow with token.
- [web] Login and logout with token working through app via API.

> 2020‑08‑07

- [mobile] Auth page near complete. Starting on forgot password / password reset.
- [web] Progress on logout.
- [web] Progress on login, logout, and registration / verify.
- [web] Updated 'reset' and 'dnd' verify API pages and their email verbiage.

> 2020‑08‑09 [mobile, web]

- [mobile] Forgot/reset password complete. Authentication screen complete.
- [mobile] Cleaned some code. Added printK(). Added _nameRef to logged in appbar title.
- [web] Added verifyAndReset form.

> 2020‑08‑12 [web]

Current primary focus from here on out is on completing the web authentication pages 100%. This includes finalizing the FAQ/terms/privacy/about panels, then will finalize the preferences page. All the while fixing and tweaking things along the way.

- Split out Hungry readme from kdrecall readme.
- Added getUserFromUID() for logged users. Removed access_code. Added 'exit()' after all header('location').

> 2020‑08‑14 [web]

- Finished with sessions. Another landing page iteration.
- Got index, landing page, and preferences layout code ready for boilerplating.

> 2020‑08‑15 [web]

- Moved images out of _img and into _assets_src

> 2020‑08‑16 [web]

- Added boilerplate templates. Added side drawer. Reduced placeholder text.
- Still working on preferences page.
- Made landing page responsive. Added contact form. Moved kdrecall.js include into _bottom. Added placeholder for links to app store.

> 2020-08-17 [web]

- Finished outline of structure for the primary files (index, login, logout, preference, meta, _bottom)
- Finished extrapolation of asset usage for same files (CSS, JS, [meta: css], [_bottom: js])
- Finished colorizing outlined usage in RightNote. 
  This allowed me to spot who is including what and where, thus spotting and removing two double-calls to kdrecall.js.
- Finished layout of preferences page in drawio. Created two views; wide and thin. Exported as PNG.
- Worked a bit on preferences page. Now that I can see what I'm aiming for, got all the HTML elements lined up and ready for CSS formatting.
- Started a bit on FAQ/terms/privacy wording (copied files from PetRefApp same as contact form).

> 2020-08-18 [web]

- Fixed burger buttons on faux appBar.
- Created `_includes` folder and shifted files.
- Got FAQ and About panels laid out and formatted.
- Converted `<div>`s to `<a>` tags for keyboard nav. Added keydowns and .focuses.

> 2020-08-19 [web]

- Went through wording in privacy panel.
- Began analyzing various modal entries and exits.

> 2020-08-20 [web]

- Began checking through tabbing on page.
- Added a closed tabbing loop on the contact form and the side drawer.
- Added privacy, FAQ, and contact form to footer.
- Created a 'modal endpoints' structural outline.
- Prettied up footer links.
- Added focus to hovers.
- Converted clickable `div`s and `span`s to `a` tags.
- Added keypresses to clicks.

> 2020-08-21 [web]

- Fixed and finalized closed tabbing loop on side drawer and contact form.
- Added and finalized tabbing loop on FAQ and Privacy modals.
- Prettied up all the modals; made more consistent with each other and the site.
- Think I'm done with the layout, formatting, and functionality of all the modals.
  - 4 modals
  - 8 entrances
  - All escape endpoints
  - All keyboard inputs for constrained keyboard navigation
- Keyboard navigation of entire index page is complete.

> 2020-08-22 [web]

- Shuttered the app detail blocks instead of expand-dropping them all in at once like a curtain call.
- Brought all four shutters up from the bottom, and coupled them with fade transitions.
- Made hero logo image clickable; added `alt` and `title` properties.
- Fixed two text links in appBar.
- Added some missing hrefs.

> 2020-08-22/23 [web]

- Done with verbiage, layout, and formatting on the FAQ, About, Privacy, Disclaimers, etc.
- Moved 'About' from Privacy to FAQ and updated references.
- Updated individual page meta titles and descriptions.
- Fixed error: When logging in, .toLowerCase() error on undefined.
