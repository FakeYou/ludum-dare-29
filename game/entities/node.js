Node = function(game, board, x, y) {
  var _this = this;
  this.game = game;
  this.board = board;

  this.x = x;
  this.y = y;

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

  this.color = 0xff0000;

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
  var color = this.color;

  if(this.open) {
    if(this.state == this.states.NORMAL) {
      this.color = 0xff0000;
    }
    else if(this.state == this.states.HOVER) {
      this.color = 0x00ff00;
    }
    else if(this.state == this.states.PRESSED) {
      this.color = 0x0000ff;
    }
    else if(this.state == this.states.ACTIVE) {
      this.color = 0x0000ff;
    }

    this.graphics.lineStyle(2, this.color, 1);
    this.graphics.drawCircle(0, 0, this.radius);

    if(this.selected) {
      this.graphics.beginFill(this.color);
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

module.exports = Node;