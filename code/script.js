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
    var counter     = document.getElementById('throws');
    var hidden      = document.getElementById('result');
    var $buttonDiv  = $('#btns');
    var throwBtn    = document.getElementById('throwBtn');
    var scores      = document.getElementsByClassName('score');
    
    _self.updateCount = function(val) {
        if(val == 'reset') {
            _self.count = 0;
        }

        counter.innerHTML = _self.count;
        
        if(_self.count == 3) {
            _self.endGame();
        }
    }
    
    _self.updateScore = function(value) {
        if(value == 'reset') {
            total = 0;
            for (var i=0 ; i<scores.length ; i++) {
                scores[i].innerHTML = total;
            }

        } else {
            _self.score = value;
            
            for (var i=0 ; i<scores.length ; i++) {
                scores[i].innerHTML = value;
            }
        }
    }
    
    _self.endGame = function() {
        var resultText  = document.querySelector('#result p');
        
        if(_self.score > 9) {
            resultText.setAttribute('class', 'green');
        } else {
            resultText.setAttribute('class', 'red');
        }
        
        hidden.setAttribute('class', '');
        $buttonDiv.addClass('hidden');
        throwBtn.disabled = true;
    }
    
    _self.restart = function() {
        var diceNrs     = document.getElementsByClassName('nr');
        var $dices      = $('.dice');

        _self.updateCount('reset');
        _self.updateScore('reset');

        throwBtn.disabled = false;
        hidden.setAttribute('class', 'hidden');
        $buttonDiv.removeClass('hidden');

        for (var i=0, ilen=diceNrs.length ; i<ilen; i++) {
            $dices[i].setAttribute('class', 'dice unlocked');
            diceNrs[i].innerHTML = '';
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
        yahtzee.updateScore(total);
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

    //get all html score elements
    var $aces           = $('#aces');
    var $twos           = $('#twos');
    var $threes         = $('#threes');
    var $fours          = $('#fours');
    var $fives          = $('#fives');
    var $sixes          = $('#sixes');
    var $threeOfAKind   = $('#threeOfAKind');
    var $fourOfAKind    = $('#fourOfAKind');
    var $fullHouse      = $('#fullHouse');
    var $smallStraight  = $('#smallStraight');
    var $largeStraight  = $('#largeStraight');
    var $yahtzeeThrow   = $('#yahtzee');

    var upperSection    = [$aces, $twos, $threes, $fours, $fives, $sixes];
    var lowerSection    = [$threeOfAKind, $fourOfAKind, $fullHouse, $smallStraight, $largeStraight, $yahtzeeThrow];
    var allSections     = [$aces, $twos, $threes, $fours, $fives, $sixes, $threeOfAKind, $fourOfAKind, $fullHouse, $smallStraight, $largeStraight, $yahtzeeThrow];
    

    _self.calculateScores = function(array) {
        var acesResult, twosResult, threesResult, foursResult, fivesResult, sixesResult;
        var allResults      = [acesResult, twosResult, threesResult, foursResult, fivesResult, sixesResult];
        array               = array.sort();

        //collect results
        for(var i=0 ; i < allResults.length ; i++) {
            allResults[i] = array.filter(function(val) { return val == (i+1); });
        }

        // ----------------- UPPER HOUSE ----------------- 
        //calculate sum for results and assign sum to html elements
        for(var i=0 ; i < allResults.length ; i++) {
            var tempArray   = allResults[i];
            var tempElement = upperSection[i];
            var tempSum     = allResults[i].reduce(function(a, b) { return a+b; }, 0);
            
            tempElement.html(tempSum);
        }

        // ----------------- LOWER HOUSE ----------------- 
        // ----------------- 3 OF A KIND
        // ----------------- 4 OF A KIND
        // ----------------- FULL HOUSE

        //find duplicates
        var foundThree  = false;
        var foundTwo    = false;

        for(var i=0 ; i < allResults.length ; i++) {
            var dupesArray  = allResults[i];
            var dupesSum;

            if(dupesArray.length == 2) {
                foundTwo  = true;
            }

            if(dupesArray.length == 3) {
                dupesSum    = allResults[i].reduce(function(a, b) { return a+b; }, 0);
                foundThree  = true;

                $threeOfAKind.html(dupesSum);
            }

            if(dupesArray.length == 4) {
                dupesSum = allResults[i].reduce(function(a, b) { return a+b; }, 0);
                $fourOfAKind.html(dupesSum);
            }
        }

        if(foundTwo && foundThree) {
            $fullHouse.html('25');
        }

        // ----------------- SMALL STRAIGHT
        // ----------------- LARGE STRAIGHT
        // ----------------- YAHTZEE

        //check whether the array contains 4 or 5 unique values that follow each other up
        var straightCount   = 1;

        for(var i=0 ; i < array.length ; i++) {
            var a = array[i];
            var b = array[i+1];

            if(a == (b - 1)) {
                ++straightCount;
            }
        }

        //check whether the array contains 5 numbers of the same value
        if(array[0] == array[1] == array[2] == array[3] == array[4]) {
            $yahtzeeThrow.html('50');
        }
        else {
            $yahtzeeThrow.html('');
        }

        //change score for small and large straights
        if(straightCount >= 4) {
            $smallStraight.html('30');
        }
        else {
            $smallStraight.html('');
        }

        if(straightCount == 5) {
            $largeStraight.html('40');
        }
        else {
            $largeStraight.html('');
        }
    }

    _self.lockScore = function(scoreID) {
        var $scoreTarget = $('#' + scoreID);
        $scoreTarget.toggleClass('locked');
    }

    _self.empty = function() {
        //assign empty value to score elements
        for(var i=0 ; i < allSections.length ; i++) {
            allSections[i].html('');
        }
    }

}

ScoreSheet();

// --------------------------------------- GLOBAL VARIABLES ETC --------------------------------------- 

var yahtzee         = new Game();
var help            = new Help();
var dice            = new Dice();
var scoreSheet      = new ScoreSheet();

dice.observable     = new Observable();

dice.observable.subscribe(dice.throwDices);
dice.observable.subscribe(dice.throwCount);

// --------------------------------------- EVENT LISTENERS --------------------------------------- 

var $throwBtn   = $('#throwBtn');
var $restartBtn = $('#restartBtn');
var $helpBtn    = $('#helpBtn');
var $okBtn      = $('#okBtn');
var $allDices   = $('.dice');
var $diceID;
var $td         = $('.tableScore');
var $tdID;
        
$throwBtn.click(function() {
    dice.observable.publish();
});

$restartBtn.click(function() {
    yahtzee.restart();
    scoreSheet.empty();
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
        $tdID = event.currentTarget.getAttribute('id');
        scoreSheet.lockScore($tdID);
    })
}

})();
