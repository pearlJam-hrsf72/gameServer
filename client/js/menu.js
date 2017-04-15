var menuState = {
  create: function() {
    Client.socketConnect();

    var nameLabel = game.add.text(80, 80, 'Pearl Jam',
      {font: '50px Arial', fill: '#000000'});

    var button = game.add.button(0, 200, 'joinAsPlayerButton', menuState.joinAsPlayer, this, 2, 1, 0);
    var button = game.add.button(200, 150, 'joinAsSpectatorButton', menuState.joinAsSpectator, this, 2, 1, 0);
  },

  joinAsPlayer: function() {
    game.state.start('Lobby');
  },

  joinAsSpectator: function() {
    game.state.start('Spectate');
  }
}