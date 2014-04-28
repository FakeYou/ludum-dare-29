var Board = require('./board');

Level = function(game, difficulty) {
  this.game = game;
  this.difficulty = difficulty;

  this.container = new PIXI.DisplayObjectContainer();

  this.generateLevel();
}

Level.difficulties = {
  EASY: 0,
  NORMAL: 1,
  HARD: 2
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
  var colors = [];
  var width = 0;
  var height = 0;

  if(this.difficulty == Level.difficulties.EASY) {
    var colors = ['red', 'blue'];
    var width = 2;
    var height = 3;
  }

  this._makeBoards(width, height);
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

Level.prototype.checkStatus = function() {
  for(var i = 0; i < this.frontBoard.nodes.length; i++) {

  }
}

module.exports = Level;