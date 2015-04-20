function StartScene(canvas) {
	this.sprite = new Image();
	this.sprite.src = 'img/start.png';
	this.canvas=canvas;
	this.done=false;
}
StartScene.prototype.update=function() {
  	ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );
	ctx.drawImage(this.sprite, (this.canvas.width/2)-this.sprite.width/2, (this.canvas.height/2)-this.sprite.height/2);
}
StartScene.prototype.mouseup=function() {
	this.done=true;
}