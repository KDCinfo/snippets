<template>
    <div class="progressUpDownContainer">
        <div class="lettersCorrect">
            <h3>Word to Guess</h3>
        </div>
        <div id="progressUp">
            <div class="lettersCorrect">
                <button :class="{ 'anim-shake': (lettersCorrectArray[index].trim() === letter) }" :data-index="'letteridx'+index" v-for="(letter, index) in lettersCorrect">
                    {{ letter }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                'lettersCorrectArray': this.$store.getters.getLettersCorrect
                // Per the [:class] binding in the <button> tag above
                    // --> Adding 'anim-shake' class to any tile in the [getLettersCorrect] array
                    // (previously selected tiles that already have the class will not re-animate)
            }
        },
        methods: {
            rotateLetter: function () {
                // window.gr.addEvent(animButtons, 'hover',  function(e) {
                    // window.gr.addEvent = function(object, type, callback) {
                    // let thus = e.targetName

                    // let a = Math.floor(Math.random()) * 10 - 5
                    // console.log('Random: ', a )
                    // this.style.transform = 'rotate(' + a + 'deg) scale(1.25)'

                // }, function() {
                    // this.style.transform = 'none'
                // });
            }
        },
        computed: {
            lettersCorrect() {
                return this.$store.getters.getLettersCorrect
            },
        },
    }
    // document.querySelector("button[data-index='letteridx4']").classList.remove('anim-shake')
    // document.querySelector("button[data-index='letteridx4']").classList.add('anim-shake')
</script>

<style lang="sass" scoped>
    .lettersCorrect {
        display: flex;
        flex-wrap: wrap;

        @media (min-width: 1200px) {
            h3 {
                padding-left: 1rem;
            }
        }
        button {
            background-color: palegreen;
            border-radius: 1rem;
            font-size: 3rem;
            height: 5rem;
            margin: 0.5rem;
            padding: 0;
            width: 5rem;
        }
    }
</style>