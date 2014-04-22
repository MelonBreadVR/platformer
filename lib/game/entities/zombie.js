ig.module(
	'game.entities.zombie'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityZombie = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/zombie/frogsprites.png', 61, 52 ),
		size: {x: 55, y: 50},
		maxVel: {x:200, y: 100},
		flip: false,
		friction: {x: 150, y: 0}, 
		speed: 250,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		init: function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('walk', .15, [0,1])
		},
		update: function() {
			//near an edge? return!
			if (!ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? + 4 : this.size.x -4),
				this.pos.y + this.size.y +1
				)
			){
				this.flip = !this.flip;
			}
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},
		handleMovementTrace: function(res){
			this.parent(res);

			//collision with a wall? return!
			if (res.collision.x) {
				this.flip = !this.flip;
			}
		},
		check: function (other) {
			other.receiveDamage(10, this);
		}

	});
})
