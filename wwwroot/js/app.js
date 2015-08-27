(function ($, w, d){
	var stateArray = [],
	stateData,
	currentState = {},
	overlay,
	details = false,
	selected = false;
	var tl = new TimelineLite();
	var t = new TimelineLite();
	var pinTl;

	var debug = false;

	var init = function(){
		$('svg .state').on('click',function(){
			var stateName = $(this).attr('id');
			selectState($("#" + stateName));
		})
		if(debug)
			selectState($("#LA"))

		$(d).on('click','.backToMap',resetMap);
		$(d).on('click','.pin',getPinDetails);
		$(d).on('click','.video',openVideo);
		//console.log(document.getElementById("IA").getBoundingClientRect());

		//set states to scale 0 and transformOrigin to center
		TweenMax.set($('.state'),{transformOrigin: "50% 50% 0"});
		if(!debug)
			TweenMax.to($('.state'),0,{scale:0});
		//startAnimation();

		// resize();
		loadStates();
	};

	function loadStates(){
		$.getJSON("../locations.json", function(data){
			stateData = data;
			var i = 0;
			$.each(data.states, function(){
				//console.log($(this)[0].state);
				var state = $(this)[0];
				var id = "#" + state.abbrev;
				var element = $(id);
				stateArray.push(element);

				//remove template div after all states are looped and all panels are created
				var created = createPins(state);
				if (created && i == data.states.length - 1){
					$("#detailPanelTemplate").remove();
				}
				i++;
			})
			
			if (!debug)
				startAnimation();
		})
	}

	function startAnimation() {
		//animate in states

		tl.fromTo($('.dice > img'), 2,{scale:0, rotation:-90},{scale:1,rotation:0, ease:Power3.easeOut},0);
		tl.staggerTo(stateArray, .8, {scale:1, ease: Back.easeOut}, 0.2);

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
					'opacity':0
				});
			

			//return;
			selected = true;
			t = new TimelineLite({
				onComplete:function(){
					var x = state.attr('data-x');
					var y = state.attr('data-y');
					var scale = state.attr('data-scale');

					//here i hot swap the svg path with the new svg img
					//when the animation is ready, in order to prevent any jumpy behavior
					overlay.css('opacity',1);
					state.css('opacity',0);

					//now the state overlay img is animated into place
					//and once complete, we determine where the pins should animate to
					var time = 0;
					if (!debug)
						time = 0.2;
					var svgOffset = $(".svgContainer").offset();
					var svgWidth = $(".svgContainer").width();
					var svgHeight = $(".svgContainer").height();
					var newLeft = ((svgWidth * (x / 100) + svgOffset.left) / $(w).width()) * 100;
					var newTop = ((svgHeight * (y / 100) + svgOffset.top) / $(w).height()) * 100;
					//var newTop = svgWidth * (x / 100) + svgOffset.left;
					TweenMax.to(overlay,time,{width:scale + "%",left:newLeft + "%",top:newTop + "%", svgOrigin: "0 0",onComplete:function(){
						//loop through state data object to find correct set of location pins
						for (i = 0; i < stateData.states.length; i++){
							if (state.attr('id') == stateData.states[i].abbrev){
								currentState.pins = stateData.states[i].pins;
								positionPins();//position current states pins
								dropPins();//animate pins in to place
								return;
							}
						}
					}});
					

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
			if (debug) return;
			$('.state').each(function(){
				if ($(this).attr('data-active') == 0){
					$(this).css('z-index',10);
					var time = 0;
					if (!debug)
						time = 0.3;
					t.to($(this),time,{scale:0, ease: Back.easeIn}, 0);
				}
			});

			
			
		} else {
			
			selected = false;
		}
	}

	function resetMap(){
		/*pinTl = new TimelineLite({onComplete:
			function(){
				this.clear();
				$('.pin').css('opacity',0);
			}
		});
		$.each($('.pin_' + currentState.state), function(){
			pinTl.to($(this),.5,{top:-100},0)
		})*/
		
		var path = document.getElementById(currentState.state);
		var width = path.getBoundingClientRect().width;
		var height = path.getBoundingClientRect().height;
		var offset = $("#" + currentState.state).offset();
		pinTl.reverse();
		TweenMax.to(overlay,.2,{width:width,left:offset.left,top:offset.top,onComplete:function(){
			t.reverse();
		}});
		
		$("#" + currentState.state).attr('data-active','0');
		TweenLite.to($('#details'),.5,{right:'-100%'});
		selected = false;
		details = false;
		
	}

	function createPins(state){
		var counter = 0;
		var pins = state.pins;
		$.each(pins, function(){
			//create the actual pin element that will show on the map
			var data = $(this)[0];
			var pin = $("<div>")
				.addClass('pin pin_' + state.abbrev)
				.attr({
					'data-pinid':counter,
					'data-state':state.abbrev,
					'data-x':$(this)[0].x,
					'data-y':$(this)[0].y
					})
				.append("<img src='images/pin.png' />");
			if($(this)[0].color === "red"){
				pin.addClass("red");
			}
			$('.container').append(pin);

			//clone content container and popuplate with json data
			var $elem = $("#detailPanelTemplate")
				.clone( true )
				.attr({
					'id':'panel_' + state.abbrev + '_' + counter,
					'data-state':state.abbrev,
					'data-id': counter
				});
			$('.city',$elem).text(data.city + ', ' + state.state);
			$('.a1',$elem).text(data.name);
			$('.a2',$elem).text(data.address);
			$('.a3',$elem).text(data.city + ', ' + state.abbrev + ', ' + data.zip);
			$('.video',$elem).attr('data-ytid',data.ytid);
			$('.photo',$elem).attr('data-featherlight',data.images[0]);
			$('.thumb',$elem).html('<img src="/images/thumbs/' + data.thumb + '" />');
			$("#details").append($elem);
			counter++;
		})
		return true;
	}

	function positionPins(){
		var path = document.getElementById("overlay" + currentState.state);
		var width = path.getBoundingClientRect().width;
		var height = path.getBoundingClientRect().height;
		var offset = overlay.offset();

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
		pinTl = new TimelineLite({onReverseComplete:function(){this.clear();}});
		var pinArr = [];
		$.each($('.pin_' + currentState.state), function(){
			pinArr.push($(this));
		})
		if (!debug)
			pinTl.staggerFrom(pinArr,.5,{top:-100},.1).to($(this),.5,{alpha:1},0.5)
	}

	function getPinDetails(){
		var pin = $(this);
		var state = pin.attr('data-state');
		var id = pin.attr('data-pinid');
		var panel = $('#panel_' + state + '_' + id);
		
		if (details){
			TweenLite.to($('#details'),.5,{right:'-100%',onComplete:function(){
				showDetailsPanel(panel);
			}});
			
		}else{
			showDetailsPanel(panel);
		}
		
		details = true;
	}

	function showDetailsPanel(panel){
		hideAllDetails();
		panel.css('visibility','visible');
		TweenLite.to($('#details'),.5,{right:'3%'});
	}

	function hideAllDetails(){
		$('.panel').css('visibility','hidden');
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
		//console.log($(window).width());
	}

	function openVideo(){
		var ytid = $(this).attr('data-ytid');
		var content = "<div class='embed-container'><iframe src='http://www.youtube.com/embed/" + ytid + "' frameborder='0' allowfullscreen></iframe></div>";
		$.featherlight(content);
	}
	
	w.onresize = function(){
		resize();
	}

	$.featherlight.defaults.variant = "mg";

	$(d).ready(init);
}(jQuery, window, document));