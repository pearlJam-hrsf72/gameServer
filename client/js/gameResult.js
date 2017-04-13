var gameResult = {
  preload: function() {
   game.stage.backgroundColor = 0xbada55; 
  },
  create: function() {

    var nameLabel = game.add.text(game.world.width/2, 40, 'Winner: Player 1',
      {font: '50px Arial', fill: '#000000'});
    nameLabel.anchor.set(0.5); 

  //  console.log('backgroundColor', game.stage.backgroundColor(0xbada55));
   console.log('game stage', game.stage);
 
    var startLabel = game.add.text(game.world.width/2, game.world.height - 40,
      'Press the "m" key to return to the main menu', 
      {font: '25px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5);
    

   






    //add main menu listen input
    var mkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    mkey.onDown.addOnce(this.toMainMenu, this);
  },

  toMainMenu: function() {
    game.state.start('Menu');
  },

};