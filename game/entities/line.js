Line = function(game, x, y) {
  this.game = game;

  this.graphics = new PIXI.Graphics();
  this.active = false;

  this.begin = new PIXI.Point(x, y);
  this.end = new PIXI.Point(x, y);
}

Line.prototype.update = function(delta) {

}

Line.prototype.draw = function(renderer, delta) {
  this.graphics.clear();

  if(this.active) {
    this.graphics.lineStyle(4, 0x000000, 1);
  }
  else {
    this.graphics.lineStyle(4, 0x888888, 1);
  }

  this.graphics.moveTo(this.begin.x, this.begin.y);
  this.graphics.lineTo(this.end.x, this.end.y);
}

Line.prototype.setBegin = function(x, y) {
  this.begin.x = x;
  this.begin.y = y;
}

Line.prototype.setEnd = function(x, y) {
  this.end.x = x;
  this.end.y = y;
}

Line.prototype.setActive = function(value) {
  this.active = value;
}

Line.prototype.clone = function() {
  var line = new Line(this.game, this.x, this.y);
  line.setBegin(this.begin.x, this.begin.y);
  line.setEnd(this.end.x, this.end.y);

  return line;
}

module.exports = Line;