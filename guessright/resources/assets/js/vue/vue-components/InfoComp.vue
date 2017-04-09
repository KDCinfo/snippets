<template id="infoComp-template">
    <div id="infocomp">
        <h3>Stats for {{userName}}</h3>
        <div class="infocompItems">
            <p>Number of Wins: <span v-text="showNumberOfWins"></span></p>
            <p>Today's Score: <span v-text="showScore"></span></p>
            <p v-if="loggedIn">All-Time Max Score: <span v-text="showMaxScore"></span></p>
            <p v-if="loggedIn && maxScoreTop" class="new-high-score">New High Score!</p>
            <p v-if="!loggedIn">Tip: You can <a href="register">Create an Account</a> to save your scores.</p>
        </div>
        <h3>Difficulty</h3>
        <div class="infocompItems">
            <p><label>Show all empty letters?</label>&nbsp;<input type="checkbox" id="showAllTiles" @change="changeShowEmptyTiles" :checked="showEmptyTiles"></p>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            showEmptyTiles() {
                return this.$store.getters.getShowEmptyTiles
            },
            loggedIn() {
                return this.$store.getters.getLoggedIn
            },
            userName() {
                return this.$store.getters.getUserName
            },
            showMaxScore() {
                return this.$store.getters.getMaxScore
            },
            showScore() {
                return this.$store.getters.getScore
            },
            showNumberOfWins() {
                return this.$store.getters.getNumberOfWins
            },
            maxScoreTop() {
                return this.$store.getters.getMaxScoreTop
            }
        },
        methods: {
            changeShowEmptyTiles(evt) {

                // evt.target.checked = !evt.target.checked

                console.log('InfoComp -> methods above -> ', evt.target.checked)

                this.$store.dispatch('setModal', { whichModal: 'showModalChangeComplexity', showIt: true })
                    .then( () => {
                        evt.target.checked = this.$store.getters.getShowEmptyTiles
                        console.log('InfoComp -> methods inside -> ', evt.target.checked, this.$store.getters.getShowEmptyTiles)
                    })

                console.log('InfoComp -> methods below -> ', evt.target.checked)

                // this.$store.dispatch('alertConfirm').then( (val) => {
                //     if (val) {
                //         this.$store.dispatch('changeShowEmptyTiles', evt.target.checked)
                //     } else {
                //         evt.target.checked = false
                //     }
                // })
            }
        },
        beforeCreate() {
            this.$store.dispatch('getUserName')         // This gets the [user name], [max score], and the [current day's score]
        },
    }

    /*  SCORING FORMULA
        --------------------------------------------------
        const GRcalc = 3

        H47     {Letter Count}      // getLetterCount()
        J47     {Max Incorrect}     // NoI
        I47     {Guessed Correct}   // LettersCorrect
        K47     {Guessed Incorrect} // LettersIncorrect

        N47 = {Guessed Correct} / {Letter Count}
        P47 = 1 - ( {Guessed Incorrect} / {Max Incorrect} )

            S47 = =SUM( N47 + P47 )

            T47 = SQRT( {Letter Count} * {Max Incorrect} )

                    =( S47 * T47 ) * GRcalc
        --------------------------------------------------
            H47 = Letter Count
            J47 = Max Incorrect

                    T47 = =SQRT(H47*J47)*GRpower

            I47 = Guessed Correct
            H47 = Letter Count
                N47 = =I47/H47

            K47 = Guessed Incorrect
            J47 = Max Incorrect
                P47 = =1-(K47/J47)

                    S47 = =SUM(N47+P47)

                        =(S47*T47)*GRcalc
        --------------------------------------------------
    */
</script>

<style lang="sass" scoped>
    #infocomp {
        margin-top: 1rem;
        text-align: center;
        width: 25rem;

        .all-yours {
            margin: 0;
            padding: 0;
        }
        .infocompItems {
            display: flex;
            flex-flow: column wrap;
            justify-content: space-between;

            /* background-color: lightcyan; */
            border: 1px solid lightblue;
                border-radius: 0.5rem;
            height: 100%;
            margin: 1rem;
            padding: 2.5rem;
            box-shadow: 0.5rem 0.5rem 1rem 0 lightgrey inset;

            label {
                font-weight: normal;
            }
        }
        .new-high-score {
            color: blue;
            font-size: 20px;
            font-weight: bold;
            padding: 1rem 0 0;
        }
    }
</style>