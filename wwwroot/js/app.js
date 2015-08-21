(function ($, w, d){
	var stateArray = [];
	var selected = false;
	var tl = new TimelineLite();
	var t = new TimelineLite();

	var init = function(){
		
		resize();
		loadStates();
		$(d).on('click','.state > svg',function(){
			selectState($(this).parent());
		})
	}();

	function loadStates(){
		$.getJSON("../locations.json", function(data){
			$.each(data.states, function(){
				//console.log($(this)[0].state);
				var state = $(this)[0];
				var id = "#" + state.abbrev;
				var element = $(id);
				stateArray.push(element);
				setPins(state,element);
			})
			
			//startAnimation();
		})
	}

	function setPins(state,element){
		var pins = state.pins;
		var counter = 0;
		$.each(pins, function(){
			//console.log($(this)[0]);
			var pin = $('<div>').addClass('pin');
			pin.attr({'data-id':counter});
			pin.css({'left':$(this)[0].x + '%','top':$(this)[0].y + '%'});
			//in.css('left',$(this));
			element.append(pin);
			counter++;
		});
	}

	function startAnimation() {
		//animate in states
		tl.staggerTo(stateArray, .8, {scale:1, ease: Back.easeOut}, 0.2);

		//river
		tl.to($('.river'), 4.0, {height:'108%'})
	}

	function selectState(state){
		if (!selected){
			state.attr('data-active','1');
			t = new TimelineLite;
			t.to(state,1,{scale:1.5,top:'50%',left:'50%'});
			$('.state').each(function(){
				if ($(this).attr('data-active') == 0){
					TweenMax.to($(this),.5,{scale:0, ease: Back.easeIn});
				}
			});
			selected = true;
		} else {
			t.reverse();
			$('.state').each(function(){
				if ($(this).attr('data-active') == 0){
					TweenMax.to($(this),.5,{scale:1, ease: Back.easeOut});
				}
			});
			state.attr('data-active','0');
			selected = false;
		}

		//console.log("click");
	}

	function resize() {
		var s = $('.states');
		var maxHeight = 755;
		var maxWidth = 709;
		var currW = s.width();
		var currH = s.height();
		var ratio = 0;
		// 
		// var maxHeight = 755;
		// var maxWidth = 709;
		// var ratio = maxHeight / maxWidth;
		// s.height(currW * ratio);

		// if(currH > $('.container').height() * 0.8){
		// 	s.addClass('alt');
		// 	ratio = maxHeight / maxWidth;
		// 	s.height(currW * ratio);
		// 	return;
		// }

		//s.removeClass('alt');
		var ratio = maxWidth / maxHeight;
		s.width(currH * ratio);


	}

	
	w.onresize = function(){
		resize();
	}
}(jQuery, window, document));