<template>
    <div id="progressVisual">
        <div class="prgressVisualFrame">
            <div id="divContents" v-bind:style="{ 'background-image': (imageLost.length > 0) ? 'url(./public/img/guess-right/lost/' + imageLost + ')' : '' }">

                <div name="divContent0" class="divContent"></div> <div name="divContent1" class="divContent"></div> <div name="divContent2" class="divContent"></div>

                <div name="divContent3" class="divContent"></div> <div name="divContent4" class="divContent"></div> <div name="divContent5" class="divContent"></div>

                <div name="divContent6" class="divContent"></div> <div name="divContent7" class="divContent"></div> <div name="divContent8" class="divContent"></div>

            </div>
            <div id="divContentCountDown">{{ lettersIncorrectRemaining }}</div>
            <div id="divContentProgressImage">
                <div>
                    <button class="btn btn-primary btn-lg" @click.prevent="resetGame($event)">Play Again</button>
                    <p>...for a chance to see the prettier photos. <code>;)</code></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // _someElement.addClass('notransition'); // Disable transitions
    // doWhateverCssChangesYouWant(_someElement);
    // _someElement[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
    // _someElement.removeClass('notransition'); // Re-enable transitions

    export default {
        computed: {
            imageLost() {                                                           // The <v-bind> in the #divContents tag will provide an initially empty background-image to surpress the 404 errors which are present
                return this.$store.getters.getImageLost                             // prior to the Images being set via an Ajax call via the 'setImages' action called from [guess-right.vue] in the beforeCreate() hook.
            },
            lettersIncorrect() {
                return this.$store.getters.getLettersIncorrect                      // lettersIncorrect: [ "e", "b", "v", "w", "x", "y", "z", "r" ]
            },
            totalNoI() {
                return this.$store.getters.getNoI
            },
            incorrectRemaining() {
                return (this.$store.getters.getNoI - this.lettersIncorrect.length)  // This is used as a basis for 'lettersIncorrectRemaining()'
                // (if letters weren't disabled, this would go in to the negatives. This was created before the Alphabet 'disabling' functionality)
            },
            lettersIncorrectRemaining() {
                return (this.incorrectRemaining > 0) ? this.incorrectRemaining : 0  // This one will not go into the negatives, and will stop at zero.
            },
        },
        methods: {
            resetGame(event) {
                this.$store.dispatch('resetWrapper', event)
            },
        },
        mounted() {
            // Thanks to: Neaox @ http://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-ac
            (function() {
                let d = 250, t = null, e = null, h, r = false

                h = function () {
                    r = false
                    window.gr.resizeend(e)
                };

                window.gr.addEvent(window, "resize", function(event) { // [addEvent] added in [vue-config.js] and implements: window.addEventListener('resize', function (event) {
                    e = event || e
                    clearTimeout(t)

                    if (!r) {
                        console.log('Resize Starting...')
                        window.gr.resizestart(e)
                        r = true
                    }

                    t = setTimeout(h, d)
                })
            }())
        }
    }
</script>

<style lang="sass" scoped>
    $NoI: 9;

    /* [.notransition] approach thanks to Mark Amery @ http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily */
        .notransition {
            transition: none !important;
        }

    @mixin set-dimensions($heightWidth) {

        $heightWidthPx: #{$heightWidth}px;

        #divContentProgressImage {
            height: #{$heightWidth}px;
            width: #{$heightWidth}px;
        }
        #divContentCountDown {
            height: #{$heightWidth}px;
            width: #{$heightWidth}px;
            font-size: #{$heightWidth/10}rem;
            line-height: #{$heightWidth/10}rem;
        }
        #divContents {
            /* background-image: url(//lorempixel.com/#{$heightWidth}/#{$heightWidth}/cats/2/); */
            height: #{$heightWidth}px;
            width: #{$heightWidth}px;
        }
        #divContents > div {
            height: #{$heightWidth / ( $NoI / 3 )}px;
            width: #{$heightWidth / ( $NoI / 3 )}px;
        }
    }
        @media (min-width: 1200px) {        // LG
            @include set-dimensions(300);
        }
        @media (max-width: 1199px) {        // MD
            @include set-dimensions(273);
        }
        @media (max-width: 991px) {        // SM
            @include set-dimensions(252);
        }
        @media (max-width: 767px) {         // XS
            @include set-dimensions(201);
        }

    #divContentProgressImage {
        display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;

        opacity: 0;
        position: absolute;
        transition: all .5s cubic-bezier(.1, 1, .55, 1);
        z-index: 101;

        &.on {
            opacity: 1;
        }

        > div {

            button {
                display: block;
                margin: 0 auto 2rem;
            }

            p {
                background-color: #fff;
                border: 3px solid #005;
                    border-radius: 12px;
                color: #000055;
                font-size: 20px;
                font-weight: bold;
                line-height: 3rem;
                margin: 0 auto;
                opacity: .7;
                padding: .25rem;
                text-align: center;
                width: 90%;
            }
        }
    }

    #divContents {
        align-items: stretch;
        box-shadow: .25rem .25rem 2rem 0 lightgrey;
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    #divContentCountDown {
        color: lightseagreen;
        opacity: .2;
        position: absolute !important;
            left: 0;
            right: 0;
            top: 0;
        text-align: center;
        z-index: 199;
        &.off {
            display: none;
        }
    }
    #divContents > div { /* div[name^="divContent"] */
        background-color: #ffffff;
        opacity: 1;
        transition: all 3s cubic-bezier(.1, 1, .55, 1);
    }
    .prgressVisualFrame {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        position: relative;
    }
    #divContents > div.anim {
        animation-name: pulse_animation;
        animation-duration: 2s;
        animation-iteration-count: 2;

        opacity: 0;
        border: 4px solid #faa;
            border-radius: 4px;
    }
        #divContents > div.anim-none {          /* Make all tiles (bgc:#fff) transparent - which shows the image behind them. */
            opacity: 0;
        }
        #divContents.anim-whole {               /* Pulse the whole image */
            animation-name: pulse_animation;
            animation-duration: 3s;
            animation-iteration-count: 1;
            border: 5px solid lightblue;
                border-radius: 3px;
            z-index: 98;
        }

    @keyframes pulse_animation {
        0% { transform: scale(1); }
        5% { transform: scale(1.5); }
        10% { transform: scale(2); }
        15% { transform: scale(1.5); }
        20% { transform: scale(2); }
        100% { transform: scale(1); }
    }
</style>