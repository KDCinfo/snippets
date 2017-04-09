<template>
    <div class="progressUpDownContainer">
        <div class="lettersIncorrect">
            <h3>Slightly Incorrect</span></h3>
        </div>
        <div id="progressDown">
            <div class="lettersIncorrect">
                <button v-for="letter in lettersIncorrect">{{ letter }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            lettersIncorrect() {
                return this.$store.getters.getLettersIncorrect
            },
            incorrectRemaining() {
                return (this.$store.getters.getNoI - this.lettersIncorrect.length)
            },
        },
    }
</script>

<style lang="sass" scoped>
    .lettersIncorrect {
        display: flex;
        flex-wrap: wrap;

        @media (min-width: 1200px) {
            h3 {
                padding-left: 1rem;
            }
        }
        button {
            background-color: antiquewhite;
            border-radius: 1rem;
            font-size: 3rem;
            height: 5rem;
            margin: 0.5rem;
            padding: 0;
            width: 5rem;
        }
    }
</style>