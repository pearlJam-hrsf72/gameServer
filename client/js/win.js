var winState = {

  create: function() {

    var nameLabel = game.add.text(80, 80, 'You Win! :)',
      {font: '50px Arial', fill: '#000000'});


    var startLabel = game.add.text(80, 200,
      'Press the "m" key to return to the main menu', 
      {font: '25px Arial', fill: '#000000' });
    var mkey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    mkey.onDown.addOnce(this.toMainMenu, this);
  },

  toMainMenu: function() {
    game.state.start('Menu');
  }
};