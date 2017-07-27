function Ball(x,y,world,scale) {
	this.x=null;
	this.y=null;
	//create dynamic circle object
	this.bodyDef = new b2BodyDef;
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 8;
	this.fixDef.friction = 32;
	this.fixDef.restitution = 1;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.bodyDef.linearDamping=0.6;
	this.fixDef.shape = new b2CircleShape(0.2);
	this.bodyDef.position.x = x/scale;
	this.bodyDef.position.y = y/scale;
	this.scale=scale;
	this.radius=4;
	this.entity=world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
}
Ball.prototype.draw=function(ctx,camera) {
	ctx.beginPath();
    ctx.arc(this.entity.GetBody().GetPosition().x*this.scale+1-camera.x, this.entity.GetBody().GetPosition().y*this.scale+1-camera.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    this.x=this.entity.GetBody().GetPosition().x*this.scale
    this.y=this.entity.GetBody().GetPosition().y*this.scale
    ctx.arc(this.x-camera.x, this.y-camera.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
}
Ball.prototype.shoot=function(shot) {
	direction=new b2Vec2(shot.force*Math.cos(shot.angle*Math.PI/180),shot.force*Math.sin(shot.angle*Math.PI/180));
    this.entity.GetBody().ApplyForce(
      direction,
      this.entity.GetBody().GetWorldCenter()
    );
}