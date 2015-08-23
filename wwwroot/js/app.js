(function ($, w, d){
	var stateArray = [],
	stateData,
	currentState = {},
	selected = false;
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
			stateData = data;
			$.each(data.states, function(){
				//console.log($(this)[0].state);
				var state = $(this)[0];
				var id = "#" + state.abbrev;
				var element = $(id);
				stateArray.push(element);
				//setPins(state,element);
			})
			
			startAnimation();
		})
	}

	function startAnimation() {
		//animate in states
		//tl.staggerTo(stateArray, .8, {scale:1, ease: Back.easeOut}, 0.2);

		//river
		//tl.to($('.river'), 4.0, {height:'108%'})
	}

	function selectState(state){

		if (!selected){
			selected = true;
			state.attr('data-active','1');
			currentState.state = state.attr('id');
			t = new TimelineLite({
				onComplete:function(){
					var offset = state.offset();
					//var pins;
					//console.log(state.getBoundingClientRect());
					//set pins
					for (i = 0; i < stateData.states.length; i++){
						if (state.attr('id') == stateData.states[i].abbrev){
							currentState.pins = stateData.states[i].pins;
							createPins(); //place pins on selected state
							return;
						}
					}
					
					
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
			
		} else {
			t.reverse();
			state.attr('data-active','0');
			selected = false;
		}

		//console.log("click");
	}

	function createPins(){
		var pins = currentState.pins;
		var counter = 0;
		$.each(pins, function(){
			var pin = $("<div>")
				.addClass('pin pin_' + currentState.state)
				.attr({
					'data-pinid':counter,
					'data-x':$(this)[0].x,
					'data-y':$(this)[0].y
					})
				.css({
					'left':0,
					'top':0
				});
			$('.container').append(pin);
			counter++;
		})
		setPins();
	}

	function setPins(){
		var path = document.getElementById(currentState.state);
		var width = path.getBoundingClientRect().width;
		var height = path.getBoundingClientRect().height;
		var offset = $("#" + currentState.state).offset();
		$.each($('.pin_' + currentState.state), function(){
			var percX = width * $(this).attr('data-x');
			var percY = height * $(this).attr('data-y');
			var newLeft = offset.left + percX - ($(this).width() / 2);
			var newTop = offset.top + percY - $(this).height();

			$(this).css({
				'left':newLeft,
				'top':newTop
			})
		})
	}

	function resize() {
		var s = $('.states');
		var maxHeight = 755;
		var maxWidth = 709;
		var currW = s.width();
		var currH = s.height();
		var ratio = 0;
		var ratio = maxWidth / maxHeight;
		s.width(currH * ratio);
		if(selected){
			setPins();
		}
	}

	
	w.onresize = function(){
		resize();
	}
}(jQuery, window, document));