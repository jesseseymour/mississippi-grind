(function ($, w, d){
	var stateArray = [],
	stateData,
	currentState = {},
	overlay,animating = false,
	details = false,
	selected = false;
	var tl = new TimelineLite({onComplete: function(){animating = false;goToDeepLink();}});
	var t = new TimelineLite();
	var pinTl;
	var mobile, count = 0;
	var spinChip = false;
	var bounceArrow = false;
	var deepLink = false;

	var debug = false;

	var init = function(){
		
		$('svg .state').on('click',function(){
			var stateName = $(this).attr('id');
			selectState($("#" + stateName));
		})
		if(debug)
			selectState($("#AR"))

		$(d).on('click','.backToMap, .closeMap',resetMap);
		$(d).on('click','.pin',getPinDetails);
		$('.watchTrailer').on('click',function(){
			$.fancybox.open({
				href: "http://www.youtube.com/embed/7p1MNB6TNQU?autoplay=1"
			},
			{
				type: 'iframe',
				padding: 4,
				margin: 40
			})
		})
		$('#feelingLucky').mouseenter(function(){
			bounceCommentArrow();
			spinPokerChip();
			})
			.mouseleave(function(){
				bounceArrow = false;
				spinChip = false;
			});
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
					var yoffset = 100;
					var xoffset = 0;
					if (mobile){
						switch (state.attr('id')){
							case 'IL':
								scale = 50;
								yoffset = 70;
								x = 30;
							case 'MS':
								scale = 50;
								yoffset = 20;
								x = 30;
								break;
							default:
								scale = 80;
								break;
						}
					}
					//here i hot swap the svg path with the new svg img
					//when the animation is ready, in order to prevent any jumpy behavior
					overlay.css({'opacity':1,'display':'block'});
					state.css({'opacity':0,'display':'none'});

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
						newTop = logo.top + logo.height + document.body.scrollTop + yoffset;
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
					TweenLite.to(state,0,{opacity:1,display:"block"});
					overlay.css({
						left: -1000,
						top: -1000
					})
				}
			});
			t.to($('#river, .pin.red'), .5, {opacity:0, display:'none'});
			t.to($('.closeMap'),0,{display:'block'});
			$('.state').each(function(){
				if ($(this).attr('data-active') == 0){
					$(this).css('z-index',10);
					var time = 0;
					if (!debug)
						time = 0.3;
					t.to($(this),time,{scale:0, ease: Back.easeIn}, 0);
					//t.to($(this),0,{display:'none'});
				}
			});

			
			
		} else {
			
			//selected = false;
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
		var suits = ["club","spade","heart","diamond"];
		$.each(pins, function(){
			//create the actual pin element that will show on the map
			var data = $(this)[0];
			var pin = $("<div>")
				.addClass('pin pin_' + state.abbrev)
				.attr({
					'data-pinid':counter,
					'data-state':state.abbrev,
					'data-x':$(this)[0].x,
					'data-y':$(this)[0].y,
					'data-pinname': $(this)[0].name.replace(/ /g,"").replace(/'/g,"").toLowerCase()
					})
				.append("<img src='images/" + suits[counter%4] + ".png' />");
			
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
						href: "http://www.youtube.com/embed/" + data.ytid + "?autoplay=1"
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
				$('.photo, .thumb',$elem).on('click',function(){
					$.fancybox.open(group,{
						padding: 0,
						margin: [40, 100, 40, 100]
					})
				})
			}else{
				$('.photo',$elem).hide();
			}
			console.log(window.location);
			$('.link a', $elem).attr({'href':data.url,'target':'_blank'});
			$('.fb a', $elem).attr({'href':'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(window.location.origin + '?l=' + pin.attr("data-pinname")),'target':'_blank'});
			$('.twttr a', $elem).attr({'href':'https://www.twitter.com/home?status=' + encodeURIComponent(window.location.origin + '?l=' + pin.attr("data-pinname")),'target':'_blank'})
			if (data.thumb == ""){
				$(".thumb",$elem).hide();
			}else{
				$('.thumb',$elem).html('<img src="/images/thumbs/' + data.thumb + '" />');
			}
			
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
				if(!mobile && !deepLink){
					pinArr[0].trigger('click');
				}
				deepLink = false;
			}
		});
		var pinArr = [];
		$.each($('.pin_' + currentState.state), function(){
			pinArr.push($(this));
		})
		if (!deepLink){
			$('.pin').removeClass('active');
			pinArr[0].addClass('active');
		}
		//if (!debug)
			pinTl.staggerFrom(pinArr,.5,{top:-100},.1).to($(this),.5,{alpha:1},0.5)
	}

	function getPinDetails(){
		$('.pin').removeClass('active');
		$(this).addClass('active');
		if($(this).hasClass('red')){
			var parent = $(this).attr('data-parent').toUpperCase();
			$("#" + parent).trigger('click');
			return;
		}
		var pin = $(this);
		var state = pin.attr('data-state');
		var id = pin.attr('data-pinid');
		var panel = $('#panel_' + state + '_' + id);
		//deepLink = false;
		if (mobile){
			$("body").scrollTo(panel,600);
			deepLink = false;
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
		//deepLink = false;
		if(mobile) return;
		hideAllDetails();
		panel.css('visibility','visible');
		TweenLite.to($('#details'),.5,{right:'3%'});
	}

	function hideAllDetails(){
		$('.panel').css('visibility','hidden');
	}

	function spinPokerChip(){
		spinChip = true;
		var chipTl = new TimelineLite({
			onComplete:function(){
				if (spinChip){
					spinPokerChip();
				}
			}
		});

		chipTl.to($('.pokerChip'),0.75,{scaleY:-1,ease:Linear.easeNone});
		chipTl.to($('.pokerChip'),0.75,{scaleY:1,ease:Linear.easeNone});
	}

	function bounceCommentArrow(){
		bounceArrow = true;
		var arrowTl = new TimelineLite({
			onComplete:function(){
				if (bounceArrow){
					bounceCommentArrow();
				}
			}
		});

		arrowTl.to($('.comments-arrow'),.2,{top:"-=5",ease:Linear.easeNone});
		arrowTl.to($('.comments-arrow'),.2,{top:"+=5",ease:Linear.easeNone});
	}

	function getDeepLink(){
		var url = document.location.toString();
		if (url.match('#')){
			return url.split('#')[1];
		}
		else{
			return null;
		}
	}

	function goToDeepLink(){
		var dl = getParameterByName('l');
		if (dl === null) return;
		var pin = $('.pin[data-pinname="' + dl.toLowerCase() + '"');
		if (dl === null && !pin.length) return;
		deepLink = true;

		
		var state = $('#' + pin.attr('data-state'));
		state.trigger('click');
		pin.trigger('click');

	}

	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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

		/*if (!mobile){
			$("#logo").css('margin-top',$("#logo").height() / 2 * -1);
		}else{
			//$("#logo").css('margin-top','0');
		}*/

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