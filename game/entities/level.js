var Board = require('./board');

Level = function(game, difficulty) {
  this.game = game;

  this.container = new PIXI.DisplayObjectContainer();

  this.frontBoard = new Board(game, this, 3, 3);
  this.frontBoard.container.position.x = 50;
  this.frontBoard.container.position.y = 50;
  this.frontBoard.setActive(true);
  this.container.addChild(this.frontBoard.container);

  this.backBoard = new Board(game, this, 3, 3);
  this.backBoard.container.position.x = 450;
  this.backBoard.container.position.y = 50;
  this.container.addChild(this.backBoard.container);
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

module.exports = Level;