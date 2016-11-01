define([], function () {
    
    var Observable = function() {
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
 
    return Observable;
    
});




