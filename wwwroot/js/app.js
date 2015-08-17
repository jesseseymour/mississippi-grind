(function ($, w, d){
	var init = function(){
		loadStates();
	}();

	function loadStates(){
		$.getJSON("../locations.json", function(data){
			$.each(data, function(){
				console.log($(this)[0].state);
			})
		})
	}
}(jQuery, window, document));