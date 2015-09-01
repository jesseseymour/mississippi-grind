(function ($, w, d){
	var stateArray = [],
	stateData,
	currentState = {},
	overlay,animating = false,
	details = false,
	selected = false;
	var tl = new TimelineLite({onComplete: function(){animating = false;}});
	var t = new TimelineLite();
	var pinTl;
	var mobile, count = 0;

	var debug = false;

	var init = function(){
		
		$('svg .state').on('click',function(){
			var stateName = $(this).attr('id');
			selectState($("#" + stateName));
		})
		if(debug)
			selectState($("#IA"))

		$(d).on('click','.backToMap',resetMap);
		$(d).on('click','.pin',getPinDetails);
		//$(d).on('click','.video',openVideo);
		//console.log(document.getElementById("IA").getBoundingClientRect());

		//set states to scale 0 and transformOrigin to center
		TweenMax.set($('.state'),{transformOrigin: "50% 50% 0"});
		if(!debug)
			TweenMax.to($('.state'),0,{scale:0});
		//startAnimation();

		resize();
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
		$(".scaling-svg-container").css('visibility','visible');
		//animate in states
		animating = true;
		tl.fromTo($('.dice > img'), 1,{scale:0, rotation:-90},{scale:1,rotation:0, ease:Power3.easeOut},0);
		tl.staggerTo(stateArray, .4, {scale:1, ease: Back.easeOut}, 0.2);
		tl.addLabel('afterStates');
		tl.staggerFrom($('.pin.red'), .7, {top:$('.scaling-svg-container').offset().top * -1 - 200, ease:Power3.easeOut}, .2);

		//animate river
		var river = document.getElementById('riverPath'), length;
		var riverObj = {
			length:0,
			pathLength:river.getTotalLength() - 95
		};
		tl.to(riverObj, 3, {
			length:riverObj.pathLength, 
			onStart:function(){
				river.style.display = 'block';
			},
			onUpdate:drawLine, 
			onUpdateParams:[riverObj,river], 
			ease:Linear.easeNone
		}, 'afterStates');
		
	}

	function drawLine(obj,orig) {
	  orig.style.strokeDasharray = [obj.length,obj.pathLength].join(' ');
	};



	function selectState(state){//state is jquery dom element
		if (animating) return;
		if (!selected){
			
			state.attr('data-active','1');
			currentState.state = state.attr('id');

			//get offset and bounding box dimensions of selected state
			var path = document.getElementById(currentState.state);
			var width = path.getBoundingClientRect().width;
			var height = path.getBoundingClientRect().height;
			var offset = state.offset();
			var px = $("#test");
			
			if (mobile){
				$('.panel').each(function(){
					if($(this).attr('data-state') == currentState.state){
						$(this).fadeIn();
					}else{
						$(this).fadeOut();
					}
				})
			}

			//now lets create a new svg and place it over the selected state
			overlay = $('#overlay' + currentState.state)
				.css({
					'left':offset.left,
					'top':offset.top + document.getElementById("container").scrollTop,
					'width':width,
					'opacity':0
				});
			
			selected = true;
			t = new TimelineLite({
				onComplete:function(){
					var x = state.attr('data-x');
					var y = state.attr('data-y');
					var scale = state.attr('data-scale');
					if (mobile){
						switch (state.attr('id')){
							case 'IL':
							case 'MS':
								scale = 50;
								break;
							default:
								scale = 80;
								break;
						}
					}
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
					var newTop = ((svgHeight * (y / 100) + svgOffset.top + document.getElementById("container").scrollTop) / $(w).height()) * 100;
					if (!mobile){
						newTop = newTop + "%";
					}else{
						var logo = document.getElementById('logo').getBoundingClientRect();
						newTop = logo.top + logo.height + 100 + document.body.scrollTop;
					}
					TweenMax.to(overlay,time,{width:scale + "%",left:newLeft + "%",top:newTop, svgOrigin: "0 0",onComplete:function(){
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
					TweenLite.to(state,0,{opacity:1});
					overlay.css({
						left: -1000,
						top: -1000
					})
				}
			});
			t.to($('#river, .pin.red'), .5, {opacity:0});
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
		$(".panel").show();
		if (mobile){
			$("body").scrollTo($("#svgMap"),600);
			$(".panel").hide();
		}

		var path = document.getElementById(currentState.state);
		var width = path.getBoundingClientRect().width;
		var height = path.getBoundingClientRect().height;
		var offset = $("#" + currentState.state).offset();
		var newTop = offset.top + document.getElementById("container").scrollTop;
		pinTl.reverse();
		TweenMax.to(overlay,.2,{width:width,left:offset.left,top:newTop,onComplete:function(){
			t.reverse();
		}});
		
		$("#" + currentState.state).attr('data-active','0');
		if (!mobile) TweenLite.to($('#details'),.5,{right:'-100%'});
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
			
			if (data.ytid == "") {
				$('.video',$elem).hide();
			}else
			{
				//$('.video',$elem).attr('data-fancybox-href',"http://www.youtube.com/embed/" + data.ytid);
				$('.video',$elem).on('click', function(){
					$.fancybox.open({
						href: "http://www.youtube.com/embed/" + data.ytid
					},
					{
						type: 'iframe',
						padding: 4,
						margin: 40
					})
				})
			}
			if (data.images.length) {
				var group = [];
				for (var i = 0; i < data.images.length; i++){
					var img = {href: 'images/locations/' + data.images[i]};
					group.push(img)
				}
				$('.photo',$elem).on('click',function(){
					$.fancybox.open(group,{
						padding: 0,
						margin: [40, 100, 40, 100]
					})
				})
			}else{
				$('.photo',$elem).hide();
			}
			
			$('.share a', $elem).attr('href',data.url);
			$('.thumb',$elem).html('<img src="/images/thumbs/' + data.thumb + '" />');
			$("#details").append($elem);
			counter++;
		})
		return true;
	}

	function positionRiver(){
		var river = document.getElementById('river').getBoundingClientRect();
		var map = document.getElementById('svgMap').getBoundingClientRect();

		var newWidth = map.width * 0.466;
		var newHeight = newWidth * 2.44505907782121;

		document.getElementById('river').style.width = newWidth;
		document.getElementById('river').style.height = newHeight;
		document.getElementById('river').style.left = map.left + ( map.width * 0.2849869862426 );
		document.getElementById('river').style.top = map.top - ( map.height * 0.122 ) + document.body.scrollTop;


		
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
			var newTop = offset.top + document.getElementById("container").scrollTop + percY - $(this).height();

			$(this).css({
				'left':newLeft,
				'top':newTop
			})
		})
	}

	function dropPins(){ //drop pins onto map
		pinTl = new TimelineLite({
			onReverseComplete:function(){
				this.clear();
			},
			onComplete:function(){
				if(!mobile){
					pinArr[0].trigger('click');
				}
			}
		});
		var pinArr = [];
		$.each($('.pin_' + currentState.state), function(){
			pinArr.push($(this));
		})
		//if (!debug)
			pinTl.staggerFrom(pinArr,.5,{top:-100},.1).to($(this),.5,{alpha:1},0.5)
	}

	function getPinDetails(){
		if($(this).hasClass('red')){
			var parent = $(this).attr('data-parent').toUpperCase();
			$("#" + parent).trigger('click');
			return;
		}
		var pin = $(this);
		var state = pin.attr('data-state');
		var id = pin.attr('data-pinid');
		var panel = $('#panel_' + state + '_' + id);
		if (mobile){
			$("body").scrollTo(panel,600);
			return;
		}
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
		if(mobile) return;
		hideAllDetails();
		panel.css('visibility','visible');
		TweenLite.to($('#details'),.5,{right:'3%'});
	}

	function hideAllDetails(){
		$('.panel').css('visibility','hidden');
	}

	function resize() {
		
		var isMobile = mobile;

		if ($('.pixel').css('visibility') == 'hidden'){
			mobile = false;
		}
		else
		{
			mobile = true;
		}
		if (isMobile != mobile ){
			if(count>0) resetMap();
			count++;

		}
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

		//console.log(document.getElementById('svgMap').getBoundingClientRect());
		positionRiver();
	}

	
	
	w.onresize = function(){
		resize();
	}
	
	$.extend($.fancybox.defaults.tpl, {
		wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div><div class="logo"><div class="dice"><img class="die1" src="images/die-1.png" alt="" /><img class="die2" src="images/die-2.png" alt="" /></div><img src="images/mississippi-grind-we-cant-lose.png" alt="Mississippi Grind. We Can\'t Lose" /></div>'
	});
	$.fancybox.defaults.nextEffect = "none";
	$.fancybox.defaults.prevEffect = "none";
	$(d).ready(init);
}(jQuery, window, document));