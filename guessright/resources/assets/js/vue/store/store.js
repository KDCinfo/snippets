import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

// @TODO: Make 'complexity option' to randomize the 'Number of Incorrects' (NoI).
    // It will always show 9 tiles, but it could "POP UP!" after 3 wrong, or 5 wrong.
    // You never know when it might POP UP. And because there is always that slight pause
    // before it moves on, it kinda makes you hold your breath a bit, like a Jack-in-the-Box.

const _NoI = 9,
      myTempArray = Array(_NoI).fill('.')                  // Create an array to hold incorrect guesses. E.g., NoI = 9: ['.','.','.','.','.','.','.','.','.']
      // myTempArray = [...Array(_NoI).keys()].fill('.')   // .keys() isn't valid in IE11 (even after installing/importing babel-polyfill)

const _getNoIarrayRemaining = new Map( myTempArray.entries() )

export const store = new Vuex.Store({
    state: {
        alphabetlist: [],
        lettersCorrect: [],
        lettersIncorrect: [],
        lettersInWord: 0,
        NoI: _NoI,                          // Number of Incorrects allowed before game is declared over
        NoIarray: _getNoIarrayRemaining,    // Misnomer - this is now a Map
        progress: 1,                        // Progress: 1 = In play, 0 = Game complete
        showModal: false,
        showModalChangeComplexity: false,
        showModalHints: false,
        showModalWin: false,
        showModalWinBack: { bkgd: 'rgba(0, 0, 0, 0.0) !important'},
        numberOfWins: 0,
        score: 0,
        maxScore: 0,
        maxScoreTop: false,
        showEmptyTiles: false,
        loggedIn: 0,
        disableButton: false,
        imageFrame: '',
        imageWon: '',
        imageLost: '',
        userName: '',
        users: [                            // This is leftover from a course (kept as reference).
            {id: 1, name: 'Max', registered: false},
            {id: 2, name: 'Anna', registered: false},
            {id: 3, name: 'Chris', registered: false},
            {id: 4, name: 'Sven', registered: false},
        ],
        HINTGREET: [
            'Absolutely!',
            'Certainly!',
            'Sure thing!',
            'Would love to!',
            'You bet!',
        ],
        HINTS: [                            // I know this isn't the best place for this, but it's short, so, until it grows...
            'Your correct letters will appear in the order they appear in the word.',
            'Guess Right will play on a phone, but it takes a lot of scrolling. A tablet is the smallest recommended viewing size for this game.',
            'You score when you get letters correct, so you can score even when all your guesses fall short (just not as much as when you win).',
            'No spaces or hyphens were used during the creation of any of these words.',
            'Tips are shown randomly on every page visit.',
            'The \'Tip Greeting\' is randomly selected each page visit.',
            'There are 50 \'You Won\' background images; randomly selected each game.',
            'There are 50 \'Try Again\' background images; randomly selected each game.',
        ],
    },
    getters,
    mutations,
    actions
})

/* --- --- --- --- *
/
/  THE VUEX PATTERN
/
/=> // https://www.youtube.com/playlist?list=PL55RiY5tL51pT0DNJraU93FhMzhXxtDAo
    // Vuex -- Core Concepts (w/ Vue.js 2) https://vuex.vuejs.org/en/state.html
    // Mindspace -- 5 videos - 8,026 views - Last updated on Jan 2, 2017
    // Learn how Vuex can help you manage your Vue.js Application State!

     ,---> (Central) Store
    /                           -> return
    |   Getters
    |                           -> access
    |   [
    |       Parent
    |           Child 1
    |               Child's Child 1
    |           Child 2
    |           Child 3
    |   ]
    |                           -> dispatch
    |   Actions (AJAX/Promises)
    |                           -> commit
    |   Mutations
    |                           -> change state / sync!
    `--------------------<
*/