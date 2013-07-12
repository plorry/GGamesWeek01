var gamejs = require('gamejs');
var Actor = require('./actors').Actor;

//Scene Class

var Scene = exports.Scene = function(director, sceneConfig) {
	this.director = director;
	this.display = this.director.display;

	//this.camera = new Camera(this, true);
	this._frozen = false;
	this.scroll = true;

	this.actors = new gamejs.sprite.Group();
	this.props = new gamejs.sprite.Group();

	var sceneId = sceneId || 0;
	this.elapsed = 0;
	this.initScene(sceneConfig);
	
	return this;
};

Scene.prototype.initScene = function(sceneConfig) {
	this.width = sceneConfig.width || 500;
	this.height = sceneConfig.height || 500;
	this.scale = sceneConfig.scale || 1;

	this.triggers = [];
	
    this.view = new gamejs.Surface([this.height, this.width]);
    this.image = gamejs.image.load(sceneConfig.image) || null;
	return;
};

Scene.prototype.addActors = function(actors) {
	this.actors.add(actors);
	return;
};

Scene.prototype.addProps = function(props) {
	this.props.add(props);
	return;
};

Scene.prototype.isFrozen = function() {
	return this._frozen;
};

Scene.prototype.freeze = function() {
	this._frozen = true;
	return;
};

Scene.prototype.unFreeze = function() {
	this._frozen = false;
	return;
};

Scene.prototype.draw = function(display) {
	this.view.fill("#000");

	if (this.image) {
		this.view.blit(this.image);
	}

	this.props.draw(this.view);
	this.actors.draw(this.view);

	var screen = gamejs.transform.scale(this.view, [500, 500]);
	
	//var size = screen.getSize();
	display.blit(screen);
	
	return;
};

Scene.prototype.handleEvent = function(event) {
	
	this.actors.forEach(function(actor) {
		actor.handleEvent(event);
	});
	return;
};

var order = function(a,b) {
	return a.rect.top-b.rect.top;
};

Scene.prototype.update = function(msDuration) {	
	if (!this.isFrozen()){
		//update actors	
		this.actors.forEach(function(actor){
			actor.update(msDuration);
		});
		//update props
		this.props.forEach(function(prop){
			prop.update(msDuration);
		});
	}
	//this.camera.update(msDuration);
	this.elapsed += msDuration;

	return;
};

var Trigger = exports.Trigger = function(options) {
	this._active = false;
	this.condition = options.condition;
	this.update = options.update || function() {return;};
	this.killCondition = options.killCondition || function() {return false;};
	this.killEvent = options.killEvent || function() {return;};
	return this;
};

Trigger.prototype.activate = function() {
	this._active = true;
	return;
};

Trigger.prototype.isActive = function() {
	return this._active;
};

Trigger.prototype.deactivate = function() {
	this._active = false;
	return;
};