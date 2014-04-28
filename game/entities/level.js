var Board = require('./board');
var Generator = require('../utils/generator');

Level = function(game, difficulty) {
  this.game = game;
  this.difficulty = difficulty;

  this.container = new PIXI.DisplayObjectContainer();
  this.generator = new Generator(game);

  this.generateLevel();

  this.tween = 0.2;
}

Level.prototype.update = function(delta) {
}

Level.prototype.draw = function(renderer, delta) {
  this.frontBoard.draw(renderer, delta);
  this.backBoard.draw(renderer, delta);
}

Level.prototype.switchBoard = function() {
  var _this = this;

  if(this.frontBoard.active) {
    this.frontBoard.setActive(false);
    this.backBoard.setActive(false);

    TweenLite.to(this.frontBoard.container.scale, this.tween, { 
      x: 0, 
      ease: Power2.easeIn,
      onComplete: function() {
        _this.frontBoard.setVisible(false);
        _this.backBoard.setVisible(true);
      }
    });

    TweenLite.to(this.backBoard.container.scale, this.tween, { 
      x: -1, 
      delay: this.tween,
      ease: Power2.easeOut,
      onComplete: function() {
        _this.backBoard.setActive(true);
      }
    });
  }
  else {
    this.frontBoard.setActive(false);
    this.backBoard.setActive(false);

    TweenLite.to(this.backBoard.container.scale, this.tween, { 
      x: 0, 
      ease: Power2.easeIn,
      onComplete: function() {
        _this.frontBoard.setVisible(true);
        _this.backBoard.setVisible(false);
      }
    });

    TweenLite.to(this.frontBoard.container.scale, this.tween, { 
      x: 1, 
      delay: this.tween,
      ease: Power2.easeOut,
      onComplete: function() {
        _this.frontBoard.setActive(true);
      }
    });
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
  var nodes = this.generator.generateLevel(this.difficulty);

  this._makeBoards(this.difficulty.width, this.difficulty.height);

  this.frontBoard.setNodes(nodes[0], this.difficulty.width, this.difficulty.height);
  this.backBoard.setNodes(nodes[1], this.difficulty.width, this.difficulty.height);
}

Level.prototype._makeBoards = function(width, height) {
  this.frontBoard = new Board(game, this, width, height);
  this.frontBoard.container.position.x = 50 + this.frontBoard.getWidth() / 2;
  this.frontBoard.container.position.y = 50;
  this.frontBoard.container.pivot.x = this.frontBoard.getWidth() / 2;
  this.frontBoard.setActive(true);
  this.frontBoard.setVisible(true);
  this.container.addChild(this.frontBoard.container);

  this.backBoard = new Board(game, this, width, height);
  this.backBoard.container.position.x = 50 + this.backBoard.getWidth() / 2;
  this.backBoard.container.position.y = 50;
  this.backBoard.container.pivot.x = this.backBoard.getWidth() / 2;
  this.backBoard.setActive(false);
  this.backBoard.setVisible(true);
  this.backBoard.container.scale.x = 0;
  this.container.addChild(this.backBoard.container);
}

module.exports = Level;