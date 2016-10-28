
require(['help', 'observable', 'dice', 'scoresheet', 'game'], function(Help, Observable, Dice, ScoreSheet, Game){
    
    (function Yahtzee() {
        
        // --------------------------------------- GLOBAL VARIABLES ETC --------------------------------------- 

        var yahtzee         = new Game();
        var dice            = new Dice();
        var manual          = new Help();
        var scoreSheet      = new ScoreSheet();

        dice.observable     = new Observable();
        dice.observable.subscribe(dice.throwDices);
        
        
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
            yahtzee.updateCount();
        });

        $continueBtn.click(function() {
            yahtzee.resume();
        });

        $restartBtn.click(function() {
            yahtzee.restart();
            scoreSheet.lockScore('reset');
        });

        $helpBtn.click(function() {
            manual.openManual();
        });

        $okBtn.click(function() {
            manual.openManual();
        });
        
        if(yahtzee.count != 0) {
        
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
        }
        
        
    })();

});