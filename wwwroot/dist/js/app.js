!function(t,e,n){function a(){t.getJSON("../locations.json",function(e){m=e;var i=0;t.each(e.states,function(){var n=t(this)[0],a="#"+n.abbrev,s=t(a);x.push(s);var o=d(n);o&&i==e.states.length-1&&t("#detailPanelTemplate").remove(),i++}),R||s()})}function s(){t(".scaling-svg-container").css("visibility","visible"),T=!0,E.fromTo(t(".dice > img"),1,{scale:0,rotation:-90},{scale:1,rotation:0,ease:Power3.easeOut},0),E.staggerTo(x,.4,{scale:1,ease:Back.easeOut},.2),E.addLabel("afterStates"),E.staggerFrom(t(".pin.red"),.7,{top:"-100%",ease:Power3.easeOut},.2);var e=document.getElementById("riverPath"),i={length:0,pathLength:e.getTotalLength()};E.to(i,3,{length:i.pathLength,onStart:function(){e.style.display="block"},onUpdate:o,onUpdateParams:[i,e],ease:Linear.easeNone},"afterStates")}function o(t,e){e.style.strokeDasharray=[t.length,t.pathLength].join(" ")}function c(n){if(!T)if(I)I=!1;else{n.attr("data-active","1"),B.state=n.attr("id");{var a=document.getElementById(B.state),s=a.getBoundingClientRect().width,o=(a.getBoundingClientRect().height,n.offset());t("#test")}y=t("#overlay"+B.state).css({left:o.left,top:o.top+document.getElementById("container").scrollTop,width:s,opacity:0}),I=!0,L=new TimelineLite({onComplete:function(){var a=n.attr("data-x"),s=n.attr("data-y"),o=n.attr("data-scale");if(w)switch(n.attr("id")){case"IL":case"MS":o=50;break;default:o=80}y.css("opacity",1),n.css("opacity",0);var c=0;R||(c=.2);var r=t(".svgContainer").offset(),d=t(".svgContainer").width(),l=t(".svgContainer").height(),p=(d*(a/100)+r.left)/t(e).width()*100,f=(l*(s/100)+r.top+document.getElementById("container").scrollTop)/t(e).height()*100;TweenMax.to(y,c,{width:o+"%",left:p+"%",top:f+"%",svgOrigin:"0 0",onComplete:function(){for(i=0;i<m.states.length;i++)if(n.attr("id")==m.states[i].abbrev)return B.pins=m.states[i].pins,g(),void h()}})},onReverseComplete:function(){TweenLite.to(n,0,{opacity:1}),y.css({left:-1e3,top:-1e3})}}),L.to(t("#river, .pin.red"),.5,{opacity:0}),t(".state").each(function(){if(0==t(this).attr("data-active")){t(this).css("z-index",10);var e=0;R||(e=.3),L.to(t(this),e,{scale:0,ease:Back.easeIn},0)}})}}function r(){w&&t("#container").scrollTo(t("#svgMap"),600);var e=document.getElementById(B.state),i=e.getBoundingClientRect().width,n=(e.getBoundingClientRect().height,t("#"+B.state).offset()),a=n.top+document.getElementById("container").scrollTop;b.reverse(),TweenMax.to(y,.2,{width:i,left:n.left,top:a,onComplete:function(){L.reverse()}}),t("#"+B.state).attr("data-active","0"),w||TweenLite.to(t("#details"),.5,{right:"-100%"}),I=!1,C=!1}function d(e){var i=0,n=e.pins;return t.each(n,function(){var n=t(this)[0],a=t("<div>").addClass("pin pin_"+e.abbrev).attr({"data-pinid":i,"data-state":e.abbrev,"data-x":t(this)[0].x,"data-y":t(this)[0].y}).append("<img src='images/pin.png' />");t(".container").append(a);var s=t("#detailPanelTemplate").clone(!0).attr({id:"panel_"+e.abbrev+"_"+i,"data-state":e.abbrev,"data-id":i});if(t(".city",s).text(n.city+", "+e.state),t(".a1",s).text(n.name),t(".a2",s).text(n.address),t(".a3",s).text(n.city+", "+e.abbrev+", "+n.zip),""==n.ytid?t(".video",s).hide():t(".video",s).on("click",function(){t.fancybox.open({href:"http://www.youtube.com/embed/"+n.ytid},{type:"iframe",padding:4,margin:40})}),n.images.length){for(var o=[],c=0;c<n.images.length;c++){var r={href:"images/locations/"+n.images[c]};o.push(r)}t(".photo",s).on("click",function(){t.fancybox.open(o,{padding:0,margin:[40,100,40,100]})})}else t(".photo",s).hide();t(".share a",s).attr("href",n.url),t(".thumb",s).html('<img src="/images/thumbs/'+n.thumb+'" />'),t("#details").append(s),i++}),!0}function l(){var t=(document.getElementById("river").getBoundingClientRect(),document.getElementById("svgMap").getBoundingClientRect()),e=.466*t.width,i=2.44505907782121*e;document.getElementById("river").style.width=e,document.getElementById("river").style.height=i,document.getElementById("river").style.left=t.left+.2849869862426*t.width,document.getElementById("river").style.top=t.top-.122*t.height+document.getElementById("container").scrollTop}function g(){var e=document.getElementById("overlay"+B.state),i=e.getBoundingClientRect().width,n=e.getBoundingClientRect().height,a=y.offset();t.each(t(".pin_"+B.state),function(){var e=i*t(this).attr("data-x"),s=n*t(this).attr("data-y"),o=a.left+e-t(this).width()/2,c=a.top+document.getElementById("container").scrollTop+s-t(this).height();t(this).css({left:o,top:c})})}function h(){b=new TimelineLite({onReverseComplete:function(){this.clear()}});var e=[];t.each(t(".pin_"+B.state),function(){e.push(t(this))}),b.staggerFrom(e,.5,{top:-100},.1).to(t(this),.5,{alpha:1},.5)}function p(){var e=t(this),i=e.attr("data-state"),n=e.attr("data-pinid"),a=t("#panel_"+i+"_"+n);return w?void t("#container").scrollTo(a,600):(C?TweenLite.to(t("#details"),.5,{right:"-100%",onComplete:function(){f(a)}}):f(a),void(C=!0))}function f(e){w||(v(),e.css("visibility","visible"),TweenLite.to(t("#details"),.5,{right:"3%"}))}function v(){t(".panel").css("visibility","hidden")}function u(){var e=w;w="hidden"==t(".pixel").css("visibility")?!1:!0,e!=w&&(k>0&&r(),k++);var i=t(".states"),n=755,a=709,s=(i.width(),i.height()),o=0,o=a/n;i.width(s*o),I&&g(),l()}var m,y,b,w,x=[],B={},T=!1,C=!1,I=!1,E=new TimelineLite({onComplete:function(){T=!1}}),L=new TimelineLite,k=0,R=!1,M=function(){t("svg .state").on("click",function(){var e=t(this).attr("id");c(t("#"+e))}),R&&c(t("#IA")),t(n).on("click",".backToMap",r),t(n).on("click",".pin",p),TweenMax.set(t(".state"),{transformOrigin:"50% 50% 0"}),R||TweenMax.to(t(".state"),0,{scale:0}),u(),a()};e.onresize=function(){u()},t.extend(t.fancybox.defaults.tpl,{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div><div class="logo"><div class="dice"><img class="die1" src="images/die-1.png" alt="" /><img class="die2" src="images/die-2.png" alt="" /></div><img src="images/mississippi-grind-we-cant-lose.png" alt="Mississippi Grind. We Can\'t Lose" /></div>'}),t.fancybox.defaults.nextEffect="none",t.fancybox.defaults.prevEffect="none",t(n).ready(M)}(jQuery,window,document);