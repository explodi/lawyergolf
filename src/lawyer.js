var canvas;
var ctx;
var currentscene;
var score=0;
var width;
var height;
var sceneid=0;

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();
    
function fixdimensions() {
	height=$(window).height();
	width=$(window).width();
	$("#canvas").width(width);
	$("#canvas").height(height);
	ctx.canvas.width=width
	ctx.canvas.height=height
}
function initcanvas() {
	canvas = document.getElementById('canvas');
	canvas.addEventListener("mousedown", mousedownevent, false);
	canvas.addEventListener("mousemove", mousemoveevent, false);
	canvas.addEventListener("mouseup",mouseupevent,false);
	window.addEventListener('keydown',keydownevent,false);
	window.addEventListener('keyup',keyupevent,false);

	console.log(canvas)
	ctx=canvas.getContext('2d');
	fixdimensions();
	       requestAnimFrame(update);

}
function loadscene(scene) {
	currentscene=scene;
}
function draw() {

}
function mousedownevent(e) {
	if(currentscene && currentscene.mousedown) currentscene.mousedown(e);
}
function mousemoveevent(e) {
	if(currentscene && currentscene.mousemove) currentscene.mousemove(e);	
}
function mouseupevent(e) {
	if(currentscene && currentscene.mouseup) currentscene.mouseup(e);	
}
function keydownevent(e) {
	if(currentscene && currentscene.keydown) currentscene.keydown(e);	
}
function keyupevent(e) {
	if(currentscene && currentscene.keyup) currentscene.keyup(e);	
}
function update() {
	if(currentscene) currentscene.update();
	if(currentscene.done && currentscene.done==true) currentscene=new GolfScene(canvas);
	if(currentscene.needsrestart && currentscene.needsrestart==true) currentscene=new StartScene(canvas);
	requestAnimFrame(update);
}

