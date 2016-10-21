
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
    var counter = document.getElementById('throws');
    var hidden      = document.getElementById('result');
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
        throwBtn.disabled = true;
    }
    
    _self.restart = function() {
        _self.updateCount('reset');
        _self.updateScore('reset');
        throwBtn.disabled = false;
        hidden.setAttribute('class', 'hidden');
    }
    
}

// --------------------------------------- GLOBAL VARIABLES --------------------------------------- 

dice        = new Observable();
yahtzee     = new Game();

// --------------------------------------- FUNCTIONS --------------------------------------- 

function throwDices() {
    var $allDices       = $('.nr');
    var $unlockedDices  = $('.unlocked .nr');
    var total           = 0;
    
    //loop thru unlocked dices, assign random number
    for (var i=0, ilen=$unlockedDices.length ; i<ilen; i++) {
        var randomNr = Math.floor(Math.random() * 6 ) + 1;
        $unlockedDices[i].innerHTML = randomNr;
    }
    
    //loop thru all dices, calculate total value
    for (var i=0, ilen=$allDices.length ; i<ilen; i++) {
        value = parseInt($allDices[i].innerHTML);
        total += value;
    }
    
    yahtzee.updateScore(total);
}

function resetDices() {
    var diceNrs     = document.getElementsByClassName('nr');
    var $dices      = $('.dice');
    
    for (var i=0, ilen=diceNrs.length ; i<ilen; i++) {
        $dices[i].setAttribute('class', 'dice unlocked');
        diceNrs[i].innerHTML = '';
    }
}

function lockDice(diceID) {
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

function setCounter() {
    ++yahtzee.count;
    yahtzee.updateCount();
}

function help() {
    var $helpDiv    = $('#helpDiv');
    var $body       = $('body');
    
    $helpDiv.toggleClass('hidden');
}

dice.subscribe(throwDices);
dice.subscribe(setCounter);

// --------------------------------------- EVENT LISTENERS --------------------------------------- 

var $throwBtn    = $('#throwBtn');
var $restartBtn  = $('#restartBtn');
var $helpBtn     = $('#helpBtn');
var $okBtn       = $('#okBtn');
var $allDices    = $('.dice');
        
$throwBtn.click(function() {
    dice.publish();
});

$restartBtn.click(function() {
    yahtzee.restart();
    resetDices();
});

$helpBtn.click(function() {
    help();
});

$okBtn.click(function() {
    help();
});

for(var i=0, ilen=$allDices.length ; i<ilen ; i++) {
    $allDices[i].addEventListener('click', function() {
        diceID = event.currentTarget.getAttribute('id');
        lockDice(diceID);
    })
}