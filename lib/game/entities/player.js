ig.module(
  'game.entities.player'
  )
.requires( 
  'impact.entity'
  )
.defines(function(){
  var soundSplat = [];
  EntityPlayer = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/player/gun/alienGreenSprite_gun.png', 79, 96 ),
    offset: {x:13, y:0},
    size: {x: 47, y:92},
    maxVel: {x: 300, y: 5000}, 
    friction: {x: 2000, y: 0},
    accelGround: 650, 
    accelAir: 400,
    jump: 950,
    flip:false,
    startPosition: {x:113, y:2708},
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    cameraSnowBallX: 0,
    currentLeft: false,
    currentRight: false,
    currentIdle: true,

    init: function( x, y, settings ) {
      
      this.addAnim( 'idle', 1, [0] );
      this.addAnim( 'run', 0.2, [1,2,3] );
      this.addAnim( 'shoot', 1, [4,5] );
      this.addAnim( 'jump', 1, [6] );
      this.addAnim( 'jump_shoot', 1, [7,8] );
      this.addAnim( 'fall', 0.4, [2] );
      this.addAnim( 'hurt', 0.4, [9] );
      this.parent( x, y, settings );

      soundSplat.push(new ig.Sound( 'media/sounds/splat1.ogg' ))
      soundSplat.push(new ig.Sound( 'media/sounds/splat2.ogg' ))
      soundSplat.push(new ig.Sound( 'media/sounds/splat3.ogg' ))
      soundSplat.push(new ig.Sound( 'media/sounds/splat4.ogg' ))
      soundSplat.push(new ig.Sound( 'media/sounds/splat5.ogg' ))
      soundSplat.push(new ig.Sound( 'media/sounds/splat6.ogg' ))
    },
    kill: function(){ 
      this.parent();
      var x = this.startPosition.x;
      var y = this.startPosition.y; 
      
      splatnoise = Math.floor((Math.random()*5)+0);
      soundSplat[splatnoise].play();
     ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,
{callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
    },
    update: function(){
      //move left and right
      // console.log(this)
      var accel = this.standing ? this.accelGround : this.accelAir;

      if (ig.input.state('left')) {
        this.accel.x = -accel;
        this.flip = true;
        this.currentAnim = this.anims.run;
        this.anims.run.flip.x = true
        if (!this.currentLeft) {
          this.currentLeft = true;
          this.currentRight = false;
          this.currentIdle = false;
          // this.cameraSnowBall = 0;
        };

      }else if (ig.input.state('right')) {
        this.accel.x = accel;
        this.flip = false;
        this.currentAnim = this.anims.run;
        this.anims.run.flip.x = false
        if (!this.currentRight) {
          this.currentLeft = false;
          this.currentRight = true; 
          this.currentIdle = false; 
          // this.cameraSnowBall = 0;
        };
        
      }else{
        this.accel.x = 0;
        this.currentAnim = this.anims.idle;
        // this.currentLeft = false;
        // this.currentRight = false; 
        // this.currentIdle = true; 
      }

      if (this.standing && ig.input.pressed('jump')) {
        this.vel.y = -this.jump;
        this.currentAnim = this.anims.jump;
      }

      // if (ig.input.state('jump')) {

      //  this.currentAnim = this.anims.jump;
      //  if (ig.input.state('right')){
      //    this.anims.jump.flip.x = false
      //  }else{
      //    this.anims.jump.flip.x = true
      //  }
      // }

      if (this.vel.y < 0) {
        this.currentAnim = this.anims.jump;
      }else if (this.vel.y > 0) {
        this.currentAnim = this.anims.fall;
      }else if (this.vel.x != 0 ) {
        this.currentAnim = this.anims.run;
      }else{
        this.currentAnim = this.anims.idle;
      }

      
      // shoot
      if( ig.input.pressed('shoot') ) {
        ig.game.spawnEntity( EntityBullet, this.pos.x, this.pos.y, {flip:this.flip} ); 
        if (this.vel.y < 0 || this.vel.y > 0) {
          this.currentAnim = this.anims.jump_shoot;
        }else{
          this.currentAnim = this.anims.shoot;
        }
        
      } 
      // if( ig.input.state('shoot') ) {
        
      // }  


      this.currentAnim.flip.x = this.flip;
      this.parent();
    }

  })

  EntityBullet = ig.EntityBullet = ig.Entity.extend({
    size: {x:54 ,y:9 },
    animSheet: new ig.AnimationSheet('media/laserBlue01.png', 54, 9),
    maxVel:{x:600, y:0},
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function(x,y, settings){
      this.parent(x+(settings.flip ? -4 : 50), y+65, settings);
      this.vel.x = this.accel.x = (settings.flip ? - this.maxVel.x : this.maxVel.x);
      this.addAnim('idle', 0.2, [0]);
      this.addAnim('hit', 1, [1])
      this.anims.idle.flip.x = settings.flip;
    },
    handleMovementTrace: function(res) {
      this.parent(res);
      if (res.collision.x || res.collision.y) {
        this.kill();
      };
    },
    check: function (other) {
      other.receiveDamage(10, this);
      this.kill();
    }
  })

  EntityDeathExplosion = ig.Entity.extend({ lifetime: 1,
    callBack: null,
    particles: 200,
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      for(var i = 0; i < this.particles; i++)
        ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
      this.idleTimer = new ig.Timer();
    },
    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) { this.kill();
        if(this.callBack) this.callBack();
        return; 
      }
    }
  });

  EntityDeathExplosionParticle = ig.Entity.extend({ size: {x: 5, y: 5},
    maxVel: {x: 1000, y: 1000},
    lifetime: 3,
    fadetime: 1,
    bounciness: 0,
    vel: {x: 100, y: 300},
    friction: {x:50, y: 0},
    collides: ig.Entity.COLLIDES.LITE,
    colorOffset: 0,
    totalColors: 4,
    animSheet: new ig.AnimationSheet( 'media/player/blood3.png', 5, 5 ), init: function( x, y, settings ) {
      this.parent( x, y, settings );
      var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
      this.addAnim( 'idle', 0.2, [frameID] );
      this.vel.x = (Math.random() * 2 - 1) * this.vel.x; this.vel.y = (Math.random() * 2 - 1) * this.vel.y; this.idleTimer = new ig.Timer();
    },
    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) { this.kill();
        return; }
        this.currentAnim.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime,
          1, 0
          );
        this.parent(); }
      });

})