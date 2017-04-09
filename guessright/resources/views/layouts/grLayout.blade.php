<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @yield('title')

        <link rel="stylesheet" href="{{ asset('public/css/vendor/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset(elixir('css/keeptrack.css', 'public/build')) }}">
        <link rel="stylesheet" href="{{ asset(elixir('css/gr.css', 'public/build')) }}" >
        <link rel="stylesheet" href="{{ asset('public/css/vendor/animate.min.css') }}"><!-- https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css -->

        <style type="text/css">
            body {
                @if (Auth::user() && Auth::user()->pref_back_color)
                    background-color: #{{Auth::user()->pref_back_color}};
                @endif
            }
            @yield('gr-css')
        </style>

        @if (CURRENT_PATH == "/" || CURRENT_PATH == "register" || CURRENT_PATH == "login" || CURRENT_PATH == "intro" || CURRENT_PATH == "contact")
            <?php $backClass = "welcome-home-body"; ?>
        @else
            <?php $backClass = ""; ?>
        @endif

        @if(strtolower(env('APP_ENV')) == 'production')
            <!-- Google Analytics -->
            <!-- End Google Analytics -->
        @endif

    </head>
    <body id="app-layout" class="<?=$backClass?>">

        <header>
            @include('partials.header')
        </header>

        <main class="container main-content">

            <section class="container">
                <div class="row">
                    <div class="col-xs-12">

                        @include('errors.errors')

                        @yield('content')

                    </div>
                </div>
            </section>

        </main>

        <footer>
            @include('partials.footer')
        </footer>

        <!-- HEADER -->
        <script src="{{ asset('public/js/vendor/jquery-2.2.0.min.js') }}"></script>
        <script src="{{ asset('public/js/vendor/bootstrap-3.3.6.min.js') }}"></script>
        <script src="{{ asset(elixir('js/global-functions.js', 'public/build')) }}"></script>

        <!-- APP -->
        @if(CURRENT_PATH == "/")
            <script src="{{ asset(elixir('js/vue-config.js', 'public/build')) }}"></script>
        @endif

    </body>
</html>
