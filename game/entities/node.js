var _ = require('underscore');

Node = function(game, board, gridX, gridY, x, y) {
  var _this = this;
  this.game = game;
  this.board = board;

  this.x = x;
  this.y = y;

  this.gridX = gridX;
  this.gridY = gridY;

  this.graphics = new PIXI.Graphics();

  this.graphics.position.x = x;
  this.graphics.position.y = y;

  this.radius = 25;
  this.selected = false;
  this.open = true;

  this.graphics.hitArea = new PIXI.Rectangle(
    -5 - this.radius, 
    -5 - this.radius, 
    this.radius * 2 + 10, 
    this.radius * 2 + 10
    );

  this.colors = {
    red: { name: 'red', normal: 0xEE0000, hover: 0xFF0000 },
    green: { name: 'green', normal: 0x00EE00, hover: 0x00FF00 },
    blue: { name: 'blue', normal: 0x0000EE, hover: 0x0000FF}
  };

  this.states = {
    NORMAL: 0,
    HOVER: 1,
    PRESSED: 2,
    ACTIVE: 3
  };
  this.state = this.states.NORMAL;

  this.graphics.setInteractive(true);
  this.registerEvents();
}

Node.prototype.update = function(delta) {

}

Node.prototype.draw = function(renderer, delta) {
  this.graphics.clear();
  var color = 0xFF00FF;

  if(this.open) {
    if(this.state == this.states.NORMAL) {
      var color = this.color.normal;
    }
    else if(this.state == this.states.HOVER) {
      var color = this.color.hover;
    }
    else if(this.state == this.states.PRESSED) {
      // this.color = 0x0000ff;
    }
    else if(this.state == this.states.ACTIVE) {
      // this.color = 0x0000ff;
    }

    this.graphics.lineStyle(2, color, 1);
    this.graphics.drawCircle(0, 0, this.radius);

    if(this.selected) {
      this.graphics.beginFill(color);
      this.graphics.drawCircle(0, 0, this.radius / 4);
      this.graphics.endFill();
    }
  }
  else {
    this.graphics.beginFill(0xCCCCCC);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
  }
}

Node.prototype.registerEvents = function() {
  var _this = this;

  var setStateNormal = function() {
    if(_this.board.active) {
      _this.state = _this.states.NORMAL;
    }
  }

  var setStatePressed = function() {
    if(_this.board.active) {
      _this.state = _this.states.ACTIVE;
      _this.board.onNodePress(_this);
    }
  }

  var setStateHover = function() {
    if(_this.board.active) {
      _this.state = _this.states.HOVER;
    }
  }

  this.graphics.mouseover = setStateHover;
  
  this.graphics.mouseout = setStateNormal;
  this.graphics.mouseupoutside = setStateNormal;

  this.graphics.click = setStatePressed;
  this.graphics.tap = setStatePressed;
}

Node.prototype.getWidth = function() {
  return this.radius * 2;
}

Node.prototype.getHeight = function() {
  return this.radius * 2;
}

Node.prototype.setColor = function(color) {
  this.color = this.colors[color];
}

Node.prototype.setBoard = function(board) {
  this.board = board;
}

Node.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;

  this.graphics.position.x = x;
  this.graphics.position.y = y;
}

module.exports = Node;