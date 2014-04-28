var Board = require('./board');
var Generator = require('../utils/generator');

Level = function(game, difficulty) {
  this.game = game;
  this.difficulty = difficulty;

  this.container = new PIXI.DisplayObjectContainer();
  this.generator = new Generator(game);

  this.generateLevel();
}

Level.prototype.update = function(delta) {

}

Level.prototype.draw = function(renderer, delta) {
  this.frontBoard.draw(renderer, delta);
  this.backBoard.draw(renderer, delta);
}

Level.prototype.switchBoard = function() {
  if(this.frontBoard.active) {
    this.frontBoard.setActive(false);
    this.backBoard.setActive(true);
  }
  else {
    this.frontBoard.setActive(true);
    this.backBoard.setActive(false);
  }
}

Level.prototype.getOppositeNode = function(board, index) {
  if(board == this.frontBoard) {
    return this.backBoard.nodes[index];
  }
  else {
    return this.frontBoard.nodes[index];
  }
}

Level.prototype.getOppositeBoard = function(board) {
  if(board == this.frontBoard) {
    return this.backBoard;
  }
  else {
    return this.frontBoard;
  }
}

Level.prototype.generateLevel = function() {
  console.log(this.difficulty);
  var nodes = this.generator.generateLevel(this.difficulty);

  this._makeBoards(this.difficulty.width, this.difficulty.height);

  this.frontBoard.setNodes(nodes[0], this.difficulty.width, this.difficulty.height);
  this.backBoard.setNodes(nodes[1], this.difficulty.width, this.difficulty.height);
}

Level.prototype._makeBoards = function(width, height) {
  this.frontBoard = new Board(game, this, width, height);
  this.frontBoard.container.position.x = 50;
  this.frontBoard.container.position.y = 50;
  this.frontBoard.setActive(true);
  this.container.addChild(this.frontBoard.container);

  this.backBoard = new Board(game, this, width, height);
  this.backBoard.container.position.x = 450;
  this.backBoard.container.position.y = 50;
  this.container.addChild(this.backBoard.container);
}

module.exports = Level;