(function Yahtzee() {

// --------------------------------------- CLASSES --------------------------------------- 

var Observable = function() {

    //create reference to this
    var _self = this;

    _self.data;               //contains data
    _self.subscribers = [];   //contains all callback functions

    _self.publish = function() {
        //loops through all subscribed functions and executes them
        for (var i in _self.subscribers) {
            _self.subscribers[i]();
        }
    }

    _self.subscribe = function(callback) {
        //adds functino to subscribers array
        _self.subscribers.push(callback);
    }

    _self.unsubscribe = function(callback) {
        //loops through all subscribed functions and removes the callback
        for (var i in _self.subscribers) {
            if(_self.subscribers[i] == callback) {
                 _self.subscribers.splice(i, 1);
            }
        }
    }
}

var Game = function() {
    
    var _self = this;
    
    _self.count     = 0;
    _self.score     = 0;
    
    // html elements
    var $resultEl       = $('#result');
    var $continueEl     = $('#continue');
    var $buttonDiv      = $('#btns');
    var $scores         = $('.score');
    var $diceNrs        = $('.nr');
    var $dices          = $('.dice');
    var $tableScores    = $('.tableScore');
    
    _self.updateCount = function(val) {
        if(val == 'reset') {
            _self.count = 0;
        }

        // assign count value to html count element
        $('#throws').innerHTML = _self.count;
        
        if(_self.count == 3) {
            _self.pause();
        }
    }
    
    _self.updateScore = function(value) {
        //set all html score elements to 0
        if(value == 'reset') {
            for (var i=0 ; i<$scores.length ; i++) {
                $scores[i].innerHTML = '0';
            }
        }
        else {
            var lockedScores    = [];
            var setScores       = [];
            var lockedScoreEl   = document.getElementsByClassName('lockedS');
            var setScoresEl     = document.getElementsByClassName('set');

            lockedScores.push(lockedScoreEl[0]);

            if(setScoresEl.length > 0) {
                for (var i = 0; i < setScoresEl.length; i++) {
                    setScores.push(setScoresEl[i]);
                }
            }

            //calculate sum of all locked/set score elements and assign sum to html elements
            if(setScores.length > 0) {
                var allScores   = lockedScores.concat(setScores);
                for (var i = 0; i < allScores.length; i++) {
                    allScores[i] = allScores[i].innerHTML;
                    allScores[i] = parseInt(allScores[i]);
                }
                var tempSum     = allScores.reduce(function(a, b) { return a+b; }, 0);
                _self.score     = tempSum;
            }
            else {
                _self.score = $('.lockedS').html();
            }

            for (var i=0 ; i<$scores.length ; i++) {
                $scores[i].innerHTML = _self.score;
            }
        }
    }

    _self.pause = function($scoreTarget) {

        if($('.lockedS').length == 1) {
            $continueEl.removeClass();
            $('#continueInfo').addClass('hidden');
            $('#continueP').removeClass();
            $buttonDiv.addClass('hidden');
            $('#continueBtn').prop('disabled', false);
        }
        else {
            $continueEl.removeClass();
            $('#continueInfo').removeClass();
            $('#continueP').addClass('hidden');
            $buttonDiv.addClass('hidden');
            $('#continueBtn').prop('disabled', true);
        }
    }
    
    _self.resume = function() {
        $resultEl.addClass('hidden');
        $continueEl.addClass('hidden');
        $buttonDiv.removeClass('hidden');
        _self.updateCount('reset');

        $('.lockedS').addClass('set');

        for (var i=0, ilen=$diceNrs.length ; i<ilen; i++) {
            $dices[i].setAttribute('class', 'dice unlocked');
            $diceNrs[i].innerHTML = '';
        }

        for (var i=0, ilen=$tableScores.length ; i<ilen; i++) {
            if(!$tableScores[i].classList.contains('set')) {
                $tableScores[i].setAttribute('class', 'tableScore');
                $tableScores[i].innerHTML = '';
            }
        }
    }
    
    _self.endGame = function() {
        var resultText  = document.querySelector('#result p');
        
        if(_self.score > 99) {
            resultText.setAttribute('class', 'green');
        } else {
            resultText.setAttribute('class', 'red');
        }
        
        $resultEl.removeClass();
        $buttonDiv.addClass('hidden');
        $continueEl.addClass('hidden');
    }
    
    _self.restart = function() {
        _self.updateCount('reset');
        _self.updateScore('reset');

        $resultEl.addClass('hidden');
        $continueEl.addClass('hidden');
        $buttonDiv.removeClass('hidden');

        scoreSheet.lockScore('reset');

        for (var i=0, ilen=$diceNrs.length ; i<ilen; i++) {
            $dices[i].setAttribute('class', 'dice unlocked');
            $diceNrs[i].innerHTML = '';
        }

        for (var i=0, ilen=$tableScores.length ; i<ilen; i++) {
            $tableScores[i].setAttribute('class', 'tableScore');
            $tableScores[i].innerHTML = '';
        }
    }
}

var Dice = function() {
    var _self = this;

    _self.element;

    _self.throwDices = function() {
        var $allDices       = $('.nr');
        var $unlockedDices  = $('.unlocked .nr');
        var total           = 0;
        var resultArray     = [];
        
        //loop thru unlocked dices, assign random number
        for (var i=0, ilen=$unlockedDices.length ; i<ilen; i++) {
            var randomNr = Math.floor(Math.random() * 6 ) + 1;
            $unlockedDices[i].innerHTML = randomNr;
        }
        
        //loop thru all dices, calculate total value
        for (var i=0, ilen=$allDices.length ; i<ilen; i++) {
            value = parseInt($allDices[i].innerHTML);
            resultArray[i] = value;
            total += value;
        }
        
        scoreSheet.calculateScores(resultArray);
    }

    _self.lockDice = function(diceID) {
        var $clickedDice = $("#" + diceID);
        
        if(yahtzee.count != 0 && yahtzee.count != 3) {
            if($clickedDice.hasClass('locked')) {
                $clickedDice.removeClass('locked');
                $clickedDice.addClass('unlocked');
            } else {
                $clickedDice.addClass('locked');
                $clickedDice.removeClass('unlocked');
            }
        }
    }

    _self.throwCount = function() {
        ++yahtzee.count;
        yahtzee.updateCount();
    }
}

var Help = function() {
    var _self = this;

    _self.openManual = function() {
        var $helpDiv    = $('#helpDiv');
        var $overlay    = $('#overlayDiv');
        
        $helpDiv.toggleClass('hidden');
        $overlay.toggleClass('overlay');
    }
}

var ScoreSheet = function() {
    var _self = this;
    var _emptyCount = 0;

    //get all html score elements
    _self.getBoxes = function() {
        var $allBoxesArray  = [$('#aces'), $('#twos'), $('#threes'), $('#fours'), $('#fives'), $('#sixes'), $('#threeOfAKind'), $('#fourOfAKind'), $('#fullHouse'), $('#smallStraight'), $('#largeStraight'), $('#yahtzeeBox')];
        
        // loop thru array and filter out set slots (so that they don't get recalculated)
        for (var i=0 ; i < $allBoxesArray.length ; i++) {
            if($allBoxesArray[i] != '') {
                if($allBoxesArray[i].hasClass('set')) {
                    $allBoxesArray[i].removeClass('lockedS');
                    $allBoxesArray[i] = '';
                }
            }
        }

        return $allBoxesArray;
    }
    
    _self.calculateScores = function(array) {
        var acesResult, twosResult, threesResult, foursResult, fivesResult, sixesResult;
        var allResults      = [acesResult, twosResult, threesResult, foursResult, fivesResult, sixesResult];
        var $allBoxes       = _self.getBoxes();
        array               = array.sort();

        //collect results
        for(var i=0 ; i < allResults.length ; i++) {
            allResults[i] = array.filter(function(val) { return val == (i+1); });
        }

        // ----------------- UPPER HOUSE ----------------- 
        //calculate sum for results and assign sum to html elements
        for(var i=0 ; i < allResults.length ; i++) {
            var tempArray   = allResults[i];
            var tempElement = $allBoxes[i];
            var tempSum     = allResults[i].reduce(function(a, b) { return a+b; }, 0);

            if(tempElement != '') {
                tempElement.html(tempSum);
            }
        }

        // ----------------- LOWER HOUSE ----------------- 
        // ----------------- 3 OF A KIND, 4 OF A KIND, FULL HOUSE
        //find duplicates
        var foundTwo    = false;
        var foundThree  = false;
        var foundFour   = false;
        var dupesSum3;
        var dupesSum4;

        for(var i=0 ; i < allResults.length ; i++) {
            var dupesArray  = allResults[i];

            if(dupesArray.length == 2) {
                foundTwo    = true;
            }

            if(dupesArray.length == 3) {
                dupesSum3   = dupesArray.reduce(function(a, b) { return a+b; }, 0);
                foundThree  = true;
            }

            if(dupesArray.length == 4) {
                var tempDupesArray = dupesArray.slice();
                tempDupesArray.pop();
                dupesSum3   = tempDupesArray.reduce(function(a, b) { return a+b; }, 0);
                dupesSum4   = dupesArray.reduce(function(a, b) { return a+b; }, 0);
                foundThree  = true;
                foundFour   = true;
            }
        }

        //if the element is not set, apply shorthand if statements to change the html value to either the result or nothing
        if($allBoxes[6] != '') {
            (foundThree) ? $allBoxes[6].html(dupesSum3) : $allBoxes[6].html('0');
        }
        
        if($allBoxes[7] != '') {
            (foundFour) ? $allBoxes[7].html(dupesSum4) : $allBoxes[7].html('0');
        }

        if($allBoxes[8] != '') {
            (foundTwo && foundThree) ? $allBoxes[8].html('25') : $allBoxes[8].html('0');
        }
        
        // ----------------- SMALL STRAIGHT, LARGE STRAIGHT
        //check whether the array contains 4 or 5 unique values that follow each other up
        var straightCount   = 1;

        if((array[0] == 1 && !(array[4] == 6)) || ( !(array[0] == 1) && array[4] == 6)) {
            for(var i=0 ; i < array.length ; i++) {
                var a = array[i];
                var b = array[i+1];

                if(a == (b - 1)) {
                    ++straightCount;
                }
            }
        }

        //shorthand if statements to change score for small and large straights, if the box is not set
        if($allBoxes[9] != '') {
            (straightCount >= 4) ? $allBoxes[9].html('30') : $allBoxes[9].html('0');
        }

        if($allBoxes[10] != '') {
            (straightCount == 5) ? $allBoxes[10].html('40') : $allBoxes[10].html('0');
        }

        // ----------------- YAHTZEE
        // loop through array and check whether all values are equal
        function identical(array) {
            for(var i = 0; i < array.length - 1; i++) {
                if(array[i] !== array[i+1]) {
                    return false;
                }
            }
            return true;
        }

        //shorthand if statements to assign result to html element, if the box is not set
        if($allBoxes[11] != '') {
            (identical(array)) ? $allBoxes[11].html('50') : $allBoxes[11].html('0');
        }
        
    }

    _self.lockScore = function(scoreID) {
        _emptyCount     = 0;
        if(scoreID == 'reset') {
            _emptyCount = 0;
        }
        else {
            // remove previously locked scores
            
            var $allLockedScores = $('.lockedS')
            $allLockedScores.removeClass('lockedS');

            var $scoreTarget = $('#' + scoreID);
            $scoreTarget.toggleClass('lockedS');

            yahtzee.pause($scoreTarget);
            yahtzee.updateScore($scoreTarget.html());

            // count all empty indexes, if all are empty -> end game
            var $allBoxes   = _self.getBoxes();

            for (var i=0 ; i < $allBoxes.length ; i++) {
                if($allBoxes[i] == '') {
                    ++_emptyCount;
                    console.log('else: ' + _emptyCount);
                }
            }
            if(_emptyCount==11) {
                yahtzee.endGame();
            }
        }
    }

}

// --------------------------------------- GLOBAL VARIABLES ETC --------------------------------------- 

var yahtzee         = new Game();
var help            = new Help();
var dice            = new Dice();
var scoreSheet      = new ScoreSheet();

dice.observable     = new Observable();

dice.observable.subscribe(dice.throwDices);
dice.observable.subscribe(dice.throwCount);

// --------------------------------------- EVENT LISTENERS --------------------------------------- 

var $throwBtn       = $('#throwBtn');
var $continueBtn    = $('#continueBtn');
var $restartBtn     = $('#restartBtn');
var $helpBtn        = $('#helpBtn');
var $okBtn          = $('#okBtn');
var $allDices       = $('.dice');
var $diceID;
var $td             = $('.tableScore');
var $tdID;
        
$throwBtn.click(function() {
    dice.observable.publish();
});

$continueBtn.click(function() {
    yahtzee.resume();
});

$restartBtn.click(function() {
    yahtzee.restart();
});

$helpBtn.click(function() {
    help.openManual();
});

$okBtn.click(function() {
    help.openManual();
});

for(var i=0, ilen=$allDices.length ; i<ilen ; i++) {
    $allDices[i].addEventListener('click', function() {
        $diceID = event.currentTarget.getAttribute('id');
        dice.lockDice($diceID);
    })
}

for(var i=0, ilen=$td.length ; i<ilen ; i++) {
    $td[i].addEventListener('click', function() {
        $tdID = event.currentTarget;

        if(!$tdID.classList.contains('set')) {
            $tdID = $tdID.getAttribute('id');
            scoreSheet.lockScore($tdID);
        }
    })
}
})();