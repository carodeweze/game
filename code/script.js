
// --------------------------------------- CLASSES

var Observable = function() {

    var _self = this;

    _self.data;               //contains data
    _self.subscribers = [];   //all callback functions

    _self.publish = function() {
        for (var i in _self.subscribers) {
            _self.subscribers[i]();
        }
    }

    _self.subscribe = function(callback) {
        _self.subscribers.push(callback);
    }

//    _self.unsubscribe = function(callback) {
//        for (var subscriberKey in _self.subscribers) {
//            if(_self.subscribers[subscriberKey] == callback) {
//                // delete _.self.subscribers...
//            }
//        }
//    }
        
}

var Game = function() {
    
    var _self = this;
    
    _self.count = 0;
    
    // html elements
    var hidden      = document.getElementById('result');
    var throwBtn    = document.getElementById('throwBtn');
    
    _self.updateCount = function(val) {

        var counter = document.getElementById('throws');

        if(val) {
            _self.count = 0;
            console.log("counter reset");
        }

        counter.innerHTML = _self.count;
        
        if(_self.count == 3) {
            _self.endGame();
        }
    }
    
    _self.endGame = function() {
        hidden.setAttribute('class', '');
        throwBtn.disabled = true;
    }
    
    _self.restart = function() {
        _self.updateCount(true);
        throwBtn.disabled = false;
        hidden.setAttribute('class', 'hidden');
    }
    
}

// --------------------------------------- GLOBAL VARIABLES

dice        = new Observable();
yahtzee     = new Game();

// --------------------------------------- FUNCTIONS

function throwDices() {
    var diceNrs     = document.getElementsByClassName('nr');
    var diceNrsLen  = diceNrs.length;
    var scores      = document.getElementsByClassName('score');
    var total       = 0;
    
    for (var i=0; i<diceNrsLen; i++) {
        var randomNr = Math.floor(Math.random() * 6 ) + 1;
        diceNrs[i].innerHTML = randomNr;
        total += randomNr;
    }
    
    for (var i=0 ; i<scores.length ; i++) {
        scores[i].innerHTML = total;
    }
}

function setCounter() {
    ++yahtzee.count;
    yahtzee.updateCount();
}

dice.subscribe(throwDices);
dice.subscribe(setCounter);

// --------------------------------------- EVENT LISTENERS

var throwBtn    = document.getElementById('throwBtn');
var helpBtn     = document.getElementById('helpBtn');
var restartBtn  = document.getElementById('restartBtn');
        
throwBtn.addEventListener('click', function() {
    dice.publish();
});

restartBtn.addEventListener('click', yahtzee.restart);