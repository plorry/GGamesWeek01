var gamejs = require('gamejs');

var WIDTH = exports.WIDTH = 250;
var HEIGHT = exports.HEIGHT = 250;

exports.DEBUG = false;

var STATIC_PATH = exports.STATIC_PATH = './static/';
var tree_image = exports.tree_image = STATIC_PATH + 'sprites/wood.png';
var turtle_image = exports.turtle_image = STATIC_PATH + 'sprites/turtle.png';
var antiturtle_image = exports.antiturtle_image = STATIC_PATH + 'sprites/antiturtle.png';
var space_image = exports.space_image = STATIC_PATH + 'backgrounds/space.png';
var peanut_image = exports.peanut_image = STATIC_PATH + 'sprites/peanut.png';
var sparkle_image = exports.sparkle_image = STATIC_PATH + 'sprites/sparkle.png';
var bigbang_image = exports.bigbang_image = STATIC_PATH + 'backgrounds/bigbang.png';
var shard_image = exports.shard_image = STATIC_PATH + 'sprites/shard.png';

exports.RESOURCES = [
    turtle_image,
    antiturtle_image,
    space_image,
    peanut_image,
    sparkle_image,
    bigbang_image,
    shard_image
];

exports.SCALE = 2;

exports.scenes = {
	'game': {
        'width': WIDTH,
        'height': HEIGHT,
        'scale': 2,
        'image': space_image
	},
    'win': {
        'width': WIDTH,
        'height': HEIGHT,
        'scale': 2,
        'image': bigbang_image
    }
};