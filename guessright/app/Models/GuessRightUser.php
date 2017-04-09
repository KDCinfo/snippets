<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\User;

class GuessRightUser extends Model {

    protected $table = 'guess_right_users';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'word_name',
        'correct',
        'incorrect',
        'score',
        'win',
    ];

    public function user() {

        return $this->belongsTo('App\User');

    }
}