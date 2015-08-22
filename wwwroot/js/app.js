(function ($, w, d){
	var stateArray = [];
	var selected = false;
	var tl = new TimelineLite();
	var t = new TimelineLite();

	var init = function(){
		$('svg path').on('click',function(){
			var stateName = $(this).attr('id');
			selectState($("#" + stateName));

		})

		//set states to scale 0 and transformOrigin to center
		TweenMax.set($('.state'),{transformOrigin: "50% 50% 0"});
		//TweenMax.to($('.state'),0,{scale:0});
		//startAnimation();

		// resize();
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
				setPins(state,element);
			})
			
			startAnimation();
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
		//tl.staggerTo(stateArray, .8, {scale:1, ease: Back.easeOut}, 0.2);

		//river
		tl.to($('.river'), 4.0, {height:'108%'})
	}

	function selectState(state){
		if (!selected){
			state.attr('data-active','1');
			t = new TimelineLite({
				onComplete:function(){
					var offset = state.offset();
					//console.log(offset);
				}
			});
			
			state.css({
				'z-index':100
			});
			$('.state').each(function(){
				
				if ($(this).attr('data-active') == 0){
					$(this).css({
						'z-index':10
					});
					t.to($(this),.5,{scale:0, ease: Back.easeIn}, 0);
				}
			});
			var x = state.attr('data-x');
			var y = state.attr('data-y');
			var scale = state.attr('data-scale');
			t.to(state,.5,{scale:scale,xPercent:x,yPercent:y, svgOrigin: "0 0"});
			selected = true;
		} else {
			t.reverse();
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