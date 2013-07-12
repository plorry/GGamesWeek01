var gamejs = require('gamejs');
var Sprite = require('gamejs/sprite').Sprite;
var draw = require('gamejs/draw');
var objects = require('gamejs/utils/objects');
var config = require('../config');
var SpriteSheet = require('./animate').SpriteSheet;
var Animation = require('./animate').Animation;

var Actor = exports.Actor = function(options) {
	Actor.superConstructor.apply(this, arguments);
	this.init(options);
    return this;
};
objects.extend(Actor, Sprite);

Actor.prototype.init = function(options) {
	this.scale = options.scale || 5;
	this.x = options.x;
	this.y = options.y;
	this.height = options.height;
	this.width = options.width;
	this.angle = options.angle * (Math.PI / 180) || 0;
	this.density = options.density || 2;

    this.absAngle = this.angle;

	this.startingAnimation = options.startingAnimation || 'static';

	this.rect = new gamejs.Rect(
		[(this.x - this.width) * this.scale, (this.y - this.height) * this.scale],
		[this.width * 2 * this.scale, this.height * 2 * this.scale]);
	this.realRect = new gamejs.Rect(this.rect);
	//this.collisionRect = new gamejs.Rect([this.rect.left+1, this.rect.top+1],[this.rect.width-2, this.rect.height-2]);
	
	if (options.spriteSheet) {
        this.spriteSheet = new SpriteSheet(options.spriteSheet[0], options.spriteSheet[1]) || null;
        var animations = options.animations || DEFAULT_ANIMATIONS;
        this.animation = new Animation(this.spriteSheet, animations);
        this.animation.start(this.startingAnimation);
    }

	return;
};

Actor.prototype.update = function(msDuration) {
	
	if (this.physics) {
		this.realRect.center = [this.body.body.GetPosition().x * this.scale, this.body.body.GetPosition().y * this.scale];
	}

	this.rect.top = Math.round(this.realRect.top) + 0.5;
	this.rect.left = Math.round(this.realRect.left) + 0.5;
	
	if (this.animation) {
		this.animation.update(msDuration);
		this.image = this.animation.image;
	}

	//this.body.body.
	return;
};

Actor.prototype.handleEvent = function(event) {
	return;
};

Actor.prototype.handleCollisions = function(collisions) {
    for (var i=0; i<collisions.length; i++) {
    	if (this.parent._isSlamming) {
    		this.parent.return();
    		if (collisions[i].spriteType == 'peanut') {
    			collisions[i].smash(this.parent.lockRadius);
    		}
    	}
    	if (collisions[i].spriteType == 'baddie') {
    		this.parent.pain += 1;
    		collisions[i].kill();
    	}
    }
    return;
};

Actor.prototype.draw = function(display) {
	//cq(this.image._canvas).matchPalette(palettes.simple);
	
	if (this.spriteSheet) {
		if (this.image) {
			this.image = gamejs.transform.rotate(this.image, (this.angle) * (180 / Math.PI));
			gamejs.sprite.Sprite.prototype.draw.apply(this, arguments);
		};
	} else {
		//draw.rect(display, "#000FFF", new gamejs.Rect(this.pos, [5,5]));
	}
	
	if (config.DEBUG) {
		var color = "#000FFF";
		if (!this._inControl) {
			var color = "#555000";
		}
		draw.rect(display, color, this.rect, 1);
	}
	return;
};