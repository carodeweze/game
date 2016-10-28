define(['scoresheet', 'game'], function (ScoreSheet, Game) {
    
    var Dice = function() {
        var _self = this;
        var scoreSheet = new ScoreSheet();

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
            var $clickedDice    = $("#" + diceID);
            var $clickedDiceVal = $("#" + diceID + " span");
            
            if($clickedDiceVal != '') {
                if($clickedDice.hasClass('locked')) {
                    $clickedDice.removeClass('locked');
                    $clickedDice.addClass('unlocked');
                } else {
                    $clickedDice.addClass('locked');
                    $clickedDice.removeClass('unlocked');
                }
            }
        }
    }
 
    return Dice;
    
});


