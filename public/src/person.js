var TO_RADIANS = Math.PI/180; 

function Person(x,y,world,scale) {
	this.world=world;
	this.size=32;
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
  this.enemy=null;
	this.x=null;
	this.y=null;
	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.fixDef.shape = new b2CircleShape(10/this.size);
	this.bodyDef.linearDamping=10;
	this.angle=180
  this.frame=4
  this.health=100
  this.invisible=false;
  this.walkdistance=0;
	this.bodyDef.position.x = x/scale;
	this.bodyDef.position.y = y/scale;
	this.entity=this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
	this.sprite = new Image();
  this.sprite.src = 'img/lawyer1.png';
  this.club = new Image();
  this.club.src = 'img/putter.png';
  this.deadsprite = new Image();
  this.deadsprite.src = 'img/dead1.png';
  this.direction=null;
  this.destination=null;
  this.thinking=0;
  this.gotputter=false;
  this.stuck=false;
  this.talking=null;
  this.force=0;
  this.punch=0;
  this.hurt=0;
  this.ai=false;
}
Person.prototype.setsprite=function(spriteid) {
  this.sprite = new Image();
  this.sprite.src = "img/lawyer"+spriteid+".png";
  this.deadsprite = new Image();
  this.deadsprite.src = 'img/dead'+spriteid+'.png';
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
  if(this.punch>0) {
    this.punch=this.punch-333;
  }
  if(this.punch<0) {
    this.punch=0;
  }
  if(this.hurt>0) {
    this.hurt=this.hurt-5;
  } else {
    this.hurt=0;
  }
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
    if(this.invisible==false) {
      if(this.health>0) {
        ctx.drawImage(this.sprite, (this.frame*this.size),0,this.size,this.size, -16, -16,this.size,this.size);

      } else {
        ctx.drawImage(this.deadsprite, 0,0,this.size*2,this.size*2, -32, -32,this.size*2,this.size*2);

      }
    }
    // and restore the co-ords to how they were when we began

    if(this.direction!=null && this.angle!=null && this.health>0) {
      this.force=0;
    	force=16
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
    var clubframe=0;
    if(this.hurt>0) {
      ff=Math.round(this.hurt/10);
      if(ff>4) ff=4;
      this.frame=22+ff;
      if(this.ai==true) this.health=this.health-1;
    } else if(this.punch>0) {
      ff=Math.round(this.punch/500);
      if(ff>4) ff=4;
      this.frame=17+ff;
          ctx.drawImage(this.club, ff*this.size,0,this.size,this.size, -16, -28,this.size,this.size);    


    } else if(this.force>0) {
      ff=Math.round(this.force/50);
      if(ff>4) ff=4;
      this.frame=12+ff;
      clubframe=ff;
    } else if(this.entity.GetBody().GetLinearVelocity().Length()<1) {
      this.frame=0;
    }
    ctx.restore();
    if(this.enemy && this.health>0) {
      if(this.distance({x:this.enemy.x,y:this.enemy.y},{x:this.x,y:this.y})<64) {
        d20=Math.round(Math.random()*20)
        if(d20==1) this.hit(this.enemy);
      } else {
        this.destination={x:this.enemy.x,y:this.enemy.y}

      }
    }
    

}
Person.prototype.drawspeech=function(ctx,scale,camera) {
  if(this.talking!=null && this.health>0) {
      fontheight=10;
      ctx.font=fontheight+"px Menlo";
      var textsize = ctx.measureText(this.talking);

      boxx=this.x-camera.x-(textsize.width/2)
      boxy=this.y-camera.y-64
      padding=10;
      ctx.fillStyle = "#000000";
      ctx.fillRect(boxx,boxy,textsize.width+(padding*2),fontheight+(padding*2));
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(this.talking,boxx+padding,boxy+fontheight+padding);
    }
}
Person.prototype.distance=function(a,b) {
  x1=a.x
  x2=b.x
  y1=a.y
  y2=b.y
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}
Person.prototype.talk=function(text) {
  console.log("[dialog] "+text)
  this.talking=text;
  var p=this;
  setTimeout(function(){
    p.talking=null;
  },4000)
}
Person.prototype.hit=function(enemy) {
  this.force=0;
  this.punch=4000;
  if(this.distance({x:this.x,y:this.y},{x:enemy.x,y:enemy.y})<32) {
    enemy.angle=this.angle-180
    angle=this.angle-90;
  force=500;
  direction=new b2Vec2(force*Math.cos(angle*Math.PI/180),force*Math.sin(angle*Math.PI/180));
  enemy.hurt=100;
  if(enemy.ai==true) enemy.enemy=this;
  enemy.entity.GetBody().ApplyForce(
      direction,
      enemy.entity.GetBody().GetWorldCenter()
  );
  }
  
}
