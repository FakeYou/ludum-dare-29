Node = function(game, x, y) {
  var _this = this;
  this.game = game;

  this.graphics = new PIXI.Graphics();

  this.graphics.position.x = x;
  this.graphics.position.y = y;

  this.radius = 25;

  this.graphics.hitArea = new PIXI.Rectangle(
    this.radius - 5, 
    this.radius - 5, 
    this.radius * 2 + 10, 
    this.radius * 2 + 10
    );

  this.color = 0xff0000;

  this.states = {
    NORMAL: 0,
    HOVER: 1,
    PRESSED: 2
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

  if(this.state == this.states.NORMAL) {
    this.color = 0xff0000;
  }
  else if(this.state == this.states.HOVER) {
    this.color = 0x00ff00;
  }
  else if(this.state == this.states.PRESSED) {
    this.color = 0x0000ff;
  }

  this.graphics.lineStyle(2, this.color, 1);
  this.graphics.drawCircle(this.radius * 2, this.radius * 2, this.radius);
}

Node.prototype.registerEvents = function() {
  var _this = this;

  var setStateNormal = function() {
    _this.state = _this.states.NORMAL;
  }

  var setStatePressed = function() {
    _this.state = _this.states.PRESSED;
  }

  var setStateHover = function() {
    _this.state = _this.states.HOVER;
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