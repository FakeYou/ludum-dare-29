$(document).ready(function() {

  var preload = new createjs.LoadQueue();

  NProgress.configure({
    showSpinner: false,
    trickle: true
  });

  NProgress.start();

  preload.on('complete', function() {
    NProgress.done(true);

    window.game = new Game();
    window.game.start();
  });

  preload.on('progress', function(event) {
    if(NProgress.status < event.progress) {
      NProgress.set(event.progress);
    }
  });

  preload.loadFile('lib/pixi.min.js');
  preload.loadFile('lib/tweenLite.min.js');
  preload.loadFile('lib/tweenLiteEasing.min.js');
  preload.loadFile('game/game.js');

});