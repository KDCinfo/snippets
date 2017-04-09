<template id="modal-template">
    <div class="modal modalJs" v-bind:style="{ 'background-color': hideForModal }">

        <div class="modal-wrapper">
            <div class="modal-container">
                <content select=".modal-header">
                    <div class="modal-header">
                        <slot name="modal-header"></slot>
                    </div>
                </content>
                <div class="modal-body">
                    <slot name="modal-body">
                        This is default text that should never be seen. :o<br>
                        (there should always be body content provided by the component calling for this Modal.)
                    </slot>
                </div>
                <div class="modal-footer uk-clearfix">
                    <slot name="modal-footer">
                        <button @click="hideAllModals" class="btn btn-success float-right">Close</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        hideForModal() {
            return this.$store.getters.getShowModalWinBack
        }
    },
    updated() {
        this.$store.dispatch('setModalWinBack', 'rgba(0, 0, 0, 0.0) !important')    // This seems to be what runs after both 'beforeEnter' and 'afterEnter' methods in guess-right.vue
    },
    methods: {
        hideAllModals() {
            this.$store.dispatch('setAllModalsOff')
        }
    }
}
</script>

<style lang="sass" scoped>
    .modal {
        position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;

        width: 100%;
        height: 100%;
        /* background: rgba(0, 0, 0, 0.7); */
        display: table;
        transition: all 0.5s ease;

        &-wrapper {
            display: table-cell;
            vertical-align: middle;
        }

        &-container {
            background: #fff;
            width: 450px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
            margin: 0 auto;
            padding: 20px 30px;
        }

        &-body {
            line-height: 1.45;
        }
        &-footer {
            margin-top: 15px;
        }

        &-enter {
            opacity: 1;
        }
        &-leave {
            opacity: 0;
        }

        &-enter &-container,
        &-leave &-container {
            -webkit-transform: scale(1.5);
            transform: scale(1.5);
        }
    }
</style>