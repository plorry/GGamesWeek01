var gamejs = require('gamejs');
var Scene = require('./gramework/scenes').Scene;
var Turtle = require('./player').Turtle;
var Baddie = require('./player').Baddie;
var Peanut = require('./player').Peanut;
var objects = require('gamejs/utils/objects');
var config = require('./config');

var Level = exports.Level = function(director, options) {
    Level.superConstructor.apply(this, arguments);
    this.creatorCounter = 180;
    this.options = options;
    var peanut_opts = {
        scale: 1,
        x: 125,
        y: 125,
        width: 17,
        height: 42,
        spriteSheet: [
            config.peanut_image, {width:35, height:84}
        ],
        animations: {
            'static':[0],
            'broken':[1],
            'smashed':[2]
        }
    };
    var turtle_opts = {
        x: 10,
        y: 5,
        height: 1,
        width: 1
    };
    this.turtle = new Turtle(turtle_opts);
    this.turtle.pain = 0;

    this.addActors([this.turtle]);
    this.peanut = new Peanut(peanut_opts, this);
    console.log(this.peanut);
    this.addProps([this.peanut]);
    this.speed = 200;
    this.lifeRect = new gamejs.Rect(25, 450, 200, 15);
    return this;
};
objects.extend(Level, Scene);

var baddie_opts = {
    scale: 1,
    x: 0,
    y: 0,
    width: 3,
    height: 3,
    spriteSheet: [
        config.sparkle_image, {width:6, height:6}
    ],
    animations: {'static':[0,2]}
};

Level.prototype.update = function(msDuration) {
    this.lifeRect.width = 200 - (this.turtle.pain * 200 / 3)
    this.speed = 200 - (this.peanut.damage / 70);

    this.creatorCounter += 1;

    var that = this;

    this.actors.forEach(function(actor){
        var collisions_1 = gamejs.sprite.spriteCollide(actor.turtle_1, that.props, false);
        var collisions_2 = gamejs.sprite.spriteCollide(actor.turtle_2, that.props, false);

        actor.turtle_1.handleCollisions(collisions_1);
        actor.turtle_2.handleCollisions(collisions_2);
    });

    if (this.creatorCounter >= this.speed) {
        this.creatorCounter = 0;
        baddie_opts.x = Math.floor(Math.random() * 250);
        baddie = new Baddie(baddie_opts);
        this.addProps([baddie]);
    }

    Scene.prototype.update.call(this, msDuration);

    if (this.peanut.damage > 10000) {
        this.director.nextScene();
    }
    if (this.turtle.pain > 2) {
        this.restart();
    }
    return;
};

Level.prototype.restart = function() {
    var restarted = new Level(this.director, this.options);
    this.director.start(restarted);
};

Level.prototype.draw = function(display) {
    Scene.prototype.draw.call(this, display);
    gamejs.draw.rect(display, "#eee222", this.lifeRect, 0);
    return;
};


var Cutscene = exports.Cutscene = function(director, options) {
    Cutscene.superConstructor.apply(this, arguments);
    return this;
};
objects.extend(Cutscene, Scene);
