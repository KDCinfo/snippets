@extends('layouts.grLayout')

@section('title')
    <title>{{ $pageTitle }}</title>
    <meta name="description" content="Guess Right is a random word picker allowing you to guess its pick; letter by letter.">
@stop

@section('gr-css')
@stop

@section('content')
    <div class="panel panel-default">

        <div class="panel-heading hide">Where you can just guess until you get it right.</div>

        <div class="panel-body welcome-home">

            <section>

                <div id="myApp">
                    <div>
                        <nav class="row gr-nav">
                            <div class="col-xs-12 col-sm-6 col-sm-push-6">
                                <div class="gr-nav-greeting">
                                    <h2>Guess Right and Be Happy!</h2>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-sm-pull-6">
                                <div class="gr-nav-buttons">
                                    <router-link class="btn btn-primary" to="{{ ROOT_PATH_GUESSRIGHT }}" exact>Home</router-link>
                                    <router-link class="btn btn-primary" to="{{ ROOT_PATH_GUESSRIGHT }}guess">Guess!</router-link>
                                    <router-link class="btn btn-primary" to="{{ ROOT_PATH_GUESSRIGHT }}about">About</router-link>
                                </div>
                            </div>
                        </nav>
                        <br>
                        <section>
                            <div>
                                <router-view></router-view>
                            </div>
                        </section>
                    </div>
                </div>

<!--                // Two other methods for layout of your route links
                    <ul>
                        <router-link class="btn btn-primary" tag="li" to="{{ ROOT_PATH_GUESSRIGHT }}" exact>
                            <a>Home</a>
                        </router-link>
                        <router-link class="btn btn-primary" tag="li" to="{{ ROOT_PATH_GUESSRIGHT }}about">
                            <a>About</a>
                        </router-link>
                    </ul>

                    <router-link class="btn btn-primary" tag="a" to="{{ ROOT_PATH_GUESSRIGHT }}" exact>
                        <div>Home</div>
                    </router-link>
                    <router-link class="btn btn-primary" tag="a" to="{{ ROOT_PATH_GUESSRIGHT }}about">
                        <div>About</div>
                    </router-link>
 -->
                <div id="guess-app">
                    <guess-comp></guess-comp>
                </div>
                <template id="guess-template">
                    <div>
                        <h1>Batter up!!</h1>
                        <h2>Hold up a sec... Something looks a bit off.</h2>
                        <h3>Can you try refreshing? Do you have JavaScript enabled?</h3>
                        <h4>Although some technologies are pushing for server-side rendering, other technologies such as React, Angular, and Vue rely on the client having JavaScript enabled.</h4>
                    </div>
                </template>

            </section>

        </div>
    </div>
@endsection