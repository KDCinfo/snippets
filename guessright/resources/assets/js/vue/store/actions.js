export default {

    // actions: {                                                       // ACTIONS - Before you actually 'commit' to a mutation

    getUserName(storeStuff) {
        axios.get('api/getUserName').then( response => {
            if (response.data.userName.length > 0) {
                storeStuff.commit('setUserName', response.data.userName)
            }
            if (response.data.numberOfWins > 0) {
                storeStuff.commit('setNumberOfWins', response.data.numberOfWins)
            }
            if (response.data.score > 0) {
                storeStuff.commit('setScore', response.data.score)
            }
            if (response.data.maxScore > 0) {
                storeStuff.commit('setMaxScore', response.data.maxScore)
            }
        })
    },
    getLoggedIn(storeStuff) {
        axios.get('api/getLoggedIn').then( response => {
            storeStuff.commit('setLoggedIn', response.data)
        })
    },
    getRandomHint(storeStuff) {
        let greeting = storeStuff.getters.getHintGreet
        let grandom = Math.floor(Math.random()*greeting.length)
        return greeting[grandom]
    },
    setImage(storeStuff, payload) {
        storeStuff.commit('setImage', payload)
    },
    setImages(storeStuff) {                                             // To be run on 'Game Load' and 'Game Reset'
        axios.get('api/getImages')
            .then(
                response => {

                    // Set Image Won

                        // Set Frame

                            let imageFrame = response.data.imageFrameWon[0]

                            storeStuff.dispatch('setImage', { whichField: 'imageFrame', fieldVal: imageFrame })

                        // Set Random Won Image

                            let imageListWon = response.data.imageListWon // Array of images: { "imageListWon": [ "(...).jpg", "(...).jpg" ] }

                            let imageWon = imageListWon[ Math.floor(Math.random() * imageListWon.length) ]

                            storeStuff.dispatch('setImage', { whichField: 'imageWon', fieldVal: imageWon })

                    // Set Image Lost

                        // Set Random Lost Image

                            let imageListLost = response.data.imageListLost // Array of images: { "imageListLost": [ "(...).jpg", "(...).jpg" ] }

                            let imageLost = imageListLost[ Math.floor(Math.random() * imageListLost.length) ]

                            storeStuff.dispatch('setImage', { whichField: 'imageLost', fieldVal: imageLost })
                }
            )
    },
    setModal(storeStuff, payload) {
        storeStuff.commit('setModal', payload)
    },
    setAllModalsOff(storeStuff) {                                       // Called from 'close' button in [Modal.vue]
        Object.entries(storeStuff.state).forEach(([key, value]) => {    // Cycle through each 'state' property

            let isModalName = key.indexOf('showModal') === 0,           // If property begins with 'showModal'
                isModalOn = value === true                              // And its property is set to <true>

            if (isModalName && isModalOn) {                             // ...Then turn it off

                storeStuff.dispatch( 'setModal', { whichModal: key, showIt: false } )

            }
        });
    },
    setModalWinBack(storeStuff, payload) {
        storeStuff.commit('setModalWinBack', payload)
    },
    setWord(storeStuff, payload) {
        axios.post('api/getWord', {
            lettersCorrectLength: storeStuff.state.lettersCorrect.filter( thisLetter => thisLetter.indexOf(' ') === -1 ).length
        }).then( (response) => {
            if (storeStuff.getters.getShowEmptyTiles) {
                storeStuff.dispatch('getLetterCount').then( (thisWordCount) => {
                    storeStuff.commit('setLettersInWord', thisWordCount)
                    storeStuff.commit('padLettersCorrect', thisWordCount)
                })
            } else {
                storeStuff.commit('setLettersInWord', 0)
            }
        })
    },
    setAlphabet(storeStuff, payload) {
        if (storeStuff.state.alphabetlist.length == 0) {
            axios.get('api/getAlphabet')
                .then(
                    response => {
                        storeStuff.commit('setAlphabet', response.data)
                        storeStuff.dispatch('setWord')
                    }
                )
        }
    },
    checkWon(storeStuff) {

        axios.post('api/areCorrectLettersMaxed', {
            lettersCorrectLength: storeStuff.state.lettersCorrect.filter( thisLetter => thisLetter.indexOf(' ') === -1 ).length
        })
            .then( response => {

                let stillInProgress = (response.data.areCorrectLettersMaxed) ? 0 : 1
                                                                            // stillInProgress == 0 // Game Won (all letters in word guessed)
                                                                            // stillInProgress == 1 // Check for Loss

                if (!stillInProgress) {                                     // Letters guessed === Letters in Word => Game is over. You won!

                    storeStuff.dispatch('updateProgress', 0)                // Progress: 1 = In play, 0 = Game complete

                    storeStuff.dispatch('updateScore')
                                                                            // Give random background-image
                                                                            // document.querySelector(".A").style.backgroundImage="url('2.jpg')";
                    storeStuff.dispatch('setModal', { whichModal: 'showModalWin', showIt: true })

                } else {                                                    // Not won; Check if lost

                                                                            // Don't check for actual word length until ... (Incorrectly guessed letters === NoI)

                    if (storeStuff.getters.getLettersIncorrect.length == storeStuff.getters.getNoI) {

                                                                            // Game Lost

                        storeStuff.dispatch('getLetterCount').then( (thisWordCount) => {

                            storeStuff.dispatch('updateProgress', 0)        // Progress: 1 = In play, 0 = Game complete

                            storeStuff.dispatch('updateScore', thisWordCount)

                        })

                    }
                }
            })
    },
    getLetterCount(storeStuff) {                                            // API call to get count of letters in word (only if game is over and lost)
        return axios.get('api/getLetterCount').then( response => {
            return response.data.letterCount
        })
    },
    updateProgress(storeStuff, payload) {                                   // Called from: 1) [this file]checkWon 2) [this file]resetWrapper
        return storeStuff.commit('updateProgress', payload)
    },
    setNumberOfWins(storeStuff) {
        if (storeStuff.state.progress == 0) {                               // Cannot increase wins unless game is over
            let nOW = storeStuff.state.numberOfWins
            storeStuff.commit('setNumberOfWins', (nOW + 1))
        }
    },
    alertConfirm(storeStuff) {
        return confirm('This will reset your current game. Proceed?')
    },
    changeShowEmptyTiles(storeStuff, payload) {
        storeStuff.commit('changeShowEmptyTiles', payload)
        storeStuff.dispatch('resetWrapper')
    },
    updateScore(storeStuff, payload) {

        let showEmptyTiles = storeStuff.getters.getShowEmptyTiles,
            complexity = showEmptyTiles ? 1 : 1.5

        let params = payload,                                               // This action is called only if you Won or Lost
            isWon = typeof(params) === 'undefined',                         // 'You Won' doesn't pass a variable; Only 'Try Again' (i.e., 'You Lost')
                                                                            // The letter/number variable names are from a spreadsheet where the scoring was calculated
            I47 = storeStuff.getters.getLettersCorrect.length,              // LettersCorrect
            H47 = (isWon) ? I47 : params,                                   //      If won: letters in word === letters guessed
                                                                            //      If lost: use passed in 'payload'
            K47 = storeStuff.getters.getLettersIncorrect.length,            // LettersIncorrect
            J47 = storeStuff.getters.getNoI                                 // NoI

                                                                            // SCORING FORMULA
        let gRcalc = 3,
            N47 = I47 / H47,                                                // {Guessed Correct} / {Letter Count}
            P47 = 1 - ( K47 / J47 ),                                        // {Guessed Incorrect} / {Max Incorrect}
            S47 = N47 + P47,                                                // Combine those two
            T47 = Math.sqrt( H47 * J47 ),                                   // {Letter Count} * {Max Incorrect}
            rawScoreTemp = ( S47 * T47 ) * gRcalc,
            rawScore = rawScoreTemp * complexity

        let scoreRound = (number, precision) => {
            let factor = Math.pow(10, precision),
                tempNumber = number * factor,
                roundedTempNumber = Math.round(tempNumber)
            return roundedTempNumber / factor
        }
        let roundedScore = scoreRound(rawScore, 0)

        axios.post('api/postScore', {
            score: roundedScore,
            correct: storeStuff.getters.getLettersCorrect.length,
            incorrect: storeStuff.getters.getLettersIncorrect.length,
            win: isWon ? 1 : 0
        })
            .then(
                response => {
                    let responseObj = response.data

                    // if ( responseObj.status === 'Success' ) // msg : "Score updated successfully."

                    storeStuff.commit('updateScore', { score: roundedScore, currentScore: storeStuff.getters.getScore })

                    storeStuff.commit('setMaxScore', responseObj.maxScore)
                    if (responseObj.maxScoreTop) {
                        storeStuff.commit('setMaxScoreTop', true)
                    }

                    if (isWon) {                                // [checkWon] said you won, so no params passed
                        storeStuff.dispatch('setNumberOfWins')  // Increase Wins by 1
                    }
                })
    },

    resetLettersIncorrect(storeStuff, payload) {
        return storeStuff.commit('resetLettersIncorrect')
    },
    resetLettersCorrect(storeStuff, payload) {
        return storeStuff.commit('resetLettersCorrect')
    },
    resetAlphabetlist(storeStuff, payload) {
        return storeStuff.commit('resetAlphabetlist')
    },
    resetProgress(storeStuff, payload) {
        return storeStuff.commit('resetProgress')
    },
    resetNoIarray(storeStuff, payload) {
        return storeStuff.commit('resetNoIarray')
    },
    adjustNoIarray(storeStuff, payload) {
        return storeStuff.commit('adjustNoIarray', payload)
    },
    setDisableButton(storeStuff, payload) {
        return storeStuff.commit('setDisableButton', payload)
    },
    resetWrapper(storeStuff, payload) {
        let event = payload

        if (event) {
            event.target.blur()                                         // This will remove the 'active' CSS class assigned to a Bootstrap button on click
        }

        storeStuff.dispatch('resetGame').then(() => {                   // Resets all the base [Arrays].length to 0
            storeStuff.dispatch('setAllModalsOff')
            storeStuff.dispatch('setAlphabet')
            // storeStuff.dispatch('setWord')                           // [setWord] is being called from inside the [Alphabet] action
            storeStuff.dispatch('updateProgress', 1)                    // Set game progress to 1 (1 = game in play; 0 = game over)
            storeStuff.dispatch('resetNoIarray')
            storeStuff.dispatch('removeAnimShowImage')                  // This will remove the 'anim' class from all the 'divContent' DIVs
            storeStuff.commit('setMaxScoreTop', false)
        })

        // if (this.$store.getters.isModalOpen) // @TODO - Set and test for new property: isModalOpen
        if (!storeStuff.getters.getShowModalWin) {

            setTimeout( () => {
                storeStuff.dispatch('setImages')
            }, 1500)                                                    // @TODO - Set new property for fadeout time and share these durations.
                                                                        // This Ajax call takes <1 second. The modal fadeouts take 2-3 seconds.
                                                                        // If modal is open, must wait until they're done.
                                                                        // If it is, let modal set new images
        }
    },
    resetGame({dispatch}, payload) {                                    // {dispatch} is one of the properties in the 1st param which is the 'store instance' (a.k.a., 'storeStuff')
        return new Promise((resolve, reject) => {

            return dispatch('resetLettersIncorrect').then(() => {       // Sets all these [Arrays].length to 0
                return dispatch('resetLettersCorrect').then(() => {     // The reason these are nested returns is that all three of these
                    return dispatch('resetAlphabetlist').then(() => {   // are dependencies for resetting other components such as 'setAlphabet' and 'setWord'.
                        resolve()
                    })
                })
            })

        })
    },
    registerGuess(storeStuff, payload) {

        let selectedLetter = payload

        // Basically, if the chosen letter hasn't already been picked (which it shouldn't if the letters are removed from the alphabet as they should be, but...),
            // Return from axios->post('api/checkWord')->session('word') and whether it contains this letter (payload) (y) or not (n)
            // This is a post() because we have to send the chosen letter (payload)

        if ( storeStuff.state.lettersCorrect.includes(selectedLetter) ) {
            // Selected letter has already been selected, and was Correct
        } else if ( storeStuff.state.lettersIncorrect.includes(selectedLetter) ) {
            // Selected letter has already been selected, and was Incorrect
        } else {                                                                    // Check to see if the clicked letter is in the Word.
            axios.post('api/checkWord', {
                guessedLetter: selectedLetter
            })
                .then(
                    response => {
                        let responseObj = response.data,
                            haveWord = responseObj.haveWord,
                            responseArray = responseObj.positions

                        console.log('=============================')

                        if (responseObj.ourword.length > 0) {
                            console.log('ourword', responseObj.ourword)
                        } else {
                            console.log('ourword.length <= 0')
                        }

                        if (!haveWord) {

                            // @TODO: Figure out how to populate the slots in the Modal.vue (for now I'm just going to have 2 modals preset in the [guess-right.vue] instance)

                            storeStuff.dispatch('setModal', { whichModal: 'showModal', showIt: true })

                        } else {

                            if (responseArray.length === 0) {                           // INCORRECT (an empty array was returned)
                                storeStuff.commit('registerGuessN', selectedLetter)     // ... Pass in the Array of indexes

                                // SECTION: PROGRESS VISUAL - GET A RANDOM TILE
                                let mathRandom = Math.random(),                         // This was TRICKY (for me anyways; a full day's worth of trying all kinds of loops and iterators! ) 2017-03
                                    allMyKeys = storeStuff.getters.getNoIarray.keys(),  // This will remove a random key/value pair from the NoIarray Map (set in [store.js] and reset from [guess-right.vue])
                                    myArrayT = Array.from(allMyKeys),                   // Create a temporary array from which to derive a random number.
                                    myNewNum = myArrayT[ Math.floor(mathRandom * myArrayT.length) ]
                                    // What just happened?
                                        // Picked a random myArrayT[Key] and
                                        // Gave me the myArrayT[Val]

                                storeStuff.dispatch('removeAnimShowImage')                                                      // [ProgressVisual.vue] -> Removes class 'anim' from all tiles => '.divContent'

                                document.querySelectorAll('div[name="divContent' + myNewNum + '"]')[0].classList.add("anim")    // [ProgressVisual.vue] -> This adds the 'anim' class so --- YOU CAN SEE 'ONE TILE' ---

                                storeStuff.dispatch('adjustNoIarray', myNewNum)         // [Alphabet.vue] -> This triggers [ errorsMaxed() ] ('triggers' meaning it has an expression watching for this)

                            } else {                                                    // CORRECT! (indexes have been returned)

                                storeStuff.commit('registerGuessY', responseObj)        // ... Pass in the correct letter
                            }

                            storeStuff.commit('removeLetter', selectedLetter)           // Remove letter from alphabet

                            storeStuff.dispatch('checkWon')
                        }

                        storeStuff.dispatch('setDisableButton', false)
                    }
                )
        }
    },
    addAnimShowImage(storeStuff, payload) {

        // This will --- SHOW THE ENTIRE IMAGE --- by adding the 'anim' class to all the 'divContent' DIVs (it is called from [ Alphabet.vue ] when [ errorsMaxed() ] is triggered, after a 1-second setTimeout())

        document.getElementById('divContentCountDown').classList.add('off')
        for (let div of document.getElementsByClassName('divContent')) {    // Add CSS class named 'anim' to all the boxes (Game is Over, show the entire pic)
            div.classList.add('anim-none')
        }
        document.getElementById('divContents').classList.add('anim-whole')  // This applies a 3-second pulse_animation [ProgressVisual.vue] -> [style] [divContents.anim-whole]
        setTimeout( () => {
            document.getElementById('divContentProgressImage').classList.add('on')
        }, 2500)                                                            // Fade this in after the image pulse
    },
    removeAnimShowImage(storeStuff, payload) {

        // This will remove the 'anim' class from all the 'divContent' DIVs

        if (document.getElementById('divContentCountDown') !== null) {
            document.getElementById('divContentProgressImage').classList.remove('on')
            document.getElementById('divContentCountDown').classList.remove('off')
            document.getElementById('divContents').classList.remove('anim-whole')
            for (let div of document.getElementsByClassName('divContent')) { // Remove CSS class named 'anim' from all the boxes (prep for showing next image tile, or the entire image)
                div.classList.remove('anim', 'anim-none')
            }
        }
    },
}