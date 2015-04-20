

var balls=[]
var   b2Vec2 = Box2D.Common.Math.b2Vec2
, b2BodyDef = Box2D.Dynamics.b2BodyDef
, b2Body = Box2D.Dynamics.b2Body
, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
, b2Fixture = Box2D.Dynamics.b2Fixture
, b2World = Box2D.Dynamics.b2World
, b2MassData = Box2D.Collision.Shapes.b2MassData
, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
;
function GolfScene(canvas) {
	console.log("Golf scene starting")
  this.ballradius=6;
  this.hole=null;
  this.shot=0;
  this.turn=null;
  this.camera={x:0,y:0}
  this.cursor=null;
  this.editor=false;
  this.startcursor=null;
  this.canvas=canvas;
  this.balls=new Array();
  this.newpoly=null;
  this.dialog=0;
  this.dialogscript=introscript;
  this.scale=32;
  this.scores=[[0,0],[0,0],[0,0]];
  this.shots=[[],[],[]];
  this.waiting=false;
  this.people=new Array();
  this.introstarted=false;
  this.entities=new Array();
  this.ctx=canvas.getContext('2d');
  this.speechbubbles=new Array();
  this.puttershop={x:730,y:1300}

  this.world = new b2World(
             new b2Vec2(0, 0)    //gravity
          ,  false                 //allow sleep
          );
  this.bigworld = new b2World(
             new b2Vec2(0, 0)    //gravity
          ,  false                 //allow sleep
          );



       //setup debug draw
       this.debugDraw = new b2DebugDraw();
       this.debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
       this.debugDraw.SetDrawScale(this.scale);
       this.debugDraw.SetFillAlpha(0.3);
       this.debugDraw.SetLineThickness(1.0);
       this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
       this.world.SetDebugDraw(this.debugDraw);
       this.map = new Image();
       this.map.src = 'img/map.png';
       for(i in polygons) {
        this.addpolygon(polygons[i]);
      }
  // setup people world
  playerstart={x:570,y:2030};
  if(this.hole!=null) playerstart=holes[this.hole].start
  player=new Person(570,2000,this.bigworld,this.scale);
  this.people.push(player);
  player=new Person(640,1890,this.bigworld,this.scale);
  player.setsprite(2);
  player.thinking=720;
  player.destination={x:740,y:1300}
  this.people.push(player);
  clerk=new Person(650,1300,this.bigworld,this.scale);
  this.people.push(clerk);
  var game=this;
  setInterval(function(){
    if(game.dialogscript[game.dialog]!=null) {
      valid=true;
      for(i in game.people) {
        if(game.people[i].talking!=null) valid=false;
      }
      if(valid==true) {
        game.people[game.dialogscript[game.dialog].id].talk(game.dialogscript[game.dialog].text);
        game.dialog=game.dialog+1;
      }
    } else {
      game.people[0].stuck=false;
      if(game.people[0].gotputter==false && game.introstarted==true) {
        game.people[0].gotputter=true;
        game.people[1].gotputter=true;
        game.nextgoal();
      }
      
    }
  },600);
}

GolfScene.prototype.distance=function(a,b) {
  x1=a.x
  x2=b.x
  y1=a.y
  y2=b.y
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

GolfScene.prototype.addball=function() {
  newball=new Ball(holes[this.hole].start.x,holes[this.hole].start.y,this.world,this.scale);
  this.balls.push(newball);
}
GolfScene.prototype.addpolygon=function(poly) {
  var entity=new Entity(poly,this.scale);
  this.entities.push(entity)
  this.world.CreateBody(entity.bodyDef).CreateFixture(entity.fixDef);
}
GolfScene.prototype.nextdialog=function() {
  
  

}

GolfScene.prototype.update=function() {
  // ai shit
  guy=this.people[1];
  if(guy.thinking>0) {
    guy.thinking=guy.thinking-1;
  }
  if(this.waiting==false && guy.thinking==0) {
    if(this.people[1].atdestination()==false) {
      if(this.people[1].destination==null) {
        // needs destination?
        if(this.balls.length>0 && this.balls[0].x!=null && this.turn==1) {
          this.people[1].destination={x:this.balls[0].x,y:this.balls[0].y};
        } 
      } else {
        // has destination
        angle=(Math.atan2(guy.destination.y-guy.y,guy.destination.x-guy.x)*(180/Math.PI))+90
        if(angle<guy.angle) {
          guy.angle=guy.angle-4;
        } else if(angle>guy.angle) {
          guy.angle=guy.angle+4;
        }
        guy.direction=1;
        
      }
    } else {
      // in destination
      guy.destination=null;
      guy.direction=null;  
      if(this.hole!=null && this.turn==1 && this.waiting==false) {

        
        var shot=aishots[this.hole][this.shot];
        var ball=this.balls[0];
        var game=this;
        this.waiting=true;
          game.shot=game.shot+1;
          ball.shoot(shot);
      }
      
    }
      
    


    
  }
  
  // camera stuff
  if(this.people[0]) {
    this.camera.x=this.people[0].x-(this.canvas.width/2)
    this.camera.y=this.people[0].y-(this.canvas.height/2)

  }
  ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );
  this.ctx.lineWidth = 1;
 this.bigworld.Step(
             1 / 60   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
          );
  this.world.Step(
             1 / 60   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
          );
  if(this.editor==true) {
   this.world.DrawDebugData();

 }
 this.world.ClearForces();
 this.bigworld.ClearForces();
 this.ctx.strokeStyle = '#000000';

    // map

    ctx.drawImage(this.map, this.camera.x*-1, this.camera.y*-1);


    if(this.startcursor!=null) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startcursor.x-this.camera.x, this.startcursor.y-this.camera.y);
      this.ctx.lineTo(this.cursor.x-this.camera.x, this.cursor.y-this.camera.y);
      this.ctx.lineWidth = 10;
      this.ctx.stroke();   
    }

    // draw goals
    if(this.editor==true) {
      for(i in holes) {
        hole=holes[i];
        ctx.beginPath();
        ctx.arc(hole.goal.x-this.camera.x, hole.goal.y-this.camera.y, this.ballradius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.stroke();
      }
    }
   
  // draw balls
  for(i in this.balls) {

    ball=this.balls[i];
    ball.draw(this.ctx,this.camera);
    togoal=this.distance({x:ball.x,y:ball.y},holes[this.hole].goal);

    if(this.waiting==true) {
      if(ball.entity.GetBody().GetLinearVelocity().Length()<0.05) this.waiting=false;

    }
    if(togoal<4) {
      this.world.DestroyBody(ball.entity.GetBody());
      this.balls.splice(i,1);
      this.nextgoal();
      console.log(JSON.stringify(this.shots[this.hole]));
    }
  }

  // draw people
  for(i in this.people) {
    person=this.people[i];
    person.draw(this.ctx,this.scale,this.camera)
  }
  // putter scene
  if(this.people[0].gotputter==false && this.people[0].stuck==false) {
        d=this.people[0].distance({x:this.people[0].x,y:this.people[0].y},this.puttershop);
        if(d<20) {
          this.people[0].stuck=true;
          this.dialogscript=putterscript;
          this.introstarted=true;
          this.dialog=0;
        }
  }
  // editor line
  if(this.newpoly) {
    this.ctx.strokeStyle = '#000000';

    this.ctx.beginPath();
    this.ctx.moveTo(this.newpoly[0].x-this.camera.x, this.newpoly[0].y-this.camera.y);
    this.ctx.lineWidth = 1;
    for(i in this.newpoly) {
      this.ctx.lineTo(this.newpoly[i].x-this.camera.x, this.newpoly[i].y-this.camera.y);
      this.ctx.stroke();
    }
    this.ctx.lineTo(this.cursor.x-this.camera.x, this.cursor.y-this.camera.y);
    this.ctx.stroke();

  }

  // debug entities
  if(this.editor==true) {
    for(i in this.entities) {
      this.entities[i].draw(this.ctx,this.camera);
    }
  }
  

  // debug text

  this.ctx.fillStyle = "#000000";
  this.ctx.font="10px Menlo";
  modestr="play mode"
  modestr=modestr+" (hole: "+this.hole+" turn: "+this.turn+" shot: "+this.shot+")"
  if(this.editor==true) modestr="edit mode"
    this.ctx.fillText(modestr,10,20);

  // speech bubbles
 for(i in this.people) {
    person=this.people[i];
    person.drawspeech(this.ctx,this.scale,this.camera)
  }

}; 

GolfScene.prototype.nextgoal=function(e) {
  this.shot=0;
  var legal=true;

  if(this.turn==null) {
    this.turn=0;
  } else if(this.turn==0) {
    this.turn=1;
  } else if(this.turn==1) {
    this.turn=0;
    if(this.hole<2) {
      this.hole=this.hole+1;
      this.people[1].destination={x:holes[this.hole].start.x,y:holes[this.hole].start.y-64}
    } else {
      legal=false;
    }
  }
  if(this.hole==null) {
    this.hole=0;
    this.people[1].destination={x:holes[this.hole].start.x,y:holes[this.hole].start.y+64}
    var pheldon=this.people[1]
    setTimeout(function(){
      pheldon.talk("OK you go first")
    },1000)
    
  }
  if(this.turn==0 && legal==true) {
    this.dialogscript=gamescript[this.hole];
    this.dialog=0;
  }
 
  if(legal==true) this.addball();

}

// controls
GolfScene.prototype.mousedown=function(e) {
  if(this.editor==false) {
    this.startcursor=this.cursor;
  } else {
    if(this.newpoly==null) this.newpoly=new Array();
    this.newpoly.push(this.cursor);

    if(this.newpoly.length==4) {
    console.log(JSON.stringify(this.newpoly));

      this.addpolygon(this.newpoly);
      this.newpoly=null;
      this.editor=false;
    }
  }
  
}

GolfScene.prototype.mouseup=function(e) {
  if(this.editor==false && this.waiting==false && this.turn==0) {
    // shoot ball
    this.waiting=true;
    angle=Math.atan2(this.startcursor.y-this.cursor.y,this.startcursor.x-this.cursor.x)*(180/Math.PI)
    force=this.distance(this.startcursor,this.cursor);
    force=force*2;
    var shot={angle:angle,force:force}
    if(this.turn==0) {
          this.shots[this.hole].push(shot);
    }
    this.balls[0].shoot(shot);
    
  }
  this.startcursor=null;

}
GolfScene.prototype.mousemove=function(e) {
  this.cursor = {x:e.clientX+this.camera.x, y: e.clientY+this.camera.y}
  if(this.people[0] && this.startcursor==null && true==false) {
    angle=Math.atan2(this.people[0].y-this.cursor.y,this.people[0].x-this.cursor.x)*(180/Math.PI)
    this.people[0].angle=angle-90;
  }
}
GolfScene.prototype.keydown=function(e) {
  if(e.keyCode>36 && e.keyCode<41) {
    // camera controls
    if(e.keyCode==38) {
      cameray=cameray-4;
    } else if(e.keyCode==40) {
      cameray=cameray+4;
    } else if(e.keyCode==37) {
      camerax=camerax-4;
    } else if(e.keyCode==39) {
      camerax=camerax+4;
    }
  } else if((e.keyCode==87||e.keyCode==65||e.keyCode==83||e.keyCode==68) && this.people[0].stuck==false) {
    var direction=null;
    // WASD
    if(e.keyCode==87) direction=1; // W
    // if(e.keyCode==65) direction=3; // A
    if(e.keyCode==83) direction=2; // Ss
   // if(e.keyCode==68) direction=1; // D 
    if(e.keyCode==65) {
      this.people[0].angle=this.people[0].angle-4
    }
    if(e.keyCode==68) {
      this.people[0].angle=this.people[0].angle+4
    }
    if(direction) this.people[0].direction=direction;
  } else if(e.keyCode==88) {
    if(this.editor==true) {
      this.editor=false;
      this.startcursor=null;
      this.newpoly=null;
      console.log("switched to play mode")
    } else {
      this.editor=true;
      console.log("switched to edit mode")
    }
  } else {
    console.log(e.keyCode+" is not a shortcut");
  }
}
GolfScene.prototype.keyup=function(e) {
  if(e.keyCode==87||e.keyCode==83) {
    this.people[0].direction=null;
    
  }
}