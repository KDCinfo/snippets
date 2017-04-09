export default {
    getLoggedIn(state) {
        return state.loggedIn
    },
    getUserName(state) {
        return state.userName
    },
    getScore(state) {
        return state.score
    },
    getMaxScore(state) {
        return state.maxScore
    },
    getMaxScoreTop(state) {
        return state.maxScoreTop
    },
    getNumberOfWins(state) {
        return state.numberOfWins
    },
    getShowEmptyTiles(state) {
        return state.showEmptyTiles
    },
    getHints(state) {
        return state.HINTS
    },
    getHintGreet(state) {
        return state.HINTGREET
    },
    getProgress(state) {
        return state.progress
    },
    getNoI(state) {
        return state.NoI
    },
    getDisableButton(state) {
        return state.disableButton
    },
    getShowModalChangeComplexity(state) {
        return state.showModalChangeComplexity
    },
    getShowModal(state) {
        return state.showModal
    },
    getShowModalHints(state) {
        return state.showModalHints
    },
    getShowModalWin(state) {
        return state.showModalWin
    },
    getShowModalWinBack(state) {
        return state.showModalWinBack.bkgd
    },
    getAlphabet(state) {
        return state.alphabetlist
    },
    getImageFrame(state) {
        return state.imageFrame
    },
    getImageWon(state) {
        return state.imageWon
    },
    getImageLost(state) {
        return state.imageLost
    },
    getLettersIncorrect(state) {
        return state.lettersIncorrect
    },
    getLettersCorrect(state) {
        return state.lettersCorrect
    },
    getLettersInWord(state) {
        return state.lettersInWord
    },
    getNoIarray(state) {
        return state.NoIarray
    },
}