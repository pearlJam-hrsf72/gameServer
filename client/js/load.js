var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'});

    game.load.image('background', 'assets/board.png');
    game.load.image('character', 'assets/ball.png');
    game.load.image('vertical', 'assets/rectanglevertical.png');
    game.load.image('horiontal', 'assets/rectangle.png');
    game.load.image('theHOLE', 'assets/hole.png');
    game.load.image('joinAsPlayerButton', 'assets/playButton.jpg');
    game.load.image('joinAsSpectatorButton', 'assets/spectateButton.png');
    game.load.spritesheet('hole', 'assets/spritmap.png', 128, 128, 38);
    game.load.spritesheet('playerNotReady','assets/playerNotReady.png', 138, 138, 4);

  },
  create: function() {
    game.state.start('Game');
  }

}