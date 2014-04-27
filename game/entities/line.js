Line = function(game, x, y) {
  this.game = game;

  this.graphics = new PIXI.Graphics();

  this.begin = new PIXI.Point(x, y);
  this.end = new PIXI.Point(x, y);
}

Line.prototype.update = function(delta) {

}

Line.prototype.draw = function(renderer, delta) {
  this.graphics.clear();

  this.graphics.lineStyle(1, 0x000000, 1);
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

module.exports = Line;