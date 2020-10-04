# KD-reCall - A mobile app suite of simple reminder apps.

- Status: In-Progress

- Target platform: Android

- Pilot app target date: Mid Oct 2020

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

---

> 2020-06

- [browser extension] Took two weeks off to create a browser extension.

---

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

> 2020-08-23 [web]

- Done with preferences page general layout.
- Applied a responsive breakpoint at 720px.
- Changed 'login status' to checkbox icon.
- Got all the form posting mechanics in place.

> 2020-08-24 [web]

- Done with styling toggle buttons. Instead of a switch, using an input="range" and custom styled slider. Sliders can be 0-1, 0-1-2, 0-1-2-3, etc.
  - Slider styling thanks to: [Daniel Stern](http://danielstern.ca/range.css/#/)
  - Browser compatibility cross-checked with: [CSS Tricks](https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/)
- Added a 950px media query breakpoint. This widens the interface from 768px out to 900px --- helps a little on the preferences page; not so much on authentication pages, which have their own styling.
- Began entering HTML code for pop-up tips.
- Removed "themes" from preferences page (`display: none`). Will get to them later if there's even any interest. Dark mode (theme) will suffice for now.

> 2020-08-24 [web] (technically; 08-25 @1:52 AM)

- Setup a preferences data object.
- Sliders now update the data object, then provide feedback to the preferences panel. Data object will also populate on button save.

> 2020-08-24 [web] (technically; 08-25 @4:15 AM)

- Finished with Preferences layout and formatting.
	- Moved 'Show Help' section to be alongside Global Dark Mode.
	- Added a question mark icon showing 'quick tip' pop-ups for 3 fields.
	- Added a checkbox for option to change password.
		- Will need to setup an intermediary screen for capturing current, and setting new password.
	- Ready for form validation and submission.

> 2020-08-25 [web]

- Added quick tip pop-up cancel buttons.
- Created a 'quick tip' pop-up for the various field-level validation requirements.
- Fixed the Save and Reset buttons on narrow screens; made responsive.

> 2020-08-25 [web]

- Began adding code for password fields.
- Added 3-sec countdown on login.
- Fixed reference name error.
- Tweaked quick tip box.
- Stopped sliders from updating `prefsObj` (original values); will be kept immutable.
- Getting a handle on how the form submission is going to work; 
  - Email change requires current password.
  - Password change requires current password, new password, and a confirm password.
  - None of these fields are present on the original preferences screen.

> 2020-08-26 [web]

- Added visual feedback when individual preference settings are changed.
  - For the sliders, feedback is immediate as the sliders are moved.
  - For the text inputs and textarea, feedback is when the field loses focus (blur; not worth a `keydown` listener).
- Added visual feedback when sliders are focused via keyboard.
- Determined password fields should be directly under their respective form fields.
- Finished the mechanics of adding dynamic password fields for both email or password changes.
  - Email changes require current password.
  - Password changes require current password, new password, and new password confirmation.
```
    - Chrome complained about having two password fields; suggested separating out forms.
    - These fields are a part of the overall form though; they're just dynamically toggled.
    - Thought about it, and my initial approach on how to do the two passwords seemed to work.
    - When hiding either of the relevant input fields, also set their attribute to `hidden`.
    - When displaying either of the relevant fields, set their attribute to `password`.
```
- Enabled auto-focus on dynamic password fields (hopefully click-then-lose-focus won't be an issue---will play around with it some).
- Moved form validation requirements quick tip button to bottom; is now a full-width button above submit/reset buttons.
- Removed question mark icon from validation requirement button, and stopped the bubbling `<b>` tag.
- Renamed `input-text` to `input-tip-text` for clarity.
- Removed 'app description' (clutter).

> 2020-08-27 [web]

- Disabled login button on click. Reenables on error.
- Misc tweaks and fixes.
- Password fields are expanding out nicely.
- Fixed issue with sliders popping back to name field.
  - Apparently sliders don't get focus by default when changing them, so manually applied `.focus()`.
- Fixed password min length on login.
- Consolidating validation constants in [page_overlay_js.php].
  - Technically there should be a more global version of 'runa.js'; one that 'runp.js', and potentially others, could leverage as a shared-scoped parent.
- Began adding code for form post return messages.
- Began pruning and adjusting client side validation code.

> 2020-08-28 [web]

- Began getting `app_prefs.php` setup --- will be a composite of multiple other files.
- Added countdown counter to Notes `textarea`.
  - `fieldNotesCounter.innerText = Math.max(0, 5000 - evt.target.value.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");`
    - // ^^^ Math.max()  | Thanks to: [stackoverflow.com => character-counter-backspace-doesnt-reflect-on-characters-remaining](https://stackoverflow.com/questions/42969347/character-counter-backspace-doesnt-reflect-on-characters-remaining)
    - // ^^^ Comma Regex | Thanks to: [stackoverflow.com => how-to-print-a-number-with-commas-as-thousands-separators-in-javascript](https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
- Prettied up the UI message response area.
- Took control over the `reset form` button to clear custom UI adjustments.
- Got the base of the server-side validation structure outlined and coded.
- Working on validation; primarily email and password data.

> 2020-08-29 [web]

- Set session to auto-timeout (will redirect to `log in` on any subsequent activity).
- Added in requirement for `whichApp` on all preferences form submissions (not just user ID).
- The API file `app_prefs` is a culmination of four other API files.
  - Initial gathering and go-through of all the major code pieces.
  - Aggregated and trimmed a lot of the code within.
  - Not posting to it from `runp.js` yet.

> 2020-08-30 [web]

- Began posting to `app_prefs`. Although currently a complete Frankenstein, got the file to load without error (posting from `runp.js`).
- Fixed session error. Moved the `include` call to `_core` to be __above__ session activity checks.
- A lot more code gathering and trimming inside `app_prefs`. Blocked out 3 major sections; top (initial sift), middle (in progress), bottom (TBD).

> 2020-08-31 [web]

- Continued the overhaul on the still-Frankensteined `app_prefs` API file. Got the major field sections grouped (email and password, name, notes, and the 3 sliders), although still quite rough.
- Began adding setter methods to the primary class object.

> 2020-09-01 [web]

- Filtering user's `notes`. Using a programmatical `textarea` to pass PHP-filtered `notes` to JavaScript.
- Fixed a double ternary (in PHP you gotta wrap that second ternary!)
- Added function to clear changed fields.
- Worked on reference name and slider validation.
- Updating initial `prefsObj` with changed field data.
- Additional class object updates.
- Fixed `user_reset` table to allow for `ON UPDATE CASCADE`.
- Fixed `user_notes` table; made `user_id` `UNIQUE` and increased `notes` to 5,000 characters.

> 2020-09-02 [web]

- Cut session timeout from 5 hours to 1 hour.
- Changed `email` field to trigger change event when user has stopped typing for half a second. Ergo, when the email field changes, it will no longer wait for the field to blur, but instead will show the 'current password' field near immediately after the field is changed.
- Fixed 'error flow-through' issue --- when one field validation failed, subsequent field validations would continue.
- Cleaned up session stats at bottom of preferences screen. It's now minimized by default, and only shows two stats (hid the two 'previous' session stats). Also added a small `scrollIntoView` on the footer (after the CSS animations are done; `1s`).
- All error handling now only posts log entries to server.
- Added `preferences-testing.md` and `preferences-testing.ods` to source assets.
- **The web-based preferences interface is complete.**

> 2020-09-03 [web]

- Structured and formatted 2 of 4 ancillary pages; password reset and DND.
- Started on 'user removal'.
  - Tried a handful of locations and layouts.
  - Ended up going next to 'Change Password'.
  - Initially going with `confirm` alert dialog.
  - No call to back end yet.
- New rule: Loosening up on [periods](https://www.dailywritingtips.com/period-goes-inside-quotation-marks/) and [commas](https://english.stackexchange.com/questions/23/is-it-ever-acceptable-for-a-period-to-come-after-a-quote-at-the-end-of-a-sentenc) being inside quotes, especially within all my 'programming endeavors'.

> 2020-09-04 [web]

- Structured and formatted remaining ancillary pages; verify and logout.
- Determined new user removal layout and process.
  - Moved to a modal for user removal functionality.
  - As with the footer link modals, made it keyboard friendly.
  - Providing a removal notice, input field for current password, and a submit button.
  - UI and UX feel good.

> 2020-09-05 [web]

- Completed user removal process.
  - Added supporting method to class object.
  - @JavaScript Fetch Form Posts &rarr; know what you're sending; `post data` or `JSON`.
    - Posts to: https://kdcinfo.com/kdrecall/?remove=success
  - Added account removal success message to KD-reCall home (index) page.
- Completed preferences page
  - 'Completeness' status was previously correct---for the time it was written; I did not account for user removal ... figured it was going to be in the side drawer panel menu, which is where I began with it.
  - Extracted out the embedded CSS into its own file.
- Changed out all [http_status] to 200 and added a [xsfer_status] with their relevant http status codes.
    Change all: http_status = 200

> 2020-09-06 -- 2020-09-17 [mobile]

This last week and a half is mostly just a blurred mixture of learning, trying, fixing, and a little actual programming.

- **Added option to save email address on login form (after a successful login).**
  - There was a three day delay in figuring out how to populate a form field after an async call.
  - I posted my findings on [Stack Overflow](https://stackoverflow.com/a/63876766/638153).
- **Added option to reveal (unmask) password.**
- Added Tooltips to both the 'save email' and 'unmask password' icon buttons.
  - Also integrated a TooltipTheme into the app's custom theme configuration.
- **Added an 'i'nfo icon in the app bar that opens an 'about' dialog showing info about the app.**
- **Added ability to 'swipe-down refresh' the authentication screen.**
- Eventually derived an approach for shared route authentication detection.
  - Was considering going with a splash screen, but came to the conclusion that an intermediary splash screen is unnecessary.
  - Instead, just added a transient "one moment..." wait screen for authentication detection, along with an instructive welcome message on the authentication screen. The pass-thru "one moment" message is about all you have time to read while waiting to know if you're already authenticated or not, which just does an async check into the device's secure storage.
- Fixed issue with server side error messages not being delivered to the snackbar.
  - Near three days later, during my second step-by-step widget-debugging step-through, I realized at one point it was hitting the router.
  - That led to the discovery that I had a 'notifyListeners()' at the end of one of the final form submission function calls. Oops.
  - Filtering this notifier call out of the login form submission fixed the error.
- Updated `minSdkVersion` to 21 and `targetSdkVersion` to 29 per [Codenames, Tags, and Build Numbers](https://source.android.com/setup/start/build-numbers).
  - [Codenames, Tags, and Build Numbers](https://source.android.com/setup/start/build-numbers)
  - [Target API level requirements for the Play Console](https://support.google.com/googleplay/android-developer/answer/113469#targetsdk)
  - [Build and release an Android app](https://flutter.dev/docs/deployment/android)

### Current App Status for 2020-09-17

Knowing I've still got a few more topics I will need to dive deeper into prior to completing the pilot app, I'm still pushing for the end of September (less than two weeks). However, realistically speaking, Hungry-on-Hand will likely run into early October. I still need to create the preferences screen, and then the actual app itself.

The goods news, however, is the remaining apps should require less than 5% of all this developmental 'overhead.' Ergo, I 'should' be able to eventually code one KD-reCall reminder app every 1 to 2 weeks, tops.

Below is a screenshot of what the completed login screen for mobile looks like. You'll find the theme reflects the [web-based interface](https://kdcinfo.com/kdrecall/) that was completed earlier. And of course, each mobile app will have its own hero-subtitled image.

<img alt="KD-reCall Login Screen" src="https://kdcinfo.com/kdrecall/_img/kdrecall_login_01.jpg" width="180">

> 2020-09-18 [web]

- Moved 'account removal' code from API (mobile) to POST (web) and refactored.
  - Because remove account is now a part of the preferences page, both web and mobile will split to their mirrored functionality, as is consistent with the rest of the project.
  - I thought the two could share this functionality---it was a poor and short-sighted decision. On a split-interface project such as this, we need structural code consistency!
  - Yes, some of the back end code sections are duplicated, sometimes verbatim even, but merging code functionalities should be done as a whole, not piecemeal (and what's the ROI?)
  - A couple other refactors are in order as well (@TODO:). One in particular is moving the throttle logic from back end form handlers to back end classes, as is done already in a couple places (and it's awesome!)
- Fixed issue with registration verification page found in error log.
- Fixed issue with redirect not working after account removal.

> 2020-09-19 [mobile]

- Added cancel button to forgot/reset password pop-up.
- Made hero image clickable (shows 'about' dialog).
- Refactored entire 'submit()' function to better flow through the API responses.
- Outsourced 'showInfoDialog' code as a static method in its own `auth_helpers` class.
- Lots more research and relearning on the overall Provider package concepts.  
  I'm now branching past just the authentication screen, and need a better understanding of the multi-provider routes I have setup.
- Began playing with dark mode theme. Lots to do, but going to solely focus instead on preferences screen.

> 2020-09-20 [mobile]

- Began prepping for creating the Preferences screen.  
  Gathered preference properties from web-based code.
  - Setup a data object that includes a few `static const` map properties (to emulate 'enums with values').
  - Outsourced those enum-with-value constants for comparison logic in other screens, and the `main`.  
  Started with a skeleton screen file.  
  Started with a skeleton provider file.
  - Will bring over coding structures from `Auth()` and some other classes.
  - Swapped out my test 'isFavorite' with the more proper 'isDark' (still hard coded).

An example of the `static const` maps now used as 'enums with values' thank to [@Nae on Stack Overflow](https://stackoverflow.com/a/54803079/638153):
```
  class LocalDarkmode {
    static const kd_off = '0';
    static const kd_on = '1';
    static const kd_global = '2';
  }
```

> 2020-09-21 [web - other]

Having been working with debugging my KD-reCall web-based preferences API, I got the idea to do a search on my entire `kdcinfo.com` domain for "error_log".

Sorting the results yielded some unexpected current findings. I then recalled that I did put up some temporary parking pages for quite a few of my utilities when I upgraded to PHP7. Those, coupled with a half dozen other findings, kept me busy for about 15 hours.

And yes, that was "results," as in plural. I have over a decade of projects created using a variety of technologies, but a LOT of those projects are 2002&ndash;2010 PHP files, which, after upgrading to MySQLi and PHP7, are still run wonderfully.

A quick list of the web apps I fixed are:
- [PHP/MySQL Form-a-Form](https://kdcinfo.com/db/form-a-form/)
- [Guess-a-Number](http://guess-a-number.sourceforge.net)
- [TWG Hall o' Fame](https://kdcinfo.com/twg-hallofame/)
- [My B to B Online Business Form](https://kdcinfo.com/db/b2b-order-form/)
- WoW [Blog](https://kdcinfo.com/wow/), [journal](https://kdcinfo.com/wow/journal.php), and [character pages](https://kdcinfo.com/wow/chars.php)
- [My first photo album](https://kdcinfo.com/K_Album/Album.php)
- [Personal countdown calendar](https://kdcinfo.com/db/CalCnt/CDC.php)
- [Pick-a-Meal](https://kdcinfo.com/pickameal/)

> 2020-09-22 [mobile]

- Extracted out the AppBar into its own widget class.
- Extracted out the entire body's `Stack()`, which accepts a custom child widget as its innermost content `Card()`.
- Got Prefs screen started pretty good.  
  I'd say I'm about 20% through the UI screen file initial setup.
- Got Prefs provider data initially setup pretty good.
  - Created the `isDark` functional logic in the Prefs provider based on `Auth()->UserInfo` settings.

> 2020-09-23 [mobile]

- Got all the critical errors cleared in both 'prefs_p.dart' and 'prefs_card.dart'.
  - No logic yet, and all the fields are complete Frankensteins, but the screen comes up.
- Conglomerating data flow through `AuthData` and `UserInfo` to gain insights on how Prefs() fits into it all  
  (i.e. provider-level data sharing and access, routes, and themes).
- Created a draw.io code skeleton composite for a broader view of the data and interactions between the app's main, provider, models, and screen files.  
  Creating and updating diagrams and flowcharts, although time consuming, can help immensely in walking back through the code in detail, oftentimes revealing flaws along the way.

> 2020-09-24 [mobile]

- Finally got all the code, data, and flows lined up in both `prefs_p` (provider file) and `prefs_card` (functional inner-screen widget---each screen has its own).  
  Getting a _little better_ handle on data initialization at the 'forest level'.
- Began adding a couple input listeners ('email' and 'nameRef').  
  `_formControllerEmail.addListener(_showChangeEmail);`
- Started up app.  
  Error --> Changed out provider initialization call with a hard-coded `true` in `main.dart`.  
  Error --> Something something on a null object --- But the screen came up!

> 2020-09-25 [mobile]

- Fix for #2:
  - Removed `_localPrefsData` initialization from the Prefs() build, and now initializing when instantiating.
    `PrefsData _localPrefsData = PrefsData();`
- Fix for #1: After further research I have determined I need to refactor my app's theme approach.
  - Search topics: "MultiProvider" "consumer" "themedata"

About to take a new trek on my app's theme setup.
  - My original `themedata` findings didn't account for the `isDark: true` being set dynamically. :(

Current Status: Two steps forward, one step back. Going to have to refactor the app's entire theme approach. It's a learning process. :)

> 2020-09-25 [mobile] - Part 2

As previously mentioned, couldn't get dark mode set dynamically via `Provider` within my current theme setup, so I researched and found a more comprehensive approach to theming.

New theming implementation:
- A review of their code didn't look like it would work.
- Installation of their demo files from GitHub produced at least a dozen errors.
- But after fixing the criitical errors, the app came up and worked.
- It was beautiful!

But what worked wasn't dark mode ... what worked was the ability to switch between custom preset themes. Wow!

To be honest, I'm still processing what this new theme approach just accomplished---my first, second, and third thoughts are that it's awesome! But, I'm still factoring its functional integrity, how it applies to dark mode, and how & _IF_ it really applies to fully custom personalized themes---something I had set aside for the pilot app's development.

Having themes this easy feels too good to be true, but I saw it working before my very eyes, in both their app and my own, so I just need to let it sink in and process its flow and application. If this turns out to be a solid approach, as I will find while completing the integration, I will also need to reactivate preset themes on the web's preferences page, test the API endpoints, and still implement dark mode (but should now be able to do through this new theming mechanism).

The new theme approach was provided by [FlutterDevs](http://flutterdevs.com) via their [GitHub repo](https://github.com/flutter-devs/flutter_multitheme_demo/), and explained in their [Medium walkthrough:
Multi Theme Using Provider in Flutter](https://medium.com/flutterdevs/multi-theme-using-provider-in-flutter-cdb89bbde4e0).

- Their approach was uniquely insightful in that it provided the missing details on how to use their theme's `ChangeNotifier` (in the provider file) **with** the `ChangeNotifierProvider` in the `providers` List[].

- Secondly, in all my learnings, I've not seen an example of where the `ChangeNotifierProvider` was used as a `child:` of the `MultiProvider`, even though it's also been configured in the `providers` List[]. This feels like an advanced approach for the Provider package perhaps? The [Flutter documentation](https://flutter.dev/docs/development/data-and-backend/state-mgmt/simple) also only shows the `ChangeNotifierProvider` being configured in the `providers` List[].

Their Medium article's walklthrough also references [Panache: A Flutter Material Theme editor](https://rxlabz.github.io/panache_web/). As stated on the Panache website,

- Panache helps you to create beautiful Material themes for your Flutter applications.
- Customize widgets colors and shapes, and download your theme.dart file.

In summary, I swapped out the Theme class for a ThemeModel. And although I do find this theming approach is a significant bonus for the app as a whole, I will need to spend some time to complete the theme's integration, as well as developing out all the resulting action items.

> 2020-09-26 [_]

- Day trip to Sacramento.

- Still not yet processed the application and effects of the new theming system.

Between refactoring the app's entire theme, adding custom preset themes back into development, and today's day trip, the pilot app's delivery has shifted to mid-October.

> 2020-09-27 [_]

- Another detour:

My [project showcase domain](https://kdcbase.com) at kdcbase.com is a masked redirect to [content provided](https://kdcinfo.com/db/kdcbase/) from my [personal portfolio domain](https://kdcinfo.com) on kdcinfo.com. I sat through chatting with half a dozen CS tech reps while setting up the kdcbase.com SSL, and, as usual, learned a few new things about my domains along the way.

- Stuck again in some 'lack of knowledge' muck.

I spent some time trying to get button font sizes increased via the new theming system now in place, only to find that none of the `ThemeData` properties provided by the new system work. Well, they may be working, but nothing is set to take advantage of whatever is working ... perhaps? I certainly saw something working! 

I do know the primary and secondary colors I have setup are working, because the app's colors look almost back to normal (excepting a few blue colors here and there).

Need to process.

> 2020-09-28 [mobile]

A new approach:

  - I brought back up the demo theme project and went through file by file.
  - I took a forest-level look at what it is I'm trying to accomplish, and what I currently have set in place to accommodate what needs to be done.

@5:02 PM I figured it out.  
  
  - In the `MaterialApp` widget, there is both a `darkmode`, and a `theme` property. tl;dr, ne'er the twain shall meet.
  - The darkmode property will be used in certain cases, and the code for the new theme system I'm using had both set.

@11:40 PM

- Added in two color themes from Panache ('paprika' and 'yellowish').
- Refactored the code based on my new understandings and got it working. Some icons change, and the button font size changes. Lots of work ahead in tweaking it all.

@1:45 AM

- Got it working even more ... scaffold and backgrounds all swap out. WOOT !!!

> 2020-09-29 [mobile]

Got login screen prettied back up.

  - Adjusted button fonts.
  - Added input padding (and letting other padding default back to EdgeInset defaults).
  - Themes are tedious.

Before logging off, noticed reference name wasn't showing up, although I know I'd seen it populated.

  - Determined the value was being cleared out by having an initializer at the top of the provider file.

> 2020-09-30 [mobile]

After working and thinking through my dilemma of the reference name being cleared out on the Preferences screen, it turns out I was only populating the `_localUserInfo` object with the `nameRef` setting on login. It wasn't being repopulated when its provider file was reinitialized, which I learned can occur quite often. 

However, in the process of finding this oversight, I came across an even more perplexing issue. Just as the `Prefs()` provider class can be reinitialized at any time, as I found with the missing `nameRef` setting, as can the `Auth()` class, and its `_localUserInfo` object. This meant `isDark` was being cleared out with each reinitialization just like `nameRef` was.

But to avoid `isDark` from being cleared out, if we __don't__ initialize the Auth() class until later (like in the `_tryAutoLogin` router call, which is where `_localUserInfo` is populated), that means that the initial `isDark` getter call for the app's theme has nothing to work with (i.e., the `_localUserInfo` object is `null` when called from the `theme:` property). 

It was all quite perplexing, especially when trying to determine how, or even if, the `ChangeNotifierProvider` or `ChangeNotiferProxyProvider` components are involved, and if so, how?

@6:50 PM - Revelation: should `isDark` be just a "logged in" user setting? I hadn't thought about its actual usage, as I'm still figuring out and learning syntax and Flutter flows.

  - For starters, it's currently being set based on what's in `Auth._localUserInfo`.
  - Secondly, that information is populated during the `tryAutoLogin()` call in the `routes` property.

Thinking through this new perspective, I coded in what I figured to be the right setup, and everything seemed to work. As it sometimes happens, the result was fairly close to what I already had, but now armed with an understanding of why it wasn't working, I was able to make the one or two minor tweaks necessary to meet the new understanding of the expectations.

Business logic decision: The `isDark` logic is already in place for "logged in" users---ergo, logged in users will have the dark mode option.

  - `Auth` is initialized from the `ChangeNotifierProvider`, and `isDark` will default to `false`, initially, in every case.
  - `tryAutoLogin()` will attempt to restore the proper `isDark` based on `_localUserInfo` stored in the device's Shared Preferences.
  - The "One moment..." screen should be the only screen that has no dark mode, as that screen shows while the app asynchronously goes and grabs the `isDark` setting. That in mind, I may consider darkening the "One moment..." screen, as I believe, given the two scenarios, it is better to initially assume a dark mode.

Snippets of the resulting successful code with an understanding: `isDark` is a getter with Auth-based dependencies:

[main.dart]
```
  MultiProvider( providers: [ ChangeNotifierProvider.value( value: Auth() // Nothing fancy here.
  ...
  theme: _showTheme(
    themeModel,
    // authProvider.isDark,                            // Incorrect
    authProvider.isAuth ? authProvider.isDark : false, // FIXED !!!
  )
  home: authProvider.isAuth
    ? PreferencesScreen()
    : buildFutureBuilder(context, authProvider),
```

> 2020-10-01, -02 [_]

Inadvertently spent two days on other life stuff ... with more life stuff coming up on Sun and Mon 10/04-05.
