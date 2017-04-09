<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use File;
use \Exception;

use App\Http\Middleware\SetViewVariables;

use App\Models\GuessRight;
use App\Models\GuessRightUser;
use Carbon\Carbon;

class GuessRightController extends Controller
{

    protected $isProduction;
    protected $userAttrWhereGr;

    public function __construct()
    {
        $this->isProduction = strtolower(env('APP_ENV')) == 'production';

        $curUser = $this->getUserLogged();
        if ($curUser) {
            $this->userAttrWhereGr = [      // (user_id) represents the User ID from the [GuessRightUser] model
                'user_id' => $curUser->id
            ];
        }
    }

    public function welcome()
    {
        $pageTitle = 'Guess Right and Have Fun!';
        $whichView = 'Guess Right and Like! :)';

        // Preparation for additional functionality / app expansion
        // --------------------------------------------------------
        // $guessRightConfig = ['theme', 'locality', 'complexity'];
        // $guessRightWordList = [];

        return view('gr-welcome', [
            'whichView' => $whichView,
            'pageTitle' => $pageTitle,
        ]);
    }

    public function index()
    {
        $pageTitle = 'KDC-Info: Guess Right and Succeed';
        $whichView = 'Guess Right and Like! :)';

        return view('gr-home', [
            'whichView' => $whichView,
            'pageTitle' => $pageTitle,
        ]);
    }

    public function getLoggedIn() {
        $curUser = $this->getUserLogged();
        return ($curUser) ? $curUser->id : 0;
    }

    public function getUserName() {
        $curUser = $this->getUserLogged();
        $curUserName = [];

        if (!$curUser) {
            $curUserName['userName'] = 'Guest';
            $curUserName['score'] = 0;
            $curUserName['win'] = 0;
            $curUserName['maxScore'] = 0;

        } else {

            $curUserName['userName'] = $this->getUserNameFirst($curUser);

            $getSum = GuessRightUser::where($this->userAttrWhereGr)->where('created_at', '>=', Carbon::today())->sum('score');
                $sum = (empty($getSum)) ? 0 : $getSum;

            $getWin = GuessRightUser::where($this->userAttrWhereGr)->where('created_at', '>=', Carbon::today())->sum('win');
                $win = (empty($getWin)) ? 0 : $getWin;

            $max = $this->getMaxScore($this->userAttrWhereGr);

            $curUserName['numberOfWins'] = $win;
            $curUserName['score'] = $sum;
            $curUserName['maxScore'] = $max;
        }

        return $curUserName;
    }

    public function getMaxScore() {
        $getMax = GuessRightUser::where($this->userAttrWhereGr)->max('score');
            $max = (empty($getMax)) ? 0 : $getMax;

        return $max;
    }

    public function postScore(Request $request) {
        $curUser = $this->getUserLogged();

        // $curUserScore = $curUser->score;
        // $curUser->score = ($curUserScore + $request->score);
        // $curUser->save();

        if (!$curUser) {
            $giveBackStatus = 'Error';
            $giveBackMsg = 'No user found';
            $maxScore = 0;
            $maxScoreTop = false;

        } else {

            if ( is_null( $this->validate($request, [
                'correct' => 'integer',
                'incorrect' => 'integer',
                'score' => 'integer',
                'win' => 'integer|max:1',
            ]) ) ) {

                $maxScoreOld = $this->getMaxScore($this->userAttrWhereGr);

                $scoreArray = [
                    'user_id' => $curUser->id,
                    'word_name' => session('word'),
                    'correct' => $request->correct,
                    'incorrect' => $request->incorrect,
                    'score' => $request->score,
                    'win' => $request->win,
                ];
                $newScore = GuessRightUser::create($scoreArray);

                $maxScore = $this->getMaxScore($this->userAttrWhereGr);
                $maxScoreTop = $maxScore > $maxScoreOld;

                $giveBackStatus = 'Success';
                $giveBackMsg = 'Score updated successfully.';

            } else {
                return 'Error with postScore $request';
            }
        }

        return [
            'status' => $giveBackStatus,
            'msg' => $giveBackMsg,
            'maxScore' => $maxScore,
            'maxScoreTop' => $maxScoreTop
        ];
    }

    public function getWord()
    {
        $jsond = $this->getFile('wordlist');
        $jsonWord = $jsond['wordlist'];

        // Get random word and put it in the session
        $newWord = $jsonWord[mt_rand(0, count($jsonWord) - 1)];     // Comments in [array-rand] indicate this is a better approach than: [ http://php.net/manual/en/function.array-rand.php ]
        session(['word' => $newWord]);

        // Set return string for new word; Only send randomly selected word back if not in production (e.g., local)
        $returnStrBase = 'Word successfully stored in session.';
        $returnStr = ($this->isProduction) ? $returnStrBase : $returnStrBase . ' -- ' . $newWord;

        return $returnStr;
    }

    public function getAlphabet()
    {
        $jsond = $this->getFile('alphabetlist');
        return $jsond['alphabetlist'];
    }

    public function getImages()
    {
        $jsond = $this->getFile('progress-images');
        return $jsond;
    }

    public function checkWord(Request $request)
    {
        if ( is_null( $this->validate($request, ['guessedLetter' => 'alpha|max:1']) ) ) {
            $letterGuessed = $request->guessedLetter;

            $sessionWord = session('word');
            $haveWord = (is_null($sessionWord)) ? false : true;         // If property in session is null, session has expired. Return false so user can be notified to restart their game.
            $letterPosition = strpos($sessionWord, $letterGuessed);

            $lastPos = 0;
            $positions = array();
            $positionsObj = [
                'letterGuessed' => $letterGuessed
                ,'haveWord' => $haveWord                                // Added for when session expires, and [ session('word') ] returns `null`; used in [actions.js]
                ,'letterPosition' => $letterPosition
                ,'ourword' => ($this->isProduction || !$haveWord) ? '' : $sessionWord
            ];
            while (($lastPos = strpos($sessionWord, $letterGuessed, $lastPos))!== false) { // Each matched position (index) is added to the $positions array
                $positions[] = $lastPos;
                $lastPos = $lastPos + strlen($letterGuessed);
            }
            $positionsObj['positions'] = $positions;                    // Positions are the index (key) positions of the selected letter found in the current Word (e.g., 'z' in 'pizza' would return [2,3])
            return $positionsObj;
        } else {
            return 'Error with checkWord $request';
        }
    }

    public function getLetterCount()                                    // NoIarray is equal to NoI -> Game Lost
    {
        return [ 'letterCount' => strlen(session('word')) ];
    }

    public function areCorrectLettersMaxed(Request $request)            // Check for Win
    {
        if ( is_null( $this->validate($request, ['lettersCorrectLength' => 'integer']) ) ) {

            $lettersCorrectLength = $request->lettersCorrectLength;
            $wordLength = strlen(session('word'));
            return ['areCorrectLettersMaxed' => $lettersCorrectLength === $wordLength];

        } else {
            return 'Error with areCorrectLettersMaxed $request';
        }
    }

    protected function getFile($whichList) {
        $thisList = $whichList;
        if (session()->has('guessLocale')) {
            $getFileFilename = $thisList . '-' . session('guessLocale');
            if ( !File::exists( "/path/to/private/file/${getFileFilename}.json" ) ) {
                $getFileFilename = $thisList . '-en_US';
            }
        } else {
            $getFileFilename = $thisList . '-en_US';
        }

        $path = storage_path() . "/path/to/private/file/${getFileFilename}.json";
        if (!File::exists($path)) {
            throw new Exception("Invalid File");
        }

        return json_decode(file_get_contents($path), true);
    }

     protected function getUserLogged() {

        $thisUser = Auth::user();

        if (!$thisUser) {
            return false;
        } else {
            return $thisUser;
        }
    }

    protected function getUserNameFirst($curUser) {

        if (strlen($curUser->user_nickname) > 0) {
            return $curUser->user_nickname;
        } elseif (strlen($curUser->first_name) > 0) {   // [first_name] field is required, so it should never fall through, but...
            return $curUser->first_name;
        } elseif (strlen($curUser->name) > 0) {
            return $curUser->name;
        }
    }
}