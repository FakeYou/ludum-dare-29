var Solver = require('./solver');
var Board = require('../entities/board');

Generator = function(game) {
  this.game = game;
  this.solver = new Solver(game);
}

Generator.difficulties = {
  EASY: { width: 2, height: 3, colors: 2 },
  MEDIUM: { width: 3, height: 4, colors: 3 },
  HARD: { width: 4, height: 5, colors: 4 }
}

Generator.prototype.generateLevel = function(difficulty) {
  var colors = ['red', 'blue', 'green', 'yellow'];

  var width = difficulty.width;
  var height = difficulty.height;
  var colors = colors.slice(0, difficulty.colors);

  var connections = false;
  while(!connections) {
    connections = this._makeConnections(width, height);
  }

  var nodes = this._makeBoards(colors, width, height, connections[0], connections[1]);

  return nodes;
}

Generator.prototype._makeConnections = function(width, height) {
  this.usedColors = [];

  var frontNodes = [];
  var backNodes = [];

  var frontLines = [];
  var backLines = [];

  var activeNodes = frontNodes;
  var activeLines = frontLines;

  var success = true;

  var connections = width * height / 2;

  for(var i = 0; i < width; i++) {
    for(var j = 0; j < height; j++) {
      frontNodes.push({ x: i, y: j, open: true });
      backNodes.push({ x: i, y: j, open: true });
    }
  }

  var start = this._randomFromArray(frontNodes);
  var end;

  var panic = 0;

  while(frontLines.length < connections && backLines.length < connections) {
    panic += 1;

    // randomly search for any node to make a valid connection with
    do {
      end = this._randomFromArray(activeNodes);
      panic += 1;

      if(panic > 500) {
        success = false;
        break;
      }
    } 
    while(!this._isValidLine(activeLines, start, end));

    if(panic > 500) {
      success = false;
      break;
    }

    // close the nodes
    start.open = false;
    end.open = false;

    activeLines.push({ begin: start, end: end });

    // switch active side
    if(activeLines == frontLines) {
      var index = activeNodes.indexOf(end);
      var start = backNodes[index];
      var end = null;

      activeLines = backLines;
      activeNodes = backNodes;
    }
    else {
      var index = activeNodes.indexOf(end);
      var start = frontNodes[index];
      var end = null;

      activeLines = frontLines;
      activeNodes = frontNodes;
    }
  }

  if(success) {
    return [frontLines, backLines];
  }
  else {
    return false;
  }
}

Generator.prototype._makeBoards = function(colors, width, height, frontLines, backLines) {
  var frontNodes = [];
  var backNodes = [];

  for(var j = 0; j < height; j++) {
    for(var i = 0; i < width; i++) {
      var frontNode = new Node(this.game, null, i, j);
      frontNode.setColor(this._randomFromArray(colors));

      var backNode = new Node(this.game, null, i, j);
      backNode.setColor(this._randomFromArray(colors));

      frontNodes.push(frontNode);
      backNodes.push(backNode);
    }
  }

  for(var i = 0; i < frontLines.length; i++) {
    var begin = frontLines[i].begin;
    var end = frontLines[i].end;

    var color = this._randomFromArray(colors);

    frontNodes[(begin.y * width + begin.x)].setColor(color);
    frontNodes[(end.y * width + end.x)].setColor(color);
  }

  for(var i = 0; i < backLines.length; i++) {
    var begin = backLines[i].begin;
    var end = backLines[i].end;

    var color = this._getRandomColor(colors);

    backNodes[(begin.y * width + begin.x)].setColor(color);
    backNodes[(end.y * width + end.x)].setColor(color);
  }

  return [frontNodes, backNodes];
}

Generator.prototype._randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

Generator.prototype._randomFromArray = function(items) {
  return items[Math.floor(Math.random() * items.length)];
}

Generator.prototype._shuffleArray = function(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

Generator.prototype._getRandomColor = function(colors) {
  var colors = this._shuffleArray(colors.slice(0)); // clone and shuffle

  if(this.usedColors.length != colors.length) {
    for(var i = 0; i < colors.length; i++) {
      if(this.usedColors.indexOf(colors[i]) == -1) {
        this.usedColors.push(colors[i]);
        return colors[i];
      }
    }
  }

  return colors[0];
}

Generator.prototype._isValidLine = function(lines, beginNode, endNode) {
  if(beginNode == null || endNode == null) {
    return false;
  }

  if(!beginNode.open || !endNode.open) {
    return false;
  }

  if(!this._isValidNodeConnection(beginNode, endNode)) {
    return false; 
  }

  if(this._isCrossingLines(lines, beginNode, endNode)) {
    return false; 
  }


  return true;
}

Generator.prototype._isValidNodeConnection = function(beginNode, endNode) {
  var x = endNode.x - beginNode.x;
  var y = endNode.y - beginNode.y;

  if(x == -1 || x == 1 || y == -1 || y == 1) {
    return true;
  }
  else {
    return false;
  }
}

Generator.prototype._isCrossingLines = function(lines, beginNode, endNode) {
  var line = new Line(this.game, 0, 0);
  line.setBegin(beginNode.x, beginNode.y);
  line.setEnd(endNode.x, endNode.y);

  for(var i = 0; i < lines.length; i++) {
    if(this._isCrossingLine(line, lines[i])) {
      return true;
    }
  }

  return false;
}

Generator.prototype._isCrossingLine = function(line1, line2) {
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

module.exports = Generator;