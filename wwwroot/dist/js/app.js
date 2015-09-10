!function(t,e,a){function n(){t.getJSON("../locations.json",function(e){C=e;var a=0;t.each(e.states,function(){var i=t(this)[0],n="#"+i.abbrev,o=t(n);B.push(o);var s=l(i);s&&a==e.states.length-1&&t("#detailPanelTemplate").remove(),a++}),S||o()})}function o(){t(".scaling-svg-container").css("visibility","visible"),I=!0,M.fromTo(t(".dice > img"),1,{scale:0,rotation:-90},{scale:1,rotation:0,ease:Power3.easeOut},0),M.staggerTo(B,.4,{scale:1,ease:Back.easeOut},.2),M.addLabel("afterStates"),M.staggerFrom(t(".pin.red"),.7,{top:-1*t(".scaling-svg-container").offset().top-200,ease:Power3.easeOut},.2);var e=document.getElementById("riverPath"),a={length:0,pathLength:e.getTotalLength()-95};M.to(a,3,{length:a.pathLength,onStart:function(){e.style.display="block"},onUpdate:s,onUpdateParams:[a,e],ease:Linear.easeNone},"afterStates")}function s(t,e){e.style.strokeDasharray=[t.length,t.pathLength].join(" ")}function r(a){if(!I&&!R){a.attr("data-active","1"),L.state=a.attr("id");{var n=document.getElementById(L.state),o=n.getBoundingClientRect().width,s=(n.getBoundingClientRect().height,a.offset());t("#test")}k&&t(".panel").each(function(){t(this).attr("data-state")==L.state?t(this).fadeIn():t(this).fadeOut()}),T=t("#overlay"+L.state).css({left:s.left,top:s.top+document.getElementById("container").scrollTop,width:o,opacity:0}),R=!0,_=new TimelineLite({onComplete:function(){var n=a.attr("data-x"),o=a.attr("data-y"),s=a.attr("data-scale"),r=100;if(k)switch(a.attr("id")){case"IL":s=50,r=70,n=30;case"MS":s=50,r=20,n=30;break;default:s=80}T.css({opacity:1,display:"block"}),a.css({opacity:0,display:"none"});var c=0;S||(c=.2);var l=t(".svgContainer").offset(),d=t(".svgContainer").width(),h=t(".svgContainer").height(),f=(d*(n/100)+l.left)/t(e).width()*100,u=(h*(o/100)+l.top+document.getElementById("container").scrollTop)/t(e).height()*100;if(k){var m=document.getElementById("logo").getBoundingClientRect();u=m.top+m.height+document.body.scrollTop+r}else u+="%";TweenMax.to(T,c,{width:s+"%",left:f+"%",top:u,svgOrigin:"0 0",onComplete:function(){for(i=0;i<C.states.length;i++)if(a.attr("id")==C.states[i].abbrev)return L.pins=C.states[i].pins,p(),void g()}})},onReverseComplete:function(){TweenLite.to(a,0,{opacity:1,display:"block"}),T.css({left:-1e3,top:-1e3})}}),_.to(t("#river, .pin.red"),.5,{opacity:0,display:"none"}),_.to(t(".closeMap"),0,{display:"block"}),t(".state").each(function(){if(0==t(this).attr("data-active")){t(this).css("z-index",10);var e=0;S||(e=.3),_.to(t(this),e,{scale:0,ease:Back.easeIn},0)}})}}function c(){t(".panel").show(),k&&(t("body").scrollTo(t("#svgMap"),600),t(".panel").hide());var e=document.getElementById(L.state),a=e.getBoundingClientRect().width,i=(e.getBoundingClientRect().height,t("#"+L.state).offset()),n=i.top+document.getElementById("container").scrollTop;x.reverse(),TweenMax.to(T,.2,{width:a,left:i.left,top:n,onComplete:function(){_.reverse()}}),t("#"+L.state).attr("data-active","0"),k||TweenLite.to(t("#details"),.5,{right:"-100%"}),R=!1,E=!1}function l(e){var a=0,i=e.pins,n=["club","spade","heart","diamond"];return t.each(i,function(){var i=t(this)[0],o=t("<div>").addClass("pin pin_"+e.abbrev).attr({"data-pinid":a,"data-state":e.abbrev,"data-x":t(this)[0].x,"data-y":t(this)[0].y,"data-pinname":t(this)[0].name.replace(/ /g,"").replace(/'/g,"").toLowerCase()}).append("<img src='images/"+n[a%4]+".png' />");t(".container").append(o);var s=t("#detailPanelTemplate").clone(!0).attr({id:"panel_"+e.abbrev+"_"+a,"data-state":e.abbrev,"data-id":a});if(t(".city",s).text(i.city+", "+e.state),t(".a1",s).text(i.name),t(".a2",s).text(i.address),t(".a3",s).text(i.city+", "+e.abbrev+", "+i.zip),""==i.ytid?t(".video",s).hide():t(".video",s).on("click",function(){t.fancybox.open({href:"http://www.youtube.com/embed/"+i.ytid+"?autoplay=1"},{type:"iframe",padding:4,margin:40})}),i.images.length){for(var r=[],c=0;c<i.images.length;c++){var l={href:"images/locations/"+i.images[c]};r.push(l)}t(".photo, .thumb",s).on("click",function(){t.fancybox.open(r,{padding:0,margin:[40,100,40,100]})})}else t(".photo",s).hide();console.log(window.location),t(".link a",s).attr({href:i.url,target:"_blank"}),t(".fb a",s).attr({href:"https://www.facebook.com/sharer.php?u="+encodeURIComponent(window.location.origin+"?l="+o.attr("data-pinname")),target:"_blank"}),t(".twttr a",s).attr({href:"https://www.twitter.com/home?status="+encodeURIComponent(window.location.origin+"?l="+o.attr("data-pinname")),target:"_blank"}),""==i.thumb?t(".thumb",s).hide():t(".thumb",s).html('<img src="/images/thumbs/'+i.thumb+'" />'),t("#details").append(s),a++}),!0}function d(){var t=(document.getElementById("river").getBoundingClientRect(),document.getElementById("svgMap").getBoundingClientRect()),e=.466*t.width,a=2.44505907782121*e;document.getElementById("river").style.width=e,document.getElementById("river").style.height=a,document.getElementById("river").style.left=t.left+.2849869862426*t.width,document.getElementById("river").style.top=t.top-.122*t.height+document.body.scrollTop}function p(){var e=document.getElementById("overlay"+L.state),a=e.getBoundingClientRect().width,i=e.getBoundingClientRect().height,n=T.offset();t.each(t(".pin_"+L.state),function(){var e=a*t(this).attr("data-x"),o=i*t(this).attr("data-y"),s=n.left+e-t(this).width()/2,r=n.top+document.getElementById("container").scrollTop+o-t(this).height();t(this).css({left:s,top:r})})}function g(){x=new TimelineLite({onReverseComplete:function(){this.clear()},onComplete:function(){k||P||e[0].trigger("click"),P=!1}});var e=[];t.each(t(".pin_"+L.state),function(){e.push(t(this))}),P||(t(".pin").removeClass("active"),e[0].addClass("active")),x.staggerFrom(e,.5,{top:-100},.1).to(t(this),.5,{alpha:1},.5)}function h(){if(t(".pin").removeClass("active"),t(this).addClass("active"),t(this).hasClass("red")){var e=t(this).attr("data-parent").toUpperCase();return void t("#"+e).trigger("click")}var a=t(this),i=a.attr("data-state"),n=a.attr("data-pinid"),o=t("#panel_"+i+"_"+n);return k?(t("body").scrollTo(o,600),void(P=!1)):(E?TweenLite.to(t("#details"),.5,{right:"-100%",onComplete:function(){f(o)}}):f(o),void(E=!0))}function f(e){k||(u(),e.css("visibility","visible"),TweenLite.to(t("#details"),.5,{right:"3%"}))}function u(){t(".panel").css("visibility","hidden")}function m(){O=!0;var e=new TimelineLite({onComplete:function(){O&&m()}});e.to(t(".pokerChip"),.75,{scaleY:-1,ease:Linear.easeNone}),e.to(t(".pokerChip"),.75,{scaleY:1,ease:Linear.easeNone})}function v(){U=!0;var e=new TimelineLite({onComplete:function(){U&&v()}});e.to(t(".comments-arrow"),.2,{top:"-=5",ease:Linear.easeNone}),e.to(t(".comments-arrow"),.2,{top:"+=5",ease:Linear.easeNone})}function y(){var e=w("l");if(null!==e){var a=t('.pin[data-pinname="'+e.toLowerCase()+'"');if(null!==e||a.length){P=!0;var i=t("#"+a.attr("data-state"));i.trigger("click"),a.trigger("click")}}}function w(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var e=new RegExp("[\\?&]"+t+"=([^&#]*)"),a=e.exec(location.search);return null===a?"":decodeURIComponent(a[1].replace(/\+/g," "))}function b(){var e=k;k="hidden"==t(".pixel").css("visibility")?!1:!0,e!=k&&(N>0&&c(),N++);var a=t(".states"),i=755,n=709,o=(a.width(),a.height()),s=0,s=n/i;a.width(o*s),R&&p(),d()}var C,T,x,k,B=[],L={},I=!1,E=!1,R=!1,M=new TimelineLite({onComplete:function(){I=!1,y()}}),_=new TimelineLite,N=0,O=!1,U=!1,P=!1,S=!1,j=function(){t("svg .state").on("click",function(){var e=t(this).attr("id");r(t("#"+e))}),S&&r(t("#AR")),t(a).on("click",".backToMap, .closeMap",c),t(a).on("click",".pin",h),t(".watchTrailer").on("click",function(){t.fancybox.open({href:"http://www.youtube.com/embed/7p1MNB6TNQU?autoplay=1"},{type:"iframe",padding:4,margin:40})}),t("#feelingLucky").mouseenter(function(){v(),m()}).mouseleave(function(){U=!1,O=!1}),TweenMax.set(t(".state"),{transformOrigin:"50% 50% 0"}),S||TweenMax.to(t(".state"),0,{scale:0}),b(),n()};e.onresize=function(){b()},t.extend(t.fancybox.defaults.tpl,{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div><div class="logo"><div class="dice"><img class="die1" src="images/die-1.png" alt="" /><img class="die2" src="images/die-2.png" alt="" /></div><img src="images/mississippi-grind-we-cant-lose.png" alt="Mississippi Grind. We Can\'t Lose" /></div>'}),t.fancybox.defaults.nextEffect="none",t.fancybox.defaults.prevEffect="none",t(a).ready(j)}(jQuery,window,document);