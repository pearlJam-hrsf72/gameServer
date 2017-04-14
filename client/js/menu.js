var menuState = {
  create: function() {

    var nameLabel = game.add.text(80, 80, 'Pearl Jam',
      {font: '50px Arial', fill: '#000000'});


    var startLabel = game.add.text(80, game.world.height - 80,
      'press the "S" key to start', 
      {font: '25px Arial', fill: '#000000' });
    // var skey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    var button = game.add.button(0, 200, 'joinAsPlayerButton', this.joinAsPlayer, this, 2, 1, 0);
    var button = game.add.button(200, 150, 'joinAsSpectatorButton', this.joinAsSpectator, this, 2, 1, 0);

    // skey.onDown.addOnce(this.start, this);
    console.log('wilit repeat??');
  },

  joinAsPlayer: function() {
    game.state.start('Lobby');
  },

  joinAsSpectator: function() {
    game.state.start('Spectate');
  },

  start: function() {
    game.state.start('Lobby');
  }
}