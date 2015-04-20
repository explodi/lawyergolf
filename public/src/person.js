var TO_RADIANS = Math.PI/180; 

function Person(x,y,world,scale) {
	this.world=world;
	this.size=32;
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;

	this.x=null;
	this.y=null;
	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.fixDef.shape = new b2CircleShape(16/this.size);
	this.bodyDef.linearDamping=10;
	this.angle=180
  this.frame=4
  this.walkdistance=0;
	this.bodyDef.position.x = x/scale;
	this.bodyDef.position.y = y/scale;
	this.entity=this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
	this.sprite = new Image();
  this.sprite.src = 'img/lawyer1.png';
  this.direction=null;
  this.destination=null;
  this.thinking=0;
}
Person.prototype.setsprite=function(spriteid) {
  this.sprite = new Image();
  this.sprite.src = "img/lawyer"+spriteid+".png";
}
Person.prototype.atdestination=function() {
  if(this.destination!=null && this.x!=null && this.y!=null) {
    d=this.distance({x:this.x,y:this.y},this.destination);
    if(d<32) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
 
  
}
Person.prototype.draw=function(ctx,scale,camera) {
	this.x=(this.entity.GetBody().GetPosition().x*scale)
	this.y=(this.entity.GetBody().GetPosition().y*scale)


	// save the current co-ordinate system 
    // before we screw with it
    ctx.save(); 

    // move to the middle of where we want to draw our image
    ctx.translate(this.x-camera.x, this.y-camera.y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    ctx.rotate(this.angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    ctx.drawImage(this.sprite, (this.frame*this.size),0,this.size,this.size, -16, -16,this.size,this.size);

    // and restore the co-ords to how they were when we began
    ctx.restore();

    if(this.direction!=null && this.angle!=null) {
    	force=32
    	angle=this.angle-90;
    	direction=new b2Vec2(force*Math.cos(angle*Math.PI/180),force*Math.sin(angle*Math.PI/180));
  		this.entity.GetBody().ApplyForce(
      		direction,
      		this.entity.GetBody().GetWorldCenter()
    	);
      this.walkdistance=this.walkdistance+(this.entity.GetBody().GetLinearVelocity().Length()*4);
      if(this.walkdistance>16) {
        this.walkdistance=0;
        this.frame=this.frame+1;
        if(this.frame>11) {
          this.frame=0;
        }
      }

    }
    if(this.entity.GetBody().GetLinearVelocity().Length()<1) {
      this.frame=0;
    }
}
Person.prototype.distance=function(a,b) {
  x1=a.x
  x2=b.x
  y1=a.y
  y2=b.y
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}
