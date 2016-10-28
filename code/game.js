define([], function () {
    
    var Game = function() {
            var _self = this;

            _self.count         = 0;
            _self.score         = 0;

            // html elements
            var $resultEl       = $('#result');
            var $throwCounter   = $('#throws');
            var $continueEl     = $('#continue');
            var $buttonDiv      = $('#btns');
            var $scores         = $('.score');
            var $diceNrs        = $('.nr');
            var $dices          = $('.dice');
            var $tableScores    = $('.tableScore');

            //reset count, assign count value to html count element and if count = 3 pause game
            _self.updateCount = function(val) {
                if(val == 'reset') {
                    _self.count = 0;
                } else {
                    ++_self.count;
                }
                
                $throwCounter.html(_self.count);

                if(_self.count == 3) {
                    _self.pause();
                }
            }

            _self.updateScore = function(value) {
                if(value == 'reset') {
                    //reset score
                    for (var i=0 ; i<$scores.length ; i++) {
                        $scores[i].innerHTML = '0';
                    }
                }
                else {
                    //collect locked and set scores
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
                        _self.score     = allScores.reduce(function(a, b) { return a+b; }, 0);
                    }
                    else {
                        _self.score = $('.lockedS').html();
                    }

                    for (var i=0 ; i<$scores.length ; i++) {
                        $scores[i].innerHTML = _self.score;
                    }
                }
            }

            _self.pause = function() {
                // only enable continue button if a score element is locked
                if($('.lockedS').length == 1) {
                    $continueEl.removeClass();
                    $buttonDiv.addClass('hidden');
                    $('#continueInfo').addClass('hidden');  //'pick a box' (hidden)
                    $('#continueP').removeClass();          //'your current score is: ...'
                    $('#continueBtn').prop('disabled', false);
                }
                else {
                    $continueEl.removeClass();
                    $buttonDiv.addClass('hidden');
                    $('#continueInfo').removeClass();       //'pick a box'
                    $('#continueP').addClass('hidden');     //'your current score is: ...' (hidden)
                    $('#continueBtn').prop('disabled', true);
                }
            }

            _self.resume = function() {
                //hide and show html elements, reset count, set classes
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
 
    return Game;
    
});




