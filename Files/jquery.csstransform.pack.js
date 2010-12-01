/*
  DMXzone jQuery.csstransform
  
  Version 1.3
  
  Copyright (c) 2010 DMXzone.com 
*/
(function(e){e.bindings=e.extend(true,e.bindings||{},{setter:{css:{},attr:{}},getter:{css:{},attr:{}},filter:{},formatter:{}});e.extend(e.bindings.setter.css,{matrix:function(k,l){g.getInstance(k).set("matrix",l).paint()},rotate:function(k,l){g.getInstance(k).set("rotate",l).paint()},scale:function(k,l){g.getInstance(k).set("scale",l).paint()},scaleX:function(k,l){g.getInstance(k).set("scaleX",l).paint()},scaleY:function(k,l){g.getInstance(k).set("scaleY",l).paint()},skew:function(k,l){g.getInstance(k).set("skew",l).paint()},skewX:function(k,l){g.getInstance(k).set("skewX",l).paint()},skewY:function(k,l){g.getInstance(k).set("skewY",l).paint()},translate:function(k,l){g.getInstance(k).set("translate",l).paint()},translateX:function(k,l){g.getInstance(k).set("translateX",l).paint()},translateY:function(k,l){g.getInstance(k).set("translateY",l).paint()},transform:function(k,l){g.getInstance(k).set("transform",l).paint()}});e.extend(e.bindings.getter.css,{matrix:function(k){return g.getInstance(k).get("matrix")},rotate:function(k){return g.getInstance(k).get("rotate")},scale:function(k){return g.getInstance(k).get("scale")},scaleX:function(k){return g.getInstance(k).get("scaleX")},scaleY:function(k){return g.getInstance(k).get("scaleY")},skew:function(k){return g.getInstance(k).get("skew")},skewX:function(k){return g.getInstance(k).get("skewX")},skewY:function(k){return g.getInstance(k).get("skewY")},translate:function(k){return g.getInstance(k).get("translate")},translateX:function(k){return g.getInstance(k).get("translateX")},translateY:function(k){return g.getInstance(k).get("translateY")},transform:function(k){return g.getInstance(k).get()},"multiplied-matrix":function(k){return g.getInstance(k).get("multiplied-matrix")}});e.extend(e.fx.step,{matrix:function(k){},rotate:function(k){k.unit="deg";g.getInstance(k.elem).set(k.prop,k.now).paint()},scale:function(k){k.unit="";g.getInstance(k.elem).set(k.prop,k.now).paint()},scaleX:function(k){k.unit="";g.getInstance(k.elem).set(k.prop,k.now).paint()},scaleY:function(k){k.unit="";g.getInstance(k.elem).set(k.prop,k.now).paint()},skew:function(k){k.unit="deg";g.getInstance(k.elem).set(k.prop,k.now).paint()},skewX:function(k){k.unit="deg";g.getInstance(k.elem).set(k.prop,k.now).paint()},skewY:function(k){k.unit="deg";g.getInstance(k.elem).set(k.prop,k.now).paint()},translate:function(k){k.unit="px";g.getInstance(k.elem).set(k.prop,k.now).paint()},translateX:function(k){k.unit="px";g.getInstance(k.elem).set(k.prop,k.now).paint()},translateY:function(k){k.unit="px";g.getInstance(k.elem).set(k.prop,k.now).paint()}});var h=jQuery.curCSS;jQuery.curCSS=function(m,k,n){var l=e.bindings.getter.css[k]||null;if(l){return l(m)}return h.apply(jQuery,arguments)};var i=e.fn.css;e.fn.css=function(k,m){if(typeof k=="string"){if(m!==undefined){var l=e.bindings.setter.css[k]||null;if(l){return this.each(function(n){l(this,e.isFunction(m)?m(n,e(this).css(k)):m)})}}}else{this.each(function(o){var n,p,q;for(n in k){p=e.bindings.setter.css[n]||null;if(p){q=k[n];if(e.isFunction(q)){q=q(o,e(this).css(n))}p(this,q)}}})}return i.call(this,k,m)};var c=e.fx.prototype.cur;e.fx.prototype.cur=function(){var k=e.bindings.getter.css[this.prop]||null;if(k){return parseFloat(k(this.elem).replace(/^[^\d-\.\+]*/,""))}return c.apply(this,arguments)};function a(s,r,p,n,m,k){this.a=1;this.b=0;this.c=0;this.d=1;this.tx=0;this.ty=0;if(arguments.length==6){this.a=s;this.b=r;this.c=p;this.d=n;this.tx=m;this.ty=k}var o=["rotate","scale","scaleX","scaleY","translate","translateX","translateY","skew","skewX","skewY","matrix"];for(var l=0;l<o.length;l++){var q=o[l];this[q]=function(){this.multiply(a[q].apply(a,arguments));return this}}}a.prototype.multiply=function(m){var l=this.a,o=this.b,p=this.c,q=this.d,k=this.tx,n=this.ty;this.a=l*m.a+o*m.c;this.b=l*m.b+o*m.d;this.c=p*m.a+q*m.c;this.d=p*m.b+q*m.d;this.tx=k*m.a+n*m.c+m.tx;this.ty=k*m.b+n*m.d+m.ty;l=o=p=q=k=n=null;return this};a.prototype.clone=function(){return new a(this.a,this.b,this.c,this.d,this.tx,this.ty)};a.prototype.toString=function(){var k=e.browser.mozilla?"px":"";return this.a+", "+this.b+", "+this.c+", "+this.d+", "+this.tx+k+", "+this.ty+k};a.prototype.toArray=function(){return[this.a,this.b,this.c,this.d,this.tx,this.ty]};a.prototype.isIdentity=function(){return this.a===1&&this.b===0&&this.c===0&&this.d===1&&this.tx===0&&this.ty===0};a.prototype.invert=function(){var n=this.a,l=this.b,p=this.c,o=this.d,m=this.tx,k=this.ty;this.a=o/(n*o-l*p);this.b=-l/(n*o-l*p);this.c=-p/(n*o-l*p);this.d=n/(n*o-l*p);this.tx=(p*k-o*m)/(n*o-l*p);this.ty=-(n*k-l*m)/(n*o-l*p);n=l=p=o=m=k=null;return this};a.prototype.deltaTransformPoint=function(k){return{x:k.x*this.a+k.y*this.c+this.tx,y:k.x*this.b+k.y*this.d+this.ty}};a.prototype.getSize=function(q,n){var o=Math.max,m=Math.min;var s={tl:{x:this.tx,y:this.ty},tr:{x:q*this.a+this.tx,y:q*this.b+this.ty},bl:{x:n*this.c+this.tx,y:n*this.d+this.ty},br:{x:q*this.a+n*this.c+this.tx,y:q*this.b+n*this.d+this.ty}};var l=m(m(s.tl.x,s.bl.x),m(s.tr.x,s.br.x));var k=o(o(s.tl.x,s.bl.x),o(s.tr.x,s.br.x));var t=m(m(s.tl.y,s.bl.y),m(s.tr.y,s.br.y));var p=o(o(s.tl.y,s.bl.y),o(s.tr.y,s.br.y));var r={width:Math.abs(l-q)+k-q,height:Math.abs(t-n)+p-n};m=o=s=l=k=t=p=null;return r};a.rotate=function(n){var k=(Math.PI/180)*n;k=k===0?k:k+0.0001;var m=Math.cos(k);var l=Math.sin(k);return new a(m,l,-l,m,0,0)};a.scale=function(l,k){l=j(l)?l===0?0.001:l:1;k=j(k)?k===0?0.001:k:l;return new a(l,0,0,k,0,0)};a.scaleX=function(k){k=j(k)?k===0?0.001:k:1;return new a(k,0,0,1,0,0)};a.scaleY=function(k){k=j(k)?k===0?0.001:k:1;return new a(1,0,0,k,0,0)};a.translate=function(k,l){return new a(1,0,0,1,j(k)?k:0,j(l)?l:0)};a.translateX=function(k){return new a(1,0,0,1,j(k)?k:0,0)};a.translateY=function(k){return new a(1,0,0,1,0,j(k)?k:0)};a.skew=function(l,k){k=j(k)?Math.tan(k*(Math.PI/180)):0;l=j(l)?Math.tan(l*(Math.PI/180)):0;return new a(1,k,l,1,0,0)};a.skewX=function(k){k=j(k)?Math.tan(k*(Math.PI/180)):0;return new a(1,0,k,1,0,0)};a.skewY=function(k){k=j(k)?Math.tan(k*(Math.PI/180)):0;return new a(1,k,0,1,0,0)};a.matrix=function(n,l,p,o,m,k){return new a(n,l,p,o,m,k)};function j(k){return typeof k=="number"||(k&&typeof k=="object"&&"toFixed" in k)}function f(k){this.units={matrix:"",rotate:"deg",scale:"",scaleX:"",scaleY:"",skew:"deg",skewX:"deg",skewY:"deg",translate:"px",translateX:"px",translateY:"px"};if(!k||!(k in this.units)){throw'Invalid transformation type "'+k+'"'}this.type=k;this.matrix=new a();this.args=[]}f.prototype={toString:function(){return this.type+(this.type=="matrix"?"("+this.matrix.toString()+")":"("+this.args.join(this.units[this.type]+", ")+this.units[this.type]+")")},init:function(){var k=arguments.length==1&&arguments[0]&&arguments[0].push?arguments[0]:arguments;this.args=jQuery.map(k,function(l,m){l=parseFloat(l);return isNaN(l)?null:l});this.matrix=a[this.type].apply(a,this.args);return this}};function g(k){this._stack=[];this._stackIndex={};this.element=k||null}g.prototype._defaultValues={matrix:e.browser.mozilla?[1,0,0,1,"0px","0px"]:[1,0,0,1,0,0],rotate:["0deg"],scale:[1,1],scaleX:[1],scaleY:[1],skew:["0deg","0deg"],skewX:["0deg"],skewY:["0deg"],translate:["0px","0px"],translateX:["0px"],translateY:["0px"]};g.prototype.empty=function(){this._stack=[];this._stackIndex={};return this};g.prototype.isEmpty=function(){return this._stack.length===0};g.prototype.get=function(k){if(!k||k=="transform"){return this.toString()}if(k=="multiplied-matrix"){return"matrix("+this.getMatrix().toString()+")"}if(this._stackIndex[k]!==undefined){return this._stack[this._stackIndex[k]].toString()}return k+"("+this._defaultValues[k].join(", ")+")"};g.prototype.toString=function(){var l=[];for(var k=0;k<this._stack.length;k++){l.push(this._stack[k].toString())}return l.join(" ")||"none"};g.prototype.getMatrix=function(){var k=new a();for(var l=0;l<this._stack.length;l++){k=this._stack[l].matrix.clone().multiply(k)}return k};g.prototype.getCSS=function(){return this.toString()};g.prototype.setCSS=function(q){this.empty();var k=/^(\w+)\(([\d\w,-\.]+)$/i;var n=String(q||"");if(n&&n!="none"){n=n.replace(/\s+/g,"").split(")");if(n.length>0){var p,s,r,o,l;for(var m=0;m<n.length;m++){if(!n[m]){continue}p=k.exec(n[m]);if(p){s=p[1];if(specialProps[s]){this.set(s,p[2])}}}}}return this};g.prototype.set=function(n,o){if(n){if(n=="transform"){this.setCSS(o)}else{if(n!="none"){var l=e.isArray(o)?o:typeof o=="string"?o.split(/,/):[o];var m=this;l=jQuery.map(l,function(q,s){if(m._stackIndex[n]===undefined){var r=new f(n);r.init.apply(r,m._defaultValues[n]);m._stackIndex[n]=m._stack.push(r)-1}var u=parseFloat(m._stack[m._stackIndex[n]].args[s]);q=e.trim(q.toString());var p=q.replace(/\s/g,"").match(/^(([\+-]=)?(-?\d+(\.\d+)?))(.+)?$/);if(p){if(p[3]){q=parseFloat(p[3])}if(p[2]){switch(p[2]){case"+=":q=u+q;break;case"-=":q=u-q;break}}}return isNaN(q)?null:q});var k=this._stack[this._stackIndex[n]];k.init.apply(k,l)}}}return this};g.prototype.paint=function(){this.element.style[g.getCssTransformPropertyName()]=this.getCSS();return this};g.getCssTransformPropertyName=function(){var n=e("body")[0].style,l="",m,o,k={Moz:1,Webkit:1,O:1,Khtml:1,Ms:1};for(o in k){do{m="transform";if(n[m]!==undefined){l=m;break}m=o+"Transform";if(n[m]!==undefined){l=m;break}m=o.toLowerCase()+"Transform";if(n[m]!==undefined){l=m;break}m="-"+o.toLowerCase()+"-transform";if(n[m]!==undefined){l=m;break}}while(false)}g.getCssTransformPropertyName=function(){return l};return l};g.factory=function(l){var k=g.getCssTransformPropertyName();if(!k){if(g.isCanvasSupported()){return new b(l)}else{if(g.isFilterSupported()){return new d(l)}}}return new g(l)};g.getInstance=function(k){if(!k.transformManager){k.transformManager=g.factory(k)}return k.transformManager};g.isCanvasSupported=function(){var k=typeof document.createElement("canvas").getContext=="function";g.isCanvasSupported=function(){return k};return k};g.isFilterSupported=function(){var l=document.getElementsByTagName("body")[0].filters;var k=l&&typeof l=="object"&&!window.opera;g.isFilterSupported=function(){return k};return k};function d(k){this.element=k||null;this.origStyle=null;this.origState={};this.wrapper=null;this._stack=[];this._stackIndex={}}d.prototype=new g();d.prototype.paint=function(){if(!this.origStyle){this.initTransform()}var l=this.getMatrix();if(l.isIdentity()){this.uninitTransform()}else{var k=Math.abs(l.b-l.c);if(k>100){l.b*=k/100}this.element.style.filter=" progid:DXImageTransform.Microsoft.Matrix(M11="+l.a+",M12="+l.c+",M21="+l.b+",M22="+l.d+",sizingMethod='auto expand',FilterType='nearest neighbor') "+String(this.element.style.filter||"").replace(/(progid:DXImageTransform\.Microsoft\.)?Matrix\s*\([^\)]*\)\s*/gi,"");this.element.style.top=((this.origState.height-e(this.element).height())/2)+l.ty+this.origState.top+"px";this.element.style.left=((this.origState.width-e(this.element).width())/2)+l.tx+this.origState.left+"px"}return this};d.prototype.initTransform=function(){var m=e(this.element);var k=this;function l(){if(!k.origStyle){k.origStyle={}}for(var o=0;o<arguments.length;o++){k.origStyle[arguments[o]]=m.css(arguments[o])}}function n(){var o=m.css("float");if(o=="none"){o=m.attr("align")}if(o!="left"&&o!="right"){o="none"}return o}this.origState={width:m.width(),height:m.height(),top:0,left:0};switch(m.css("position")){case"absolute":this.origState.top=m.position().top;this.origState.left=m.position().left;l("width","height","top","left");m.css({width:this.origState.width,height:this.origState.height,top:this.origState.top,left:this.origState.left});break;case"fixed":this.origState.top=m.offset().top;this.origState.left=m.offset().left;l("width","height","top","left");m.css({width:this.origState.width,height:this.origState.height,top:this.origState.top,left:this.origState.left});break;case"relative":this.origState.top=parseFloat(m.css("top"));this.origState.left=parseFloat(m.css("left"));if(isNaN(this.origState.top)){this.origState.top=0}if(isNaN(this.origState.left)){this.origState.left=0}l("width","height","top","left","position");m.css({width:this.origState.width,height:this.origState.height,top:this.origState.top,left:this.origState.left,position:"absolute"});if(!this.wrapper){m.wrap('<span class="dmx-filter-transform-wrapper" />');this.wrapper=m.parent().css({display:m.css("display")=="block"?"block":"inline-block",position:"relative","float":n(),width:m.outerWidth({margin:true}),height:m.outerHeight({margin:true})})}break;default:this.origState.top=0;this.origState.left=0;l("width","height","top","left","position");m.css({width:this.origState.width,height:this.origState.height,top:this.origState.top,left:this.origState.left,position:"absolute"});if(!this.wrapper){m.wrap('<span class="dmx-filter-transform-wrapper" />');this.wrapper=m.parent().css({display:m.css("display")=="block"?"block":"inline-block",position:"relative","float":n(),width:m.outerWidth({margin:true}),height:m.outerHeight({margin:true})})}break}};d.prototype.uninitTransform=function(){this.origState={};if(this.origStyle){e(this.element).css(this.origStyle);this.origStyle=null}if(this.wrapper){this.wrapper.before(e(this.element));this.wrapper.remove();this.wrapper=null}};function b(k){this.element=k||null;this.canvas=null;this.canvasContext=null;this.origStyle=null;this.origState={};this.wrapper=null;this._stack=[];this._stackIndex={}}b.prototype=new g();b.prototype.paint=function(){var o=e(this.element);if(o.is("img")){var k=this.getMatrix();if(k.isIdentity()){this.uninitTransform()}else{if(!this.origStyle){this.initTransform()}var l=this.origState.imageWidth;var p=this.origState.imageHeight;var n=k.getSize(l,p);if(n.width<10000&&n.height<10000){var q=parseFloat(o.css("opacity"));if(q<1){this.canvas.css("opacity",q)}q=null;if(n.width==this.canvas[0].width&&n.height==this.canvas[0].height){this.canvasContext.clearRect(0,0,this.canvas[0].width,this.canvas[0].height)}else{this.canvas.attr("width",Math.max(n.width,1)).attr("height",Math.max(n.height,1)).css({left:this.origState.left+k.tx-(n.width-l)/2,top:this.origState.top+k.ty-(n.height-p)/2})}this.canvasContext.setTransform(k.a,k.b,k.c,k.d,this.canvas[0].width/2,this.canvas[0].height/2);this.canvasContext.drawImage(this.element,-l/2,-p/2,l,p)}l=p=n=null}k=null}return this};b.prototype.initTransform=function(){var p=this;var k=e(this.element);this.origState={imageWidth:k.width(),imageHeight:k.height(),top:0,left:0};this.origStyle={visibility:k.css("visibility"),position:k.css("position"),zIndex:k.css("zIndex")};var r={display:"inline-block"};var u={position:"absolute",opacity:k.css("opacity")};function l(x,z){var y=e('<canvas width="'+p.origState.imageWidth+'" height="'+p.origState.imageHeight+'" />');y.css(e.extend({},u,z));p.canvas=y;p.canvasContext=y[0].getContext("2d");k.wrap('<span class="dmx-canvas-transform-wrapper" />');p.wrapper=k.parent().css(e.extend({},r,x));k.css({position:"absolute",zIndex:-1,visibility:"hidden"}).after(p.canvas);jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,select,keydown,keypress,keyup,error").split(","),function(B,A){p.canvas.bind(A,function(C){k.trigger(A)})})}function s(z,A,y){var x=parseFloat(z.css(A));if(isNaN(x)){x=y||0}return x}function q(){var x=k.css("float");if(x=="none"){x=k.attr("align")}if(x!="left"&&x!="right"){x="none"}return x}var w=s(k,"paddingTop");var o=s(k,"paddingLeft");var v=s(k,"borderTopWidth");var m=s(k,"borderLeftWidth");switch(k.css("position")){case"absolute":l({position:"absolute",width:this.origState.width,height:this.origState.height,top:k.position().top+w+v,left:k.position().left+o+m},{margin:k.css("margin")});break;case"fixed":l({position:"fixed",width:this.origState.imageWidth,height:this.origState.imageHeight,top:k.offset().top+w+v,left:k.offset().left+o+m});break;case"relative":var t=parseFloat(k[0].style.top);var n=parseFloat(k[0].style.left);if(isNaN(t)){t=0}if(isNaN(n)){n=0}this.origState.top=t+w+v;this.origState.left=n+o+m;l({display:"inline-block",position:"relative","float":q(),width:k.outerWidth({margin:true}),height:k.outerHeight({margin:true})},{margin:k.css("margin")});t=n=null;break;default:this.origState.top=w+v;this.origState.left=o+m;l({display:"inline-block",position:"relative","float":q(),width:k.outerWidth({margin:true}),height:k.outerHeight({margin:true})},{margin:k.css("margin"),top:w+v,left:o+m});break}w=o=v=m=null};b.prototype.uninitTransform=function(){if(this.origStyle){var k=e(this.element);k.css(this.origStyle);this.origStyle=null;this.canvas.unbind();this.wrapper.before(k);this.wrapper.remove()}}})(jQuery);