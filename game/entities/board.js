var Node = require('./node');
var Line = require('./line');

Board = function(game, level, width, height) {
  var _this = this;

  this.game = game;
  this.level = level;

  this.container = new PIXI.DisplayObjectContainer();

  this.graphics = new PIXI.Graphics();
  this.container.addChild(this.graphics);

  this.width = width;
  this.height = height
  this.spacing = 100;

  this.nodes = [];
  this.lines = [];
  this.setup();

  this.activeLine = new Line(game, 0, 0);
  this.activeLine.graphics.visible = false;
  this.container.addChild(this.activeLine.graphics);

  this.activeNode = null;

  this.active = false;

  this.container.setInteractive(true);
  this.container.hitArea = new PIXI.Rectangle(0, 0, this.getWidth(), this.getHeight());
}

Board.prototype.setup = function() {
  for(var x = 0; x < this.width; x++) {
    for(var y = 0; y < this.height; y++) {
      var node = new Node(this.game, this, x * this.spacing + 50, y * this.spacing + 50);
      this.container.addChild(node.graphics);
      this.nodes.push(node);
    }
  }
}

Board.prototype.update = function(delta) {

}

Board.prototype.draw = function(renderer, delta) {
  if(this.active) {
    this.graphics.clear();
    this.graphics.beginFill(0xCCCCCC, 0.5);
    this.graphics.drawRect(0, 0, this.getWidth(), this.getHeight());
    this.graphics.endFill();
  }
  else {
    this.graphics.clear();
  }

  this.activeLine.draw(renderer, delta);

  for(var i = 0; i < this.nodes.length; i++) {
    this.nodes[i].draw(renderer, delta);
  }

  for(var i = 0; i < this.lines.length; i++) {
    this.lines[i].draw(renderer, delta);
  }
}

Board.prototype.getWidth = function() {
  return this.width * this.spacing;
}

Board.prototype.getHeight = function() {
  return this.height * this.spacing;
}

Board.prototype.setActive = function(value) {
  this.active = value;
}

Board.prototype.saveLine = function(line) {
  this.lines.push(line);
  this.container.addChild(line.graphics)
}

Board.prototype.onNodePress = function(node) {
  var index = this.nodes.indexOf(node);
  var oppositeNode = this.level.getOppositeNode(this, index);
  var oppositeBoard = this.level.getOppositeBoard(this);
    
  if(this.activeLine.graphics.visible == false) {
    node.selected = true;
    this.activeNode = node;
    oppositeNode.open = false;

    this.activeLine.setBegin(node.x, node.y);
    this.activeLine.setEnd(node.x, node.y);
    this.activeLine.graphics.visible = true;
  }
  else {
    this.activeNode.selected = false;
    this.activeNode.open = false;
    this.activeNode = null;

    this.activeLine.setEnd(node.x, node.y);
    this.saveLine(this.activeLine.clone());
    this.activeLine.graphics.visible = false;
    this.level.switchBoard();

    oppositeBoard.onNodePress(oppositeNode);
  }
}

module.exports = Board;