
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
        console.log(_self.score);
        
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
    var diceNrs     = document.getElementsByClassName('nr');
    var total       = 0;
    
    //loop thru dices, assign random number to each one
    for (var i=0, ilen=diceNrs.length ; i<ilen; i++) {
        var randomNr = Math.floor(Math.random() * 6 ) + 1;
        diceNrs[i].innerHTML = randomNr;
        total += randomNr;
    }
    
    yahtzee.updateScore(total);
}

function resetDices() {
    var diceNrs     = document.getElementsByClassName('nr');
    
    for (var i=0, ilen=diceNrs.length ; i<ilen; i++) {
        var randomNr = Math.floor(Math.random() * 6 ) + 1;
        diceNrs[i].innerHTML = '';
    }
}

function setCounter() {
    ++yahtzee.count;
    yahtzee.updateCount();
}

dice.subscribe(throwDices);
dice.subscribe(setCounter);

// --------------------------------------- EVENT LISTENERS --------------------------------------- 

var throwBtn    = document.getElementById('throwBtn');
var helpBtn     = document.getElementById('helpBtn');
var restartBtn  = document.getElementById('restartBtn');
        
throwBtn.addEventListener('click', function() {
    dice.publish();
});

restartBtn.addEventListener('click', function() {
    yahtzee.restart();
    resetDices();
});