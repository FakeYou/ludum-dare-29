Menu = function(game, width, height) {
  this.game = game;

  this.width = width;
  this.height = height;

  this.textSettings = {
    font: '24px Roboto', 
    fill: 'white', 
    align: 'center'
  }

  this.container = new PIXI.DisplayObjectContainer();

  this.startText = new PIXI.Text('click to start game', this.textSettings);
  this.startText.position.x = width / 2;
  this.startText.position.y = height / 2;
  this.startText.anchor.x = 0.5;
  this.startText.anchor.y = 0.5;
  this.container.addChild(this.startText);

  this.retryText = new PIXI.Text('No more moves possible\nclick to start a new game', this.textSettings);
  this.retryText.position.x = width / 2;
  this.retryText.position.y = height / 2;
  this.retryText.anchor.x = 0.5;
  this.retryText.anchor.y = 0.5;
  this.retryText.visible = false;
  this.container.addChild(this.retryText);

  this.winnerText = new PIXI.Text('congratulations, you won!\nclick to start a new game', this.textSettings);
  this.winnerText.position.x = width / 2;
  this.winnerText.position.y = height / 2;
  this.winnerText.anchor.x = 0.5;
  this.winnerText.anchor.y = 0.5;
  this.winnerText.visible = false;
  this.container.addChild(this.winnerText);

  this.container.setInteractive(true);
  this.container.hitArea = new PIXI.Rectangle(0, 0, width, height);

  this.registerEvents()

  this.setState(0);
}

Menu.states = {
  START: 0,
  RETRY: 1,
  WON: 2
}

Menu.prototype.setState = function(state) {
  this.state = state;
  this.container.visible = true;

  if(state == Menu.states.START) {
    this.startText.visible = true;
    this.retryText.visible = false;
    this.winnerText.visible = false;
  }
  else if(state == Menu.states.RETRY) {
    this.startText.visible = false;
    this.retryText.visible = true;
    this.winnerText.visible = false;
  }
  else if(state == Menu.states.WON) {
    this.startText.visible = false;
    this.retryText.visible = false;
    this.winnerText.visible = true;
  }
}

Menu.prototype.registerEvents = function() {
  var _this = this;

  var clickEvent = function() {
    if(_this.state == Menu.states.START) {
      _this.container.visible = false;
      _this.game.level.frontBoard.setActive(true);
    }
    else if(_this.state == Menu.states.RETRY) {
      _this.container.visible = false;
      _this.game.level.generateLevel(Generator.difficulties.MEDIUM);
      _this.game.level.frontBoard.setActive(true);
    }
    else if(_this.state == Menu.states.WON) {
      _this.container.visible = false;
      _this.game.level.generateLevel(Generator.difficulties.MEDIUM);
      _this.game.level.frontBoard.setActive(true);
    }
  }

  this.container.click = clickEvent;
  this.container.tap = clickEvent;
}

module.exports = Menu;