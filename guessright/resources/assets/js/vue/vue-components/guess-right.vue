<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <em>Can ya give me a tip of some sort??</em>
            <i><b>... <span v-text="hintMsg"></span></b>
                <span id="allHints">
                    <span v-text="currentHint"></span>
                    <a href="#" @click.prevent="showHints">(see all tips)</a>
                </span>
            </i>
        </div>
        <div class="panel-body">
            <section id="vue-canvas">

                <div class="row">
                    <div class="flexbox">

                        <div class="divBlocks flex-item-alphabet col-xs-12 col-sm-6 col-lg-4">
                            <div id="AlphabetComp">
                                <alphabet></alphabet>
                            </div>
                        </div>

                        <div class="divBlocks flex-item-visual col-xs-12 col-sm-6 col-lg-4">
                            <div id="ProgressVisualComp">
                                <div class="title-height-space hidden-xs">&nbsp;</div>
                                <div id="ProgressVisualOutput"><progressVisual></progressVisual></div>
                            </div>
                        </div>

                        <div class="divBlocks flex-item-status col-xs-12 col-sm-6 col-lg-4">
                            <div id="StatsAndOptions">
                                <infoComp></infoComp>
                                <div class="hidden" id="ThemeComp">#ThemeComp</div>
                                <div class="hidden" id="LocaleComp">#LocaleComp</div>
                                <div class="hidden" id="ComplexityLiwComp">#ComplexityLiwComp</div>
                                <div class="hidden" id="ComplexityNoiComp">#ComplexityNoiComp</div>
                                <button class="btn btn-primary btn-sm reset-game-button" @click.prevent="resetGame($event)">Reset Game</button>
                            </div>
                        </div>

                        <div class="divBlocks flex-item-letters col-xs-12 col-sm-6 col-lg-12">
                            <div id="UsedLetters">
                                <div id="GuessesCorrectComp">
                                    <div id="GuessesCorrectOutput"><progressUp></progressUp></div>
                                </div>
                                <div id="GuessesIncorrectComp">
                                    <div id="GuessesIncorrectOutput"><progressDown></progressDown></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


<!-- TURN ON SESSION TIMEOUT MODAL -->
                <!-- <button @click="showModal" class="btn btn-primary">Show Modal</button> -->


                <div class="container-shared">
                    Although they don't require it, all the images used (which you see when you complete a game and don't win (i.e., when you lose)) are licensed under Creative License Zero and brought to you by:
                    <dl>
                        <li><a target="useful-site" href="https://stocksnap.io">StockSnap.io</a> (CLZ)</li>
                        <li><a target="useful-site" href="https://unsplash.com/collections">Unsplash</a> (CLZ)</li>
                        <li>Those 2 sites were referenced in an article titled, "<a target="useful-site" href="https://www.searchenginejournal.com/25-places-find-free-photos-will-actually-want-use/153529/">25 Places to Find Free Images Online That You Will Actually Want to Use</a>"</li>
                    </dl>
                </div>

                <transition name="modal-fade-in"
                    enter-active-class="animated bounceInDown"
                    leave-active-class="animated bounceOutUp"
                    v-on:before-enter="beforeEnter"
                    v-on:after-enter="afterEnter"
                    v-on:before-leave="beforeLeave"
                    v-on:after-leave="afterLeaveNO"
                >
                    <modal v-show="showModalChangeComplexityListen">
                        <div slot="modal-body">
                            <div class="modal-change-complexity">
                                <h3>Change Complexity:</h3>
                                <p v-show="!isChecked">Would you like to make things easier by showing all the empty letters in the word?</p>
                                <p v-show="isChecked">Would you like to win more points by not knowing how many letters are in the current word?</p>
                                <p>This will reset your current game. Proceed?</p>
                                <p class="btn-actions">
                                    <button class="btn btn-primary" @click="updateComplexity">Change Complexity</button>&nbsp;
                                    <button class="btn btn-info" @click="closeModal">Cancel</button>
                                </p>
                            </div>
                        </div>
                        <div slot="modal-footer">&nbsp;</div>
                    </modal>
                </transition>

                <transition name="modal-fade-in"
                    enter-active-class="animated bounceInDown"
                    leave-active-class="animated bounceOutUp"
                    v-on:before-enter="beforeEnter"
                    v-on:after-enter="afterEnter"
                    v-on:before-leave="beforeLeave"
                    v-on:after-leave="afterLeaveNO"
                >
                    <modal v-show="showModalHintsListen">
                        <div slot="modal-body">
                            <div>
                                <p>Tips:</p>
                                <ul>
                                    <li v-for="hint in hints">{{ hint }}</li>
                                </ul>
                            </div>
                        </div>
                    </modal>
                </transition>

                <transition name="modal-fade-in"
                    enter-active-class="animated bounceInDown"
                    leave-active-class="animated bounceOutUp"
                    v-on:before-enter="beforeEnter"
                    v-on:after-enter="afterEnter"
                    v-on:before-leave="beforeLeave"
                    v-on:after-leave="afterLeaveTO"
                >
                    <modal v-show="showModalListen">
                        <div slot="modal-body">
                            <div>
                                <p>Looks like your game's session has expired.</p>

                                <h2>tl;dr -- Good News!</h2>
                                <p>You can start a new game by clicking <button class="btn btn-primary btn-xs" @click.prevent="resetGame($event)">Try Again</button></p>

                                <h3>The 'Why'</h3>
                                <p>This web app makes a connection through a back-end system (Laravel) to connect to a database (MySQL) in order to create and maintain your currently guessed 'word'.</p>
                                <p>The 2-hour inactive session timeout provides a way to keep even this little bit of data secure (as well as maintaining the integrity of the rest of the system).</p>

                                <p>Side note: A free account here provides access to a couple other free online apps provided by me (er, KDC-Info), namely; <a href="//kdcinfo.com/keeptrack/">Keep Track</a> and <a href="//kdcinfo.com/pickameal/">Pick-a-Meal</a>.</p>
                            </div>
                        </div>
                    </modal>
                </transition>

                <transition name="modal-fade-in"
                    enter-active-class="animated bounceInUp"
                    leave-active-class="animated bounceOutDown"
                    v-on:before-enter="beforeEnter"
                    v-on:after-enter="afterEnter"
                    v-on:before-leave="beforeLeave"
                    v-on:after-leave="afterLeave"
                >
                    <modal v-show="showModalWinListen">
                        <div slot="modal-body">
                            <div class="modal-300-frame-wrap text-center">
                                <div class="modal-300">
                                    <p>
                                        <h2>Great Guessing !!!</h2>
                                        <button class="btn btn-primary btn-lg" @click.prevent="resetGame($event)">Play Again</button><br>
                                        <button @click="hideModal" class="btn btn-primary btn-close">Close</button>
                                    </p>
                                </div>
                                <div class="modal-back" v-bind:style="{ 'background-image': (imageWon.length > 0) ? 'url(./public/img/guess-right/won/' + imageWon + ')' : '' }"></div>
                                <div class="modal-frame" v-bind:style="{ 'background-image': (imageFrame.length > 0) ? 'url(./public/img/guess-right/' + imageFrame + ')' : '' }"></div>
                            </div>
                        </div>
                        <div slot="modal-footer">&nbsp;</div>
                    </modal>
                </transition>

            </section>
        </div>
    </div>
</template>

<!--
    Lesson 27 - Date manipulation
        momentjs.com -> 20.7k
        sudo npm install moment --save
 -->

<script>
    // import moment from "moment";
        // https://github.com/moment/moment-timezone/issues/356
        // in order to keep the bundle small make sure when you are requiring moment add this to your webpack plugins:
        //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        //     http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack

    import Alphabet from '../vue-components/Alphabet.vue'
    import ProgressVisual from '../vue-components/ProgressVisual.vue'   // Image Lost
    import ProgressUp from '../vue-components/ProgressUp.vue'
    import ProgressDown from '../vue-components/ProgressDown.vue'
    import Modal from '../vue-components/Modal.vue'                     // Image Frame, Image Won
    import InfoComp from '../vue-components/InfoComp.vue'

    export default {
        components: {
            alphabet: Alphabet,
            progressVisual: ProgressVisual,
            progressUp: ProgressUp,
            progressDown: ProgressDown,
            modal: Modal,
            infoComp: InfoComp
        },
        methods: {
            updateComplexity() {
                this.$store.dispatch('changeShowEmptyTiles', !this.$store.getters.getShowEmptyTiles)
            },
            closeModal() {
                this.$store.dispatch('setAllModalsOff')
            },
            resetGame(event) {
                this.$store.dispatch('resetWrapper', event)
            },
            beforeEnter() {                                                                 // TRANSITIONS - JS -> MODAL: You Won
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.0) !important')
            },
            afterEnter() {
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.7) !important')    // This is the one that actually does turn the background back on
            },                                                                              // (as opposed to all the others I tried in Modal.vue)
            beforeLeave() {
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.0) !important')
            },
            afterLeave() {
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.7) !important')
                setTimeout( () => {
                    this.$store.dispatch('setImages')
                }, 1000)
            },
            afterLeaveTO() {
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.7) !important')
                this.$store.dispatch('setImages')
            },
            afterLeaveNO() {
                this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.7) !important')
            },
            showHints() {
                this.$store.dispatch('setModal', {whichModal: 'showModalHints', showIt: true})
            },
            showModal() {                                                                   // Show Timeout Modal
                this.$store.dispatch('setModal', {whichModal: 'showModal', showIt: true})
            },
            hideModal() {
                this.$store.dispatch('setAllModalsOff')
            },
        },
        filters: {
            // ago(date) {
            //     return moment(date).fromNow();
            // },
            capitalize: function (value) {
                return value.toUpperCase();
            },
            initialize: function (value) {
                if (!value) return ''
                    value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            },
        },
        computed: {
            isChecked() {
                return this.$store.getters.getShowEmptyTiles
            },
            hintMsg() {
                let greeting = this.$store.getters.getHintGreet,
                    grandom = Math.floor(Math.random()*greeting.length)
                return greeting[grandom]
            },
            currentHint() {
                let currentHintT = this.$store.getters.getHints,
                    cHrandom = Math.floor(Math.random()*currentHintT.length)
                return currentHintT[cHrandom]
            },
            showModalChangeComplexityListen() {
                return this.$store.getters.getShowModalChangeComplexity
            },
            showModalHintsListen() {
                return this.$store.getters.getShowModalHints
            },
            showModalListen() {
                return this.$store.getters.getShowModal
            },
            showModalWinListen() {
                return this.$store.getters.getShowModalWin
            },
            imageFrame() {
                return this.$store.getters.getImageFrame
            },
            imageWon() {
                return this.$store.getters.getImageWon
            },
        },
        data() {
            return {
                hints: this.$store.getters.getHints
            }
        },
        beforeCreate() {
            this.$store.dispatch('getLoggedIn')
            this.$store.dispatch('setImages')
        },
    }
</script>

<style lang="sass">
/*                        */
/* MODAL INSIDE STRUCTURE */
/*                        */

        div.modal-300-frame-wrap {
            height: 100%;
            width: 100%;

            line-height: 3 !important;
            position: relative;
        }
        div.modal-300 h2 {
            font-size: 35px;
            font-family: fantasy;
            border: 3px solid #005;
            background-color: #fff;
            color: #005;
            opacity: .8;
            border-radius: 12px;
        }
        div.modal-300 button {
            border: 3px solid yellow;
            border-radius: 10px;

            &:hover {
                border: 3px dotted yellow;
            }
        }
        div.modal-300 button.btn-close {
            border: 2px solid yellow;
            border-radius: 8px;

            &:hover {
                border: 2px dotted yellow;
            }
        }
        div.modal-300 {
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            padding: 2rem;
            position: relative;
            z-index: 1105;
            width: 350px;
        }
        div.modal-back {
            height: 450px;
            width: 450px;

            left: -40px;
            position: absolute;
            top: -55px;
            z-index: 1102;
        }
        div.modal-frame {
            height: 500px;
            width: 500px;

            left: -65px;
            position: absolute;
            top: -90px;
            z-index: 1103;
        }

/* MODAL - CHANGE COMPLEXITY */

        .modal-change-complexity {
            h3 {
                margin-bottom: 2rem;
            }
            .btn-actions {
                margin: 2rem 0 0;
            }
        }


    div {
        margin: 0 auto;
    }
    .divBlocks {
        margin: 1rem 0 0;
        outline: 0px solid green;
    }
    .panel-heading {
        text-align: center;

        em {
            color: maroon;
        }
        i {
            line-height: 2.1;
        }
    }
    .GuessesOutput {
        min-height: 11.75rem;
    }
    .title-height-space {
        display: block;
        min-height: 3.5rem;
    }
    .flexbox {
        display: flex;
        flex-wrap: wrap;
    }
        @media (min-width: 1200px) {        // LG
            .flex-item-visual { order: 2; }
            .flex-item-alphabet { order: 1; }
            .flex-item-letters { order: 4; }
            .flex-item-status { order: 3; }
        }
        @media (max-width: 1199px) {        // MD
            .flex-item-visual { order: 2; }
            .flex-item-alphabet { order: 1; }
            .flex-item-letters { order: 4; }
            .flex-item-status { order: 3; }
        }
        @media (max-width: 991px) {        // SM
            .flex-item-visual { order: 2; }
            .flex-item-alphabet { order: 1; }
            .flex-item-letters { order: 4; }
            .flex-item-status { order: 3; }
        }
        @media (max-width: 767px) {         // XS
            .flex-item-visual { order: 1; }
            .flex-item-alphabet { order: 2; }
            .flex-item-letters { order: 3; }
            .flex-item-status { order: 4; }
        }

/* COMPONENTS */

    #StatsAndOptions {
        text-align: center;
    }
    button.anim-shake {
        animation-name: rotate_animation;
        animation-duration: 250ms;
        animation-iteration-count: 3;
        transition: transform 0.1s cubic-bezier(0.1, 1, 0.55, 1);
    }
    button.anim-shake:hover {
        transform: rotate(20deg);
    }
        @keyframes rotate_animation {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-10deg); }
            100% { transform: rotate(0deg); }
        }

    .progressUpDownContainer {
        border-top: 1px solid lightBlue;
        min-height: 11.75rem;
        padding-top: 1rem;

        button {
            cursor: default;
        }
    }
    h3 {
        font-family: cursive;
        font-size: 2.0rem;
    }
    .reset-game-button {
        position: relative;
        /* z-index: 101; */
    }
</style>