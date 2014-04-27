var Node = require('./node');
var Line = require('./line');

Board = function(game, width, height) {
  var _this = this;

  this.game = game;

  this.container = new PIXI.DisplayObjectContainer();

  this.graphics = new PIXI.Graphics();
  this.container.addChild(this.graphics);

  this.width = width;
  this.height = height
  this.spacing = 100;

  this.nodes = [];
  this.setup();

  this.line = new Line(game, 0, 0);
  this.container.addChild(this.line.graphics);

  this.container.setInteractive(true);
  this.container.hitArea = new PIXI.Rectangle(0, 0, this.getWidth(), this.getHeight());
  this.container.click = function(event) {
    var point = event.getLocalPosition(_this.container);

    _this.line.setEnd(point.x, point.y);
  }
}

Board.prototype.setup = function() {
  for(var x = 0; x < this.width; x++) {
    for(var y = 0; y < this.height; y++) {
      var node = new Node(this, x * this.spacing, y * this.spacing);
      this.container.addChild(node.graphics);
      this.nodes.push(node);
    }
  }
}

Board.prototype.update = function(delta) {

}

Board.prototype.draw = function(renderer, delta) {
  this.graphics.clear();
  this.graphics.beginFill(0xCCCCCC, 0.5);
  this.graphics.drawRect(0, 0, this.getWidth(), this.getHeight());
  this.graphics.endFill();

  this.line.draw(renderer, delta);

  for(var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];

    node.draw(renderer, delta);
  }
}

Board.prototype.getWidth = function() {
  return this.width * this.spacing;
}

Board.prototype.getHeight = function() {
  return this.height * this.spacing;
}

module.exports = Board;