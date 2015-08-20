(function ($, w, d){
	var stateArray = [];
	var init = function(){
		
		resize();
		loadStates();
	}();

	function loadStates(){
		$.getJSON("../locations.json", function(data){
			$.each(data.states, function(){
				//console.log($(this)[0].state);
				var state = $(this)[0];
				var id = "#" + state.abbrev;
				var element = $(id);
				stateArray.push(element);
				//TweenMax.to(element, 1, {scale:1})
			})
			TweenMax.staggerTo(stateArray, .8, {scale:1, ease: Back.easeOut}, 0.2);
		})


	}

	function resize() {
		var s = $('.states');
		
		var currW = s.width();
		var maxHeight = 755;
		var maxWidth = 709;
		var ratio = maxHeight / maxWidth;
		s.height(currW * ratio);
	}

	
	w.onresize = function(){
		resize();
	}
}(jQuery, window, document));