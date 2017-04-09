<!-- INITIAL/DEFAULT ROUTER VIEW -->
<!-- [ vue-config.js ] -> const routes = [ { path: '/', component: require('./vue-components/guess-right-intro.vue') }, ... ] -->
<template>
    <div>
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">

                    <div class="panel-heading">Stop thinking and just guess. It's fun, fun, fun!!!</div>

                    <div class="panel-body container-shared">
                        <p>
                            <h3>Instructions</h3>
                            <ol>
                                <li>Click the "Guess!" button above.</li>
                                <li>Pick the right letters and be happy.</li>
                                <li>Choose the wrong letters and try again.</li>
                            </ol>
                            <h5>Life is simple!</h5>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<!-- script src="../projects/vue-guess-right-vue.js"></script --><!-- This pulls the JS from the external source directly into this [.vue] file -->
<script>
    // console.log('FILE:');
    // console.log('/resources/assets/js/vue/vue-components/guess-right-intro.vue');

    export default {
        mounted() {
            console.log('Component mounted in guess-right-intro.vue')
        }
    }
</script>
