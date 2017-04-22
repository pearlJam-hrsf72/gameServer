var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...',
      {font: '40px Courier', fill: '#ffffff'});

    game.physics.startSystem(Phaser.Physics.Arcade);

    game.load.image('background', 'https://pearl-jam-game-server.herokuapp.com/assets/board.png');
    game.load.image('character', 'https://pearl-jam-game-server.herokuapp.com/assets/ball.png');
    game.load.image('vertical', 'https://pearl-jam-game-server.herokuapp.com/assets/rectanglevertical.png');
    game.load.image('horiontal', 'https://pearl-jam-game-server.herokuapp.com/assets/rectangle.png');
    game.load.image('joinAsPlayerButton', 'https://pearl-jam-game-server.herokuapp.com/assets/playButton.jpg');
    game.load.image('joinAsSpectatorButton', 'https://pearl-jam-game-server.herokuapp.com/assets/spectateButton.png');
    game.load.spritesheet('hole', 'https://pearl-jam-game-server.herokuapp.com/assets/spritmap.png', 256, 256, 38);
    game.load.spritesheet('playerNotReady','https://pearl-jam-game-server.herokuapp.com/assets/playerNotReady.png', 138, 138, 4);
    game.load.image('playerReady', 'https://pearl-jam-game-server.herokuapp.com/assets/playerReady.png');
  },

  create: function() {
    if (window.spectate) {
      game.state.start('Spectate');
    };
  },

  update: function() {
    if (window.username) {
      console.log('your username is ' + window.username);
      game.state.start('Lobby');
    }
  }

}