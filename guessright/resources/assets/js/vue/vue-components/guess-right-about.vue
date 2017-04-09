<!-- INITIAL/DEFAULT ROUTER VIEW -->
<!-- [ vue-config.js ] -> const routes = [ { path: '/', component: require('./vue-components/guess-right-about.vue') }, ... ] -->
<template>
    <div>
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">

                    <div class="panel-heading">Are we <strike>there</strike> having fun yet?</div>

                    <div class="panel-body container-shared">
                        <p>This little web app thoughtfully brought to you by... me :) Just a simple hard-working front-end dev learning Vue 2 and Laravel 5 in early 2017.</p>
                        <p>This will also be my first Open Source commit to GitHub. Back in the day I did 4 on SourceForge.Net, which embarrassingly enough are <span class="nowrap">still out there <code>¯\_(ツ)_/¯</code></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- script src="../projects/vue-guess-right-vue.js"></script --><!-- This pulls the JS from the external source directly into this [.vue] file -->
<script>
    // console.log('FILE:');
    // console.log('/resources/assets/js/vue/vue-components/guess-right-about.vue');

    export default {
        mounted() {
            console.log('Component mounted in guess-right-about.vue')
        }
    }
</script>
