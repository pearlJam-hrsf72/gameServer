var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'});

    game.physics.startSystem(Phaser.Physics.Arcade);

    game.load.image('background', 'https://ddu0j6ouvozck.cloudfront.net/board.png');
    game.load.image('character', 'https://ddu0j6ouvozck.cloudfront.net/ball.png');
    game.load.image('vertical', 'https://ddu0j6ouvozck.cloudfront.net/rectanglevertical.png');
    game.load.image('horiontal', 'https://ddu0j6ouvozck.cloudfront.net/rectangle.png');
    game.load.image('joinAsPlayerButton', 'https://ddu0j6ouvozck.cloudfront.net/playButton.jpg');
    game.load.image('joinAsSpectatorButton', 'https://ddu0j6ouvozck.cloudfront.net/spectateButton.png');
    game.load.spritesheet('hole', 'https://ddu0j6ouvozck.cloudfront.net/spritmap.png', 256, 256, 38);
    game.load.spritesheet('playerNotReady','https://ddu0j6ouvozck.cloudfront.net/playerNotReady.png', 138, 138, 4);
    game.load.image('playerReady', 'https://ddu0j6ouvozck.cloudfront.net/playerReady.png');
  },

  create: function() {
    if (window.spectate) {
      game.state.start('Spectate');
    };
  },

  update: function() {
    loadState.username = JSON.parse(localStorage["reduxPersist:user"]).displayName;
    if (loadState.username) {
      game.state.start('Lobby');
    }
  }

}