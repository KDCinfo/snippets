                                    // webpack was installed via: sudo npm install webpack@2.2.1 --save-dev
import Vue from 'vue'               // Vue: Installed via -> sudo npm install vue@2.1.10 --save-dev

import axios from 'axios'           // axios@0.15.3
import VueRouter from 'vue-router'  // vue-router@2.2.1

    Vue.use(VueRouter)

    window.Vue = Vue

    window.axios = axios
    window.axios.defaults.headers.common = {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        'X-Requested-With': 'XMLHttpRequest'
    }


// GLOBAL VARS

    const IS_GR = windowLocation.indexOf('guessright') >= 0    // This is my 1st Vue project: Trying to keep it modular.

    window.gr = {}

    window.gr.addEvent = function(object, type, callback) {     // Used for resize listener in [progressVisual]
        if (object == null || typeof(object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on"+type] = callback;
        }
    }

    window.gr.indexInClass = function(collection, node) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i] === node) {
                return i;
            }
        }
        return -1;
    }

    if (window.addEventListener) {
        window.gr.resizestart = function(event) {
            let _someElement = document.getElementsByClassName('divContent')
            for (let div of _someElement) {             // Add CSS class named 'notransition' to all the boxes during resize so they don't animate, showing the image behind them.
                div.classList.add('notransition')       // Disable transitions
            }
        }
        window.gr.resizeend = function(event) {
            let _someElement = document.getElementsByClassName('divContent')
            for (let div of _someElement) {             // Add CSS class named 'notransition' to all the boxes during resize so they don't animate, showing the image behind them.
                // console.log(div, div[0])
                div.offsetHeight                        // Trigger a reflow, flushing the CSS changes
                div.classList.remove('notransition')    // Re-enable transitions
            }
        }
    }


// ROUTING

    const currentApp = []
    if (IS_GR) {
        // currentApp['appLoad'] = 'guess-right-load.vue'   // (not currently used)
        currentApp['appIntro'] = 'guess-right-intro.vue'    // Intro
        currentApp['appContext'] = '/guess'                 // App (path and project)
            currentApp['appPath'] = 'guess-right.vue'
        currentApp['appAbout'] = 'guess-right-about.vue'    // About
    }


    // // // // // // // // // // // // // // // // // // // //
    //
    // GENERIC CODE
    //
    //

    window.currentApp = currentApp

    const routeIntro = require('./vue-components/' + currentApp['appIntro'])    // Intro
    const routeApp = require('./vue-components/' + currentApp['appPath'])       // App
    const routeAbout = require('./vue-components/' + currentApp['appAbout'])    // About

    const routes = [
        { path: '/', component: routeIntro },
        { path: currentApp['appContext'], component: routeApp },
        { path: '/about', component: routeAbout }
    ]

    const router = new VueRouter({                                  // The 'router' is added to the Vue instance in: [ vue-guess-right.js ]
        // mode: 'history', // Uncomment to remove # from URL
        routes: routes,
        linkActiveClass: 'active',
    })
        window.router = router

import {store} from './store/store'

new Vue({
    el: "#myApp",
    store,
    router,     // ES2015 shorthand
    // router: router, // Long form
})


document.addEventListener("DOMContentLoaded", () => {

    const alertSuccess = document.getElementsByClassName('alert-success'),
          msgSuccess = alertSuccess[0].textContent.trim()

    const alertError = document.getElementsByClassName('alert-danger'),
          msgError = alertError[0].textContent.trim()

    const errorFieldColor = 'f2dede';

    if (msgSuccess.length > 0) {
        alertSuccess[0].classList.add("max-height-100");
        // alertSuccess.classList.remove("max-height-100");
    }

    if (msgError.length > 0) {
        alertError[0].classList.add("max-height-100");
        // alertError.classList.remove("max-height-100");

        var errorArray = msgError.split('[')

        for (var i = 1; i < errorArray.length; i++) {
            var errorArraySub = errorArray[i].trim().split(']')
            var errorField = errorArraySub[0].replace(/ /g, '_')

            $('[name="' + errorField + '"]').css({'background-color': '#' + errorFieldColor})
        }
    }
})
