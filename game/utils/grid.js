Grid = function(game) {
  this.game = game;
  
  this.graphics = new PIXI.Graphics();
}

Grid.prototype.update = function(delta) {

}

Grid.prototype.draw = function(renderer, delta) {
  this.graphics.clear();
  this.graphics.lineStyle(1, 0xDDDDDD, 0.8);

  for(var i = 0; i < 1000; i += 100) {
    this.graphics.moveTo(i, 0);
    this.graphics.lineTo(i, 1000);

    this.graphics.moveTo(0, i);
    this.graphics.lineTo(1000, i);
  }
}

module.exports = Grid;