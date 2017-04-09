<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGuessRightWordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guess_right_users', function (Blueprint $table) {

            $table->increments('id');
            $table->integer('user_id')->unsigned();

            $table->string('word_name', 75);
            $table->integer('correct')->unsigned();
            $table->integer('incorrect')->unsigned();
            $table->integer('score')->unsigned();
            $table->boolean('win');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::drop('guess_right_users');

    }
}
