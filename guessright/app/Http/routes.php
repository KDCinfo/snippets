<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::pattern('id', '[0-9]+');
Route::pattern('pathId', '[0-9]+');
Route::pattern('nickname', '[a-z0-9\-]+');
Route::pattern('itemid', '[0-9]+');

$curPath = Request::path();
$fullUrl = Request::fullUrl();

define('CURRENT_PATH', $curPath);

define('IS_GR', strpos($fullUrl, 'guessright') > 0);

if (IS_GR) {

    Route::get('/', [
        'as' => 'gr.welcome',
        'uses' => 'GuessRightController@welcome'
    ]);

    // Vue Routes
    // ----------
    // { path: '/',      component: routeIntro },
    // { path: '/guess', component: routeApp },
    // { path: '/about', component: routeAbout }

    // GETS

        Route::get('api/getAlphabet', [
            'as' => 'gr.alphabet',
            'uses' => 'GuessRightController@getAlphabet'
        ]);
        Route::get('api/getImages', [
            'as' => 'gr.images',
            'uses' => 'GuessRightController@getImages'
        ]);
        Route::get('api/getLetterCount', [
            'as' => 'gr.getLetterCount',
            'uses' => 'GuessRightController@getLetterCount'
        ]);
        Route::get('api/getUserName', [
            'as' => 'gr.getUserName',
            'uses' => 'GuessRightController@getUserName'
        ]);
        Route::get('api/getLoggedIn', [
            'as' => 'gr.getLoggedIn',
            'uses' => 'GuessRightController@getLoggedIn'
        ]);

    // POSTS

        Route::post('api/getWord', [
            'as' => 'gr.word',
            'uses' => 'GuessRightController@getWord'
        ]);
        Route::post('api/checkWord', [
            'as' => 'gr.checkWord',
            'uses' => 'GuessRightController@checkWord'
        ]);
        Route::post('api/areCorrectLettersMaxed', [
            'as' => 'gr.areCorrectLettersMaxed',
            'uses' => 'GuessRightController@areCorrectLettersMaxed'
        ]);
        Route::post('api/postScore', [
            'as' => 'gr.postScore',
            'uses' => 'GuessRightController@postScore'
        ]);
}