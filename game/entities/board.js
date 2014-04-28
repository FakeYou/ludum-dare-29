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
  this.height = height;
  this.spacing = 100;

  this.nodes = [];
  this.lines = [];
  // this.setup();

  this.activeLine = new Line(game, 0, 0);
  this.activeLine.graphics.visible = false;
  this.container.addChild(this.activeLine.graphics);

  this.backgroundColor = 0xCCCCCC;
  this.activeNode = null;

  this.active = false;

  this.container.setInteractive(true);
  this.container.hitArea = new PIXI.Rectangle(0, 0, this.getWidth(), this.getHeight());
}

Board.prototype.setup = function() {
  for(var x = 0; x < this.width; x++) {
    for(var y = 0; y < this.height; y++) {
      var node = new Node(
        this.game,              // reference to parent game
        this,                   // reference to parent board
        x * this.spacing + 50,  // pixel x coord on the board
        y * this.spacing + 50,  // pixel y coord on the board
        x,                      // grid x coord on the board
        y                       // grid y coord on the board
      );

      this.container.addChild(node.graphics);
      this.nodes.push(node);
    }
  }
}

Board.prototype.update = function(delta) {

}

Board.prototype.draw = function(renderer, delta) {
  this.graphics.clear();
  this.graphics.beginFill(this.backgroundColor, 0.5);
  this.graphics.drawRect(0, 0, this.getWidth(), this.getHeight());
  this.graphics.endFill();

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

Board.prototype.setVisible = function(value) {
  this.container.visible = value;
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
  else if(this._isValidLine(this.activeNode, node)) {
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

Board.prototype.isFilled = function() {
  for(var i = 0; i < this.nodes.length; i++) {
    if(this.nodes[i].open && !this.nodes[i].selected) {
      return false;
    }
  }

  return true;
}

Board.prototype.getPossibleMoves = function(node) {
  var nodes = [];

  for(var i = 0; i < this.nodes.length; i++) {
    if(this._isValidLine(node, this.nodes[i])) {
      nodes.push(this.nodes[i]);
    }
  }

  return nodes;
}

Board.prototype._isValidLine = function(beginNode, endNode) {
  if(beginNode.color.name !== endNode.color.name) {
    return false;
  }

  if(!beginNode.open || !endNode.open) {
    return false;
  }

  if(beginNode.board !== endNode.board) {
    return false;
  }

  if(!this._isValidNodeConnection(beginNode, endNode)) {
    return false; 
  }

  if(this._isCrossingLines(beginNode, endNode)) {
    return false; 
  }


  return true;
}

Board.prototype._isValidNodeConnection = function(beginNode, endNode) {
  var x = endNode.gridX - beginNode.gridX;
  var y = endNode.gridY - beginNode.gridY;

  if(x == -1 || x == 1 || y == -1 || y == 1) {
    return true;
  }
  else {
    return false;
  }
}

Board.prototype._isCrossingLines = function(beginNode, endNode) {
  var line = new Line(this.game, 0, 0);
  line.setBegin(beginNode.x, beginNode.y);
  line.setEnd(endNode.x, endNode.y);

  for(var i = 0; i < this.lines.length; i++) {
    if(this._isCrossingLine(line, this.lines[i])) {
      return true;
    }
  }

  return false;
}

Board.prototype._isCrossingLine = function(line1, line2) {
  // http://gamedev.stackexchange.com/a/26022
  var a = line1.begin;
  var b = line1.end;
  var c = line2.begin;
  var d = line2.end;

  var denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
  var numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
  var numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

  if(denominator == 0) {
    return numerator1 == 0 && numerator2 == 0;
  }

  var r = numerator1 / denominator;
  var s = numerator2 / denominator;

  return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
}

Board.prototype.setNodes = function(nodes, width, height) {
  this.width = width;
  this.height = height;
  this.nodes = [];

  for(var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    nodes[i].setBoard(this);

    var x = node.gridX * this.spacing + 50;
    var y = node.gridY * this.spacing + 50;

    node.setPosition(x, y);

    this.container.addChild(node.graphics);
    this.nodes.push(node);
  }
}

module.exports = Board;