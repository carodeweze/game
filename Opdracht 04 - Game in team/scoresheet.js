define(['game'], function (Game) {
    
    var ScoreSheet = function() {
            var _self = this;
            var yahtzee = new Game();

            //get all html score elements
            _self.getScoreBoxes = function() {
                var $allBoxesArray  = [$('#aces'), $('#twos'), $('#threes'), $('#fours'), $('#fives'), $('#sixes'), $('#threeOfAKind'), $('#fourOfAKind'), $('#fullHouse'), $('#smallStraight'), $('#largeStraight'), $('#yahtzeeBox')];

                // loop thru array and filter out set slots (so that they won't be changed)
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
                var $allBoxes       = _self.getScoreBoxes();
                array.sort();

                //collect results in array
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

                    switch(dupesArray.length) {
                        case 2:
                            foundTwo    = true;
                            break;
                        case 3:
                            dupesSum3   = dupesArray.reduce(function(a, b) { return a+b; }, 0);
                            foundThree  = true;
                            break;
                        case 4:
                            var tempDupesArray = dupesArray.slice();
                            tempDupesArray.pop();
                            dupesSum3   = tempDupesArray.reduce(function(a, b) { return a+b; }, 0);
                            dupesSum4   = dupesArray.reduce(function(a, b) { return a+b; }, 0);
                            foundThree  = true;
                            foundFour   = true;
                            break;
                    }
                }

                //if the element is not set, apply shorthand if statements to change the html value to either the result or 0
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
                
                var _emptyCount     = 0;
                if(scoreID == 'reset') {
                    _emptyCount = 0;
                }
                else {
                    // remove previously locked target and add locked class to target
                    var $allLockedScores = $('.lockedS')
                    $allLockedScores.removeClass('lockedS');
                    var $scoreTarget    = $('#' + scoreID);
                    
                    if($scoreTarget.html()) {
                        $scoreTarget.addClass('lockedS');

                        yahtzee.pause();
                        yahtzee.updateScore($scoreTarget.html());

                        // count all empty indexes, if all are empty -> end game
                        var $allBoxes   = _self.getScoreBoxes();

                        for (var i=0 ; i < $allBoxes.length ; i++) {
                            if($allBoxes[i] == '') {
                                ++_emptyCount;
                            }
                        }
                        if(_emptyCount==11) {
                            yahtzee.endGame();
                        }
                    }
                }
            }

        }
 
    return ScoreSheet;
    
});


        

