!function(t,e,a){function n(){t.getJSON("../locations.json",function(e){m=e;var i=0;t.each(e.states,function(){var a=t(this)[0],n="#"+a.abbrev,s=t(n);b.push(s);var o=r(a);o&&i==e.states.length-1&&t("#detailPanelTemplate").remove(),i++}),s()})}function s(){x.fromTo(t(".dice > img"),2,{scale:0,rotation:-90},{scale:1,rotation:0,ease:Power3.easeOut},0),x.staggerTo(b,.8,{scale:1,ease:Back.easeOut},.2)}function o(e){if(C)C=!1;else{e.attr("data-active","1"),y.state=e.attr("id");{var a=document.getElementById(y.state),n=a.getBoundingClientRect().width,s=(a.getBoundingClientRect().height,e.offset());t("#test")}g=t("#overlay"+y.state).css({left:s.left,top:s.top,width:n,opacity:0}),C=!0,B=new TimelineLite({onComplete:function(){var t=e.attr("data-x")+"%",a=e.attr("data-y")+"%",n=e.attr("data-scale");g.css("opacity",1),e.css("opacity",0),TweenMax.to(g,.2,{width:n+"%",left:t,top:a,svgOrigin:"0 0",onComplete:function(){for(i=0;i<m.states.length;i++)if(e.attr("id")==m.states[i].abbrev)return y.pins=m.states[i].pins,d(),void l()}})},onReverseComplete:function(){TweenLite.to(e,0,{opacity:.75}),g.css({left:-1e3,top:-1e3})}}),t(".state").each(function(){0==t(this).attr("data-active")&&(t(this).css("z-index",10),B.to(t(this),.3,{scale:0,ease:Back.easeIn},0))})}}function c(){w=new TimelineLite({onComplete:function(){this.clear(),t(".pin").css("opacity",0)}}),t.each(t(".pin_"+y.state),function(){w.to(t(this),.5,{top:-100},0)});var e=document.getElementById(y.state),i=e.getBoundingClientRect().width,a=(e.getBoundingClientRect().height,t("#"+y.state).offset());TweenMax.to(g,.2,{width:i,left:a.left,top:a.top,onComplete:function(){B.reverse()}}),t("#"+y.state).attr("data-active","0"),TweenLite.to(t("#details"),.5,{right:"-100%"}),C=!1,T=!1}function r(e){var i=0,a=e.pins;return t.each(a,function(){var a=t(this)[0],n=t("<div>").addClass("pin pin_"+e.abbrev).attr({"data-pinid":i,"data-state":e.abbrev,"data-x":t(this)[0].x,"data-y":t(this)[0].y});"red"===t(this)[0].color&&n.addClass("red"),t(".container").append(n);var s=t("#detailPanelTemplate").clone(!0).attr({id:"panel_"+e.abbrev+"_"+i,"data-state":e.abbrev,"data-id":i});t(".city",s).text(a.city+", "+e.state),t(".a1",s).text(a.name),t(".a2",s).text(a.address),t(".a3",s).text(a.city+", "+e.abbrev+", "+a.zip),t(".video",s).attr("data-ytid",a.ytid),t(".photo",s).attr("data-featherlight",a.images[0]),t(".thumb",s).html('<img src="/images/thumbs/'+a.thumb+'" />'),t("#details").append(s),i++}),!0}function d(){var e=document.getElementById("overlay"+y.state),i=e.getBoundingClientRect().width,a=e.getBoundingClientRect().height,n=g.offset();t.each(t(".pin_"+y.state),function(){var e=i*t(this).attr("data-x"),s=a*t(this).attr("data-y"),o=n.left+e-t(this).width()/2,c=n.top+s-t(this).height();t(this).css({left:o,top:c})})}function l(){w=new TimelineLite({onComplete:function(){this.clear()}}),t.each(t(".pin_"+y.state),function(){w.from(t(this),.5,{top:-100},.3).to(t(this),.5,{alpha:1},0)})}function h(){var e=t(this),i=e.attr("data-state"),a=e.attr("data-pinid"),n=t("#panel_"+i+"_"+a);T?TweenLite.to(t("#details"),.5,{right:"-100%",onComplete:function(){f(n)}}):f(n),T=!0}function f(e){u(),e.css("visibility","visible"),TweenLite.to(t("#details"),.5,{right:"3%"})}function u(){t(".panel").css("visibility","hidden")}function p(){var e=t(".states"),i=755,a=709,n=(e.width(),e.height()),s=0,s=a/i;e.width(n*s),C&&d()}function v(){var e=t(this).attr("data-ytid"),i="<div class='embed-container'><iframe src='http://www.youtube.com/embed/"+e+"' frameborder='0' allowfullscreen></iframe></div>";t.featherlight(i)}var m,g,w,b=[],y={},T=!1,C=!1,x=new TimelineLite,B=new TimelineLite,L=function(){t("svg .state").on("click",function(){var e=t(this).attr("id");o(t("#"+e))}),t(a).on("click",".backToMap",c),t(a).on("click",".pin",h),t(a).on("click",".video",v),TweenMax.set(t(".state"),{transformOrigin:"50% 50% 0"}),TweenMax.to(t(".state"),0,{scale:0}),s(),n()};e.onresize=function(){p()},t.featherlight.defaults.variant="mg",t(a).ready(L)}(jQuery,window,document);