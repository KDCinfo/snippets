export default {

    // mutations: {                                                     // MUTATORS - Are always Synchronous

    setUserName(state, payload) {
        state.userName = payload
    },
    setLoggedIn(state, payload) {
        state.loggedIn = payload
    },
    setNumberOfWins(state, payload) {
        state.numberOfWins = payload
    },
    setScore(state, payload) {
        state.score = payload
    },
    updateScore(state, payload) {
        let score = payload.score,
            currentScore = payload.currentScore
        state.score = parseInt(score) + parseInt(currentScore)
    },
    setMaxScore(state, payload) {
        state.maxScore = payload
    },
    setMaxScoreTop(state, payload) {
        state.maxScoreTop = payload
    },
    changeShowEmptyTiles(state, payload) {
        state.showEmptyTiles = payload
    },
    setLettersInWord(state, payload) {
        state.lettersInWord = payload
    },
    padLettersCorrect(state, payload) {
        let thisWordCount = payload
        for (let cCnt = 0; cCnt < thisWordCount; cCnt++) {
            state.lettersCorrect.splice(cCnt, 1, ' ')
        }
    },
    setModal(state, payload) {
        let whichModal = payload.whichModal,
            fieldVal = payload.showIt
        state[whichModal] = fieldVal
    },
    setModalWinBack(state, payload) {
        // state.showModalWinBack = payload
        Vue.set(state.showModalWinBack, 'bkgd', payload)
    },
    setNumberOfWins(state, payload) {
        state.numberOfWins = payload
    },
    setAlphabet(state, payload) {
        if (state.alphabetlist.length == 0) {
            state.alphabetlist.push.apply(state.alphabetlist, payload)  // Using [.push] will trigger the state change for Vue
                                                                        // (assignments['willnot'] = 'trigger a state change')
        }
    },
    setImage(state, payload) {
        let whichField = payload.whichField,
            fieldVal = payload.fieldVal
        state[whichField] = fieldVal
    },
    registerGuessY(state, payload) {
        let letterGuessed = payload.letterGuessed,
            letterPostions = payload.positions,
            evenCount = (state.lettersCorrect.length - 1)

        for (let letterIndex of letterPostions) {

            let lettersCorrectLength = state.lettersCorrect.length
                // This was this missing piece of the puzzle.
                // Splicing WAS affecting the length of the array, but the setter was being set above; outside the 'for' loop

            /*
                // Below were my attempts to visualize this loop through and how I'd need to handle array inserts/overwrites

                Idx Existing.Array.Len

                0   0 (nothing)     // INSERT
                1   0               // Array[0] = empty; Array[1] = letter
                2   0               // Array[0] = empty; Array[1] = empty; Array[2] = letter

                0   1               // Cannot be (using 'evenCount', these would be even)
                1   1               // Array[0] ['.', 'e']; INSERT
                2   1               //

                state.lettersCorrect === []
                state.lettersCorrect === [j]
                state.lettersCorrect === [.e]
                state.lettersCorrect === [..ll]
                state.lettersCorrect === [.ell]
                state.lettersCorrect === [....y]
                state.lettersCorrect === [.e..y]
            */

            if (letterIndex >= lettersCorrectLength) {                      // ... ... ... If the current 'Correct Letters list' Array is less than the index being provided,

                for (let cCnt = lettersCorrectLength; cCnt < letterIndex; cCnt++) {
                    // If we're inserting, we'll want to insert empty boxes '.' for unused entries
                        // (although ending boxes will still not show...)
                        // @TODO: Could be a complexity option:
                            // 1. Show all empty letters (gives away the length of word),
                            // 2. Show empty non-trailing letters (will show any letters not guess 'in between' guessed letter, but not if they are at the end of the word),
                            // 3. Don't show empty letters at all
                    state.lettersCorrect.splice(cCnt, 0, ' ')               // ... ... ... Add spaces ' ' until the next letter is found
                }
                state.lettersCorrect.splice(letterIndex, 0, letterGuessed)  // ... ... ... then we need to 'insert' the splices

            } else {

                state.lettersCorrect.splice(letterIndex, 1, letterGuessed)  // ... ... ... otherwise, we need to 'overwrite' the existing slot (index, key, w/e...)
            }
        }
    },
    registerGuessN(state, payload) {
        state.lettersIncorrect.push(payload)
    },
    removeLetter(state, payload) {
        let index = state.alphabetlist.indexOf(payload)
        if (index > -1) {
            state.alphabetlist.splice(index, 1)
        }
    },
    updateProgress(state, payload) {
        state.progress = payload                    // 0 = Game complete, 1 = In play (from [store.js])
    },
    resetLettersIncorrect(state, payload) {
        // state.lettersIncorrect.length = 0        // This empties the arrays, but doesn't clear the tiles from the screen
        while(state.lettersIncorrect.length > 0) {
            state.lettersIncorrect.pop()
        }
    },
    resetLettersCorrect(state, payload) {
        while(state.lettersCorrect.length > 0) {
            state.lettersCorrect.pop()
        }
    },
    resetAlphabetlist(state, payload) {
        state.alphabetlist.length = 0               // This 'array emptying' assignment is fine because we dispatch 'setAlphabet' (above) after the resets are done, which repopulates the alphabet array
    },
    resetNoIarray(state, payload) {

        const myTempArray = [...Array(state.NoI).keys()].fill('.')
        state.NoIarray = new Map( myTempArray.entries() )
        // state.NoIarray = new Map( [ [...Array(state.NoI).keys()].fill('.') ] )
    },
    adjustNoIarray(state, payload) {
        // state.NoIarray.splice(payload, 1, '-')   // Both of these options were overridden with the '.delete()' approach
        // state.NoIarray.set(payload, '-')         // (took forever to figure out how to get this to work, and I still don't fully understand the magic part)

        state.NoIarray.delete(payload)              // Delete the selected letter from the 'Numbers of Incorrect' Map
    },
    setDisableButton(state, payload) {
        state.disableButton = payload
    },
    registerUser(state, payload) {
        // state.users.registered = true
        // state.registrations.push( userObj )

        const date = new Date
        const user = state.users.find( user => (user.id == payload.id) )
        user.registered = true

        // this.$store.state.registrations.push( { userId: user.id, name: user.name, date: date.getMonth() + '/' + date.getDay() } )

        const registration = {
            userId: payload.id,
            name: payload.name,
            date: date.getMonth() + '/' + date.getDay()
        }
        state.registrations.push(registration)
    },
    unRegisterUser(state, payload) {
        const user = state.users.find( user => (user.id == payload.id) )
        user.registered = false

        // this.$store.state.registrations.splice(this.$store.state.registrations.indexOf(registration), 1)
        state.registrations.splice(state.registrations.indexOf(payload), 1)
    }
}