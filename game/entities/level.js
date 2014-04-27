var Board = require('./board');

Level = function(game, difficulty) {
  this.game = game;

  this.container = new PIXI.DisplayObjectContainer();

  this.frontBoard = new Board(this, 3, 3);
  this.frontBoard.container.position.x = 50;
  this.frontBoard.container.position.y = 100;
  this.container.addChild(this.frontBoard.container);

  this.backBoard = new Board(this, 3, 3);
  this.backBoard.container.position.x = 450;
  this.backBoard.container.position.y = 100;
  this.container.addChild(this.backBoard.container);
}

Level.prototype.update = function(delta) {

}

Level.prototype.draw = function(renderer, delta) {
  this.frontBoard.draw(renderer, delta);
  this.backBoard.draw(renderer, delta);
}

module.exports = Level;