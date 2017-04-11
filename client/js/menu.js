var menuState = {
  create: function() {

    var nameLabel = game.add.text(80, 80, 'Pearl Jam',
      {font: '50px Arial', fill: '#000000'});


    var startLabel = game.add.text(80, game.world.height - 80,
      'press the "S" key to start', 
      {font: '25px Arial', fill: '#000000' });
    var skey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    skey.onDown.addOnce(this.start, this);
  },

  start: function() {
    game.state.start('Lobby');
  }

}