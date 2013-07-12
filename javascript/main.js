var gamejs = require('gamejs');

var Level = require('./levels').Level;
var Cutscene = require('./levels').Cutscene;
var Turtle = require('./player').Turtle;
var Director = require('./gramework/game').Director;
var config = require('./config');

gamejs.preload(config.RESOURCES);

function main() {
    var director = new Director();
    var firstScene = new Level(director, config.scenes.game);
    var win = new Cutscene(director, config.scenes.win);

    director.next = win;
    director.start(firstScene);
    return;
}

gamejs.ready(main);