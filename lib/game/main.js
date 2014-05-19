ig.module( 
  'game.main' 
)
.requires(
  'game.levels.level1',
  'plugins.camera',
  'impact.game',
  'impact.font',

  'plugins.camera',
  'plugins.touch-button',
  'plugins.impact-splash-loader',
  'plugins.gamepad'

)
.defines(function(){

MyGame = ig.Game.extend({
  
  // Load a font
  font: new ig.Font( 'media/fredoka-one.font.png' ),

  clearColor: "#d0f4f7",
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

    ig.input.bind( ig.GAMEPAD.PAD_LEFT, 'left' );
    ig.input.bind( ig.GAMEPAD.PAD_RIGHT, 'right' );
    ig.input.bind( ig.GAMEPAD.FACE_1, 'jump' );
    ig.input.bind( ig.GAMEPAD.FACE_2, 'shoot' );  
    ig.input.bind( ig.GAMEPAD.FACE_3, 'shoot' );

    // Align touch buttons to the screen size, if we have any
    if( window.myTouchButtons ) {
      window.myTouchButtons.align(); 
    }

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
    var cx = ig.system.width/2;
    this.font.draw( "adrian", cx, 420, ig.Font.ALIGN.CENTER);
    // Add your own drawing code here
    var x = ig.system.width/2,
      y = ig.system.height/2;
    
    // this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );

    // Draw touch buttons, if we have any
    if( window.myTouchButtons ) {
      window.myTouchButtons.draw(); 
    }
  }
});


if( ig.ua.mobile ) {
  // If we're running on a mobile device and not within Ejecta, disable 
  // sound completely :(
  if( !window.ejecta ) {
    ig.Sound.enabled = false;
  }

  // Use the TouchButton Plugin to create a TouchButtonCollection that we
  // can draw in our game classes.
  
  // Touch buttons are anchored to either the left or right and top or bottom
  // screen edge.
  var buttonImage = new ig.Image( 'media/touch-buttons.png' );
  myTouchButtons = new ig.TouchButtonCollection([
    new ig.TouchButton( 'left', {left: 0, bottom: 0}, 128, 128, buttonImage, 0 ),
    new ig.TouchButton( 'right', {left: 128, bottom: 0}, 128, 128, buttonImage, 1 ),
    new ig.TouchButton( 'shoot', {right: 128, bottom: 0}, 128, 128, buttonImage, 2 ),
    new ig.TouchButton( 'jump', {right: 0, bottom: 96}, 128, 128, buttonImage, 3 )
  ]);
}


// If our screen is smaller than 640px in width (that's CSS pixels), we scale the 
// internal resolution of the canvas by 2. This gives us a larger viewport and
// also essentially enables retina resolution on the iPhone and other devices 
// with small screens.
var scale = (window.innerWidth < 640) ? 2 : 1;

// We want to run the game in "fullscreen", so let's use the window's size
// directly as the canvas' style size.
var canvas = document.getElementById('canvas');
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

// Finally, start the game into MyTitle and use the ImpactSplashLoader plugin 
// as our loading screen
var width = window.innerWidth * scale,
  height = window.innerHeight * scale;
ig.main( '#canvas', MyGame, 60, width, height, 1, ig.ImpactSplashLoader );

});