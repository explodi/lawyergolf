function Entity(poly,scale) {

	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 100000;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.shape = new b2PolygonShape;
	this.scale=scale;
	this.points = [];
	this.y=null
	this.x=null
	for(i in poly) {
		if(poly[i].x<this.x||this.x==null) this.x=poly[i].x;
		if(poly[i].y<this.y||this.y==null) this.y=poly[i].y;
	}

	for(i in poly) {
    	this.points[i]={x:poly[i].x-this.x,y:poly[i].y-this.y}
  	}
	for (var i = 0; i < this.points.length; i++) {
		var vec = new b2Vec2();
		vec.Set(this.points[i].x/scale, this.points[i].y/scale);
		this.points[i] = vec;
	}

	this.shape.SetAsArray(this.points, this.points.length);
	this.fixDef.shape=this.shape

	this.bodyDef.position.x = this.x/scale;
	this.bodyDef.position.y = this.y/scale;
}
Entity.prototype.draw=function(ctx,camera) {
	ctx.fillStyle = 'red';
	ctx.moveTo(this.points[0].x,this.points[0].y);
		ctx.beginPath();
	for (var i = 0; i < this.points.length; i++) {
    	ctx.lineTo((this.points[i].x * this.scale)+this.x-camera.x, (this.points[i].y * this.scale)+this.y-camera.y);
  	}
  	ctx.closePath();
  	ctx.fill();
  	ctx.stroke();
  	ctx.restore();
}