<template>
    <div id="alphabet">
        <h3>Pick a Letter</h3>
        <div class="alphabetlist">
            <button :disabled="errorsMaxed || correctMaxed || isHot" @click="registerGuess(letter)" v-for="letter in alphabetlist">{{ letter }}</button>
        </div>
    </div>
</template>

<script>

    export default {
        methods: {
            registerGuess(letter) {
                this.$store.dispatch('setDisableButton', true) // This is re-enabled in the 'registerGuess' action in the Ajax response
                this.$store.dispatch('registerGuess', letter)
            },
        },
        beforeCreate() {
            this.$store.dispatch('setAlphabet')
        },
        computed: {
            alphabetlist() {
                return this.$store.getters.getAlphabet
            },
            isHot() {
                return this.$store.getters.getDisableButton
            },
            correctMaxed() {
                return (this.$store.getters.getProgress === 1) ? false : true
            },
            errorsMaxed() {

                if (this.$store.getters.getLettersIncorrect.length >= this.$store.getters.getNoI) {     // Error letters maxed - Game Lost
                    window.gr.resizestart()
                    this.$store.dispatch('removeAnimShowImage')                                         // Remove 'anim' class from all tiles
                    setTimeout( () => {
                        this.$store.dispatch('addAnimShowImage')                                        // Show entire image and pulse it
                        window.gr.resizeend()
                    }, 1250)
                }
                return (this.$store.getters.getLettersIncorrect.length >= this.$store.getters.getNoI)   // True = Game over (lost); False = Still in progress
            },
        },
    }
</script>

<style lang="sass" scoped>
    #alphabet {
        text-align: center;
    }
    .alphabetlist {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;

        background-color: lightcyan;
        border: 1px solid lightblue;
            border-radius: 1rem;
        height: 100%;
        margin: 0.2rem;
        padding: 0.5rem;
        box-shadow: 0.5rem 0.5rem 1rem 0 lightgrey inset;

        button {
            background-color: mediumturquoise; /* other options: darkcyan mediumturquoise mediumseagreen powderblue */
            border-radius: 1rem;
            font-size: 3rem;
            height: 5rem;
            margin: 0.5rem;
            padding: 0;
            width: 5rem;
        }
    }
    .alphabetlist button:hover {
        opacity: 0.8;
    }
    .alphabetlist button:focus {
        border-color: #777777;
        outline: 0 !important;
    }
    .alphabetlist button:disabled,
    .alphabetlist button[disabled] {
        color: #444444;
        opacity: 0.85;
    }
    h3 { /* This is an override from [ gr-app.scss ] */
        font-family: cursive;
        font-size: 2.25rem;
    }
</style>