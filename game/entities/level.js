var Board = require('./board');
var Generator = require('../utils/generator');

Level = function(game, difficulty) {
  this.game = game;
  this.difficulty = difficulty;

  this.container = new PIXI.DisplayObjectContainer();
  this.generator = new Generator(game);

  this.generateLevel();

  this.tween = 0.3;
}

Level.prototype.update = function(delta) {
}

Level.prototype.draw = function(renderer, delta) {
  this.frontBoard.draw(renderer, delta);
  this.backBoard.draw(renderer, delta);
}

Level.prototype.switchBoard = function() {
  var _this = this;

  var currentBoard;
  var newBoard;

  if(this.frontBoard.active) {
    currentBoard = this.frontBoard;
    newBoard = this.backBoard;
  }
  else {
    currentBoard = this.backBoard;
    newBoard = this.frontBoard;
  }

  currentBoard.setActive(false);
  newBoard.setActive(false);

  TweenLite.to(currentBoard.container.scale, this.tween / 2, { y: 0.9, ease: Power2.easeIn });
  TweenLite.to(currentBoard.container.scale, this.tween, { 
    x: 0, 
    ease: Power2.easeIn,
    onComplete: function() {
      currentBoard.container.scale.y = 1;
      currentBoard.setVisible(false);
      newBoard.container.scale.y = 0.9;
      newBoard.setVisible(true);
    }
  });

  TweenLite.to(newBoard.container.scale, this.tween / 2, { y: 1, ease: Power2.easeOut, delay: this.tween + this.tween / 2 });
  TweenLite.to(newBoard.container.scale, this.tween, { 
    x: 1, 
    delay: this.tween,
    ease: Power2.easeOut,
    onComplete: function() {
      newBoard.setActive(true);
      
      var possibleMoves = newBoard.getPossibleMoves(newBoard.activeNode);

      if(possibleMoves.length == 0) {
        if(!newBoard.isFilled() || !currentBoard.isFilled()) {
          _this.game.menu.setState(Menu.states.RETRY);
        }
        else {
          _this.game.menu.setState(Menu.states.WON);
        }
      }
    }
  });
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
  if(this.frontBoard != null) {
    this.container.removeChild(this.frontBoard.container);
    this.container.removeChild(this.backBoard.container);
  }

  var nodes = this.generator.generateLevel(this.difficulty);

  this._makeBoards(this.difficulty.width, this.difficulty.height);

  this.frontBoard.setNodes(nodes[0], this.difficulty.width, this.difficulty.height);
  this.backBoard.setNodes(nodes[1], this.difficulty.width, this.difficulty.height);
}

Level.prototype._makeBoards = function(width, height) {
  this.frontBoard = new Board(game, this, width, height);
  this.frontBoard.container.position.x = this.frontBoard.getWidth() / 2;
  this.frontBoard.container.position.y = this.frontBoard.getHeight() / 2;
  this.frontBoard.container.pivot.x = this.frontBoard.getWidth() / 2;
  this.frontBoard.container.pivot.y = this.frontBoard.getHeight() / 2;
  this.frontBoard.setActive(false);
  this.frontBoard.setVisible(true);
  this.container.addChild(this.frontBoard.container);

  this.backBoard = new Board(game, this, width, height);
  this.backBoard.container.position.x = this.backBoard.getWidth() / 2;
  this.backBoard.container.position.y = this.frontBoard.getHeight() / 2;
  this.backBoard.container.pivot.x = this.backBoard.getWidth() / 2;
  this.backBoard.container.pivot.y = this.frontBoard.getHeight() / 2;
  this.backBoard.backgroundColor = 0xBBBBBB;
  this.backBoard.setActive(false);
  this.backBoard.setVisible(true);
  this.backBoard.container.scale.x = 0;
  this.container.addChild(this.backBoard.container);
}

module.exports = Level;