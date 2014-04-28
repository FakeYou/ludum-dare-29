var Gameloop = require('gameloop');

var Level = require('./entities/level');
var Grid = require('./utils/grid');
var Generator = require('./utils/generator');

Game = function() {
  var _this = this;

  this.renderer = new PIXI.CanvasRenderer(800, 800);

  this.loop = new Gameloop({
    renderer: this.renderer
  });

  this.loop.on('start', function() {
    _this.setup();
  });

  this.loop.on('update', function(delta) {
    _this.update(delta)
  });

  this.loop.on('draw', function(renderer, delta) {
    _this.draw(renderer, delta);
  })
}

Game.prototype.start = function() {
  this.loop.start();
}

Game.prototype.setup = function() {
  $('body').append(this.renderer.view);

  this.stage = new PIXI.Stage(0xEEEEEE);

  this.grid = new Grid(this);
  this.stage.addChild(this.grid.graphics);

  this.level = new Level(this, Generator.difficulties.MEDIUM);
  this.stage.addChild(this.level.container);
}

Game.prototype.update = function(delta) {
  this.level.update(delta);
}

Game.prototype.draw = function(renderer, delta) {
  this.grid.draw(renderer, delta);
  this.level.draw(renderer, delta);

  renderer.render(this.stage);
}

module.exports = Game;