ig.module( 
  'game.main' 
)
.requires(
  'game.levels.level1',
  'plugins.camera',
  'impact.game'
  // 'impact.font'
)
.defines(function(){

MyGame = ig.Game.extend({
  
  // Load a font
  font: new ig.Font( 'media/04b03.font.png' ),

  
  gravity: 2000,
  init: function() {
    // Initialize your game here; bind keys etc.
    ig.music.add( 'media/songs/ambientloop.*' );
    ig.music.volume = 1;
    
    this.camera = new Camera( 960/2-23, ig.system.height/3, 5 );
    this.camera.trap.size.x = 47;
    this.camera.trap.size.y = ig.system.height/3;
    this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;
    this.camera.draw()

    ig.input.bind( ig.KEY.LEFT_ARROW, 'left')
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right')
    ig.input.bind( ig.KEY.SPACE, 'jump')
    ig.input.bind( ig.KEY.S, 'shoot')
    this.loadLevel(LevelLevel1);
    // ig.music.play();
  },
  loadLevel: function( level ) {        
    this.parent( level );

    this.player = this.getEntitiesByType( EntityPlayer )[0];
    
    // Set camera max and reposition trap
    this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
    this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
    
    this.camera.set( this.player );
  },
  update: function() {
    // Update all entities and backgroundMaps, call this at the start.
    this.parent();
    var player = this.getEntitiesByType(EntityPlayer)[0];
    if (player) {
      this.camera.follow( player );
    }
  },
  
  draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();
    
    
    // Add your own drawing code here
    var x = ig.system.width/2,
      y = ig.system.height/2;
    
    // this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
  }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 960, 640, 1 );

});
