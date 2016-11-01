define([], function () {
    
    var Help = function() {
        var _self = this;

        _self.openManual = function() {
            var $helpDiv    = $('#helpDiv');
            var $overlay    = $('#overlayDiv');
            
            $helpDiv.toggleClass('hidden');
            $overlay.toggleClass('overlay');
        }
    }
 
    return Help;
    
});