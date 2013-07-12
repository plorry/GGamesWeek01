var gamejs = require('gamejs');
var config = require('./config');
var objects = require('gamejs/utils/objects');
var Actor = require('./gramework/actors').Actor;

var Turtle = exports.Turtle = function(options) {
    Turtle.superConstructor.apply(this, arguments);
    //this.init(options);
    return this;
}
objects.extend(Turtle, Actor);

var radius = 0;

Turtle.prototype.init = function(options) {
    Actor.prototype.init.call(this, options);

    this.radius = 0;
    this.angle = 0;
    this.top_offset = 118;
    this.left_offset = 100;

    this._canSlam = true;
    this._isSlamming = false;
    this._isReturning = false;

    var turtle_opts = {
        scale: 1,
        height: 13,
        width: 25,
        x: 0,
        y: 0,
        spriteSheet: [
            config.turtle_image, {width:50, height:26}
        ],
        animations: {'static':[0]}
    };

    this.turtle_1 = new Actor(turtle_opts);
    this.turtle_1.parent = this;
    turtle_opts.spriteSheet = [config.antiturtle_image, {width:50, height:26}];
    this.turtle_2 = new Actor(turtle_opts);
    this.turtle_2.parent = this;

    this.pain = 0;
    return;
};

Turtle.prototype.update = function(msDuration) {
    Actor.prototype.update.call(this, msDuration);
    if (!this._isSlamming && !this._isReturning) {
        this.radius = this.mouse_y / 6 + 15;
        if (this.radius < 30) {
            this.radius = 30;
        }
    } else if (this._isSlamming){
        this.radius -= 15;
    } else if (this._isReturning) {
        this.radius += 7;
    }

    if (this.radius >= this.lockRadius) {
        this.restore();
    }
    if (this.radius <= 0) {
        this.return();
    }
    
    this.turtle_1.realRect.top = (Math.sin(this.mouse_x / 80) * this.radius) + this.top_offset;
    this.turtle_1.realRect.left = (Math.cos(this.mouse_x / 80) * this.radius) + this.left_offset;

    this.turtle_2.realRect.top = (Math.sin((this.mouse_x / 80) + Math.PI) * this.radius) + this.top_offset;
    this.turtle_2.realRect.left = (Math.cos((this.mouse_x / 80) + Math.PI) * this.radius) + this.left_offset;

    this.turtle_1.update(msDuration);
    this.turtle_2.update(msDuration);

    return;
};

Turtle.prototype.draw = function(display) {
    this.turtle_1.draw(display);
    this.turtle_2.draw(display);
    return;
};

Turtle.prototype.slam = function() {
    this._isSlamming = true;
    this._canSlam = false;
    this.lockAngle = this.mouse_x;
    this.lockRadius = this.radius;
    return;
};

Turtle.prototype.return = function() {
    this._isSlamming = false;
    this._isReturning = true;
    return;
};

Turtle.prototype.restore = function() {
    this._isSlamming = false;
    this._isReturning = false;
    this._canSlam = true;
    return;
};

Turtle.prototype.handleEvent = function(event) {
    if (event.type === gamejs.event.MOUSE_MOTION) {
        this.mouse_x = event.pos[0];
        this.mouse_y = event.pos[1];
    } else if (event.type === gamejs.event.MOUSE_DOWN && this._canSlam) {
        this.slam();
    }
    return;
};


var Baddie = exports.Baddie = function(options) {
    Baddie.superConstructor.apply(this, arguments);
    this.direction = options.direction || 0;
    this.spriteType = 'baddie';
    return this;
};
objects.extend(Baddie, Actor);

Baddie.prototype.update = function(msDuration) {
    if (this.direction == 0) {
        this.realRect.top += 1;
    } else {
        this.realRect.top -= 1;
    }
    Actor.prototype.update.call(this, msDuration);
    return;
};

var Peanut = exports.Peanut = function(options, level) {
    Peanut.superConstructor.apply(this, arguments);
    this.spriteType = 'peanut';
    this.counter = 0;
    this.wiggle = 1;
    this.damage = 0;
    this.level = level;
    return this;
};
objects.extend(Peanut, Actor);

Peanut.prototype.update = function(msDuration) {
    this.counter ++;

    if (this.counter >= 10) {
        this.angle += (Math.PI / 180) * this.wiggle;
        this.counter = 0;
        if (this.angle > (Math.PI / 12)) {
            this.wiggle = -1;
        } if (this.angle < -(Math.PI / 12)) {
            this.wiggle = 1;
        }
    }

    if (this.damage > 3000) {
        this.animation.start('broken');
    } if (this.damage > 8000) {
        this.animation.start('smashed');
    }

    Actor.prototype.update.call(this, msDuration);
    return;
};

var shard_opts = {
    x: 125,
    y: 125,
    scale: 1,
    width: 4,
    height: 4,
    spriteSheet: [
        config.shard_image, {width:8, height:8}
    ],
    animations: {'static':[0]}
}

Peanut.prototype.smash = function(damage) {
    this.damage += damage;
    
    var shards = [
        new Shard(shard_opts),
        new Shard(shard_opts),
        new Shard(shard_opts)
    ];
    this.level.addProps(shards);
    return;
};


var Shard = exports.Shard = function(options) {
    Shard.superConstructor.apply(this, arguments);
    this.direction = Math.random() * Math.PI * 2;
    this.life = 0;
    return this;
};
objects.extend(Shard, Actor);

Shard.prototype.update = function(msDuration) {
    this.realRect.top += 1 * (Math.cos(this.direction));
    this.realRect.left += 1 * (Math.sin(this.direction));

    this.life ++;
    if (this.life > 20) {
        this.kill();
    }

    Actor.prototype.update.call(this, msDuration);
    return;
};
