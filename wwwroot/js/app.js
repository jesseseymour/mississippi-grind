(function ($, w, d){
	var stateArray = [],
	stateData,
	currentState = {},
	overlay,
	selected = false;
	var tl = new TimelineLite();
	var t = new TimelineLite();
	var pinTl;

	var init = function(){
		$('svg path').on('click',function(){
			var stateName = $(this).attr('id');
			selectState($("#" + stateName));
		})

		$(d).on('click','.stateOverlay',resetMap);
		//console.log(document.getElementById("IA").getBoundingClientRect());
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
				createPins(state);
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

	function selectState(state){//state is jquery dom element

		if (!selected){
			
			state.attr('data-active','1');
			currentState.state = state.attr('id');

			//get offset and bounding box dimensions of selected state
			var path = document.getElementById(currentState.state);
			var width = path.getBoundingClientRect().width;
			var height = path.getBoundingClientRect().height;
			var offset = state.offset();
			var px = $("#test");
			//console.log("width: " + width + " | height: " + height + " | offset left: " + offset.left + " | offset top: " + offset.top);
			
			// px.css({
			// 	left:offset.left,
			// 	top: offset.top,
			// 	width: width,
			// 	height: height
			// })

			//now lets create a new svg and place it over the selected state
			overlay = $('#overlay' + currentState.state)
				.css({
					'left':offset.left,
					'top':offset.top,
					'width':width,
					'opacity':1
				});
			TweenLite.to(state,0,{opacity:0});

			//return;
			selected = true;
			t = new TimelineLite({
				onComplete:function(){
					//loop through state data object to find correct set of location pins
					for (i = 0; i < stateData.states.length; i++){
						if (state.attr('id') == stateData.states[i].abbrev){
							currentState.pins = stateData.states[i].pins;
							positionPins();//position current states pins
							dropPins();
							return;
						}
					}

				},
				onReverseComplete:function(){
					TweenLite.to(state,0,{opacity:0.75});
					overlay.css({
						left: -1000,
						top: -1000
					})
				}
			});
			//state.css('z-index',100);
			$('.state').each(function(){
				if ($(this).attr('data-active') == 0){
					$(this).css('z-index',10);
					//t.to($(this),.3,{scale:0, ease: Back.easeIn}, 0);
				}
			});

			var x = state.attr('data-x') + "%";
			var y = state.attr('data-y') + "%";
			var scale = state.attr('data-scale');
			t.to(overlay,.2,{scale:scale,left:x,top:y, svgOrigin: "0 0"});
			
		} else {
			
			selected = false;
		}
	}

	function resetMap(){
		pinTl = new TimelineLite({onComplete:
			function(){
				this.clear();
				$('.pin').css('opacity',0);
			}
		});
		$.each($('.pin_' + currentState.state), function(){
			pinTl.to($(this),.5,{top:-100},0)
		})
		t.reverse();
		$("#" + currentState.state).attr('data-active','0');

		selected = false;
	}

	function createPins(state){
		var counter = 0;
		var pins = state.pins;
		$.each(pins, function(){
			var pin = $("<div>")
				.addClass('pin pin_' + state.abbrev)
				.attr({
					'data-pinid':counter,
					'data-x':$(this)[0].x,
					'data-y':$(this)[0].y
					});
			$('.container').append(pin);
			counter++;
		})
	}

	function positionPins(){
		var path = document.getElementById("overlay" + currentState.state);
		var width = path.getBoundingClientRect().width;
		var height = path.getBoundingClientRect().height;
		var offset = overlay.offset();

		console.log(width);

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

	function dropPins(){ //drop pins onto map
		pinTl = new TimelineLite({onComplete:function(){this.clear();}});
		$.each($('.pin_' + currentState.state), function(){
			pinTl.from($(this),.5,{top:-100},.3).to($(this),.5,{alpha:1},0)
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
			positionPins();
		}
		console.log($(window).width());
	}

	
	w.onresize = function(){
		resize();
	}

	
}(jQuery, window, document));