var gameResult = {
  init: function(params) {
    lobbyState.isReady = false
    console.log('params', params);

    game.world.setBounds(0, 0, winW - 50, winH - 50)
    // game.stage.backgroundColor = '#333'; 

    var winners = _.filter(params, function(player) {
      return player.lives > 0
    })    

    var losers = _.filter(params, function(player) {
      return player.lives === 0;
    })

    var winner = winners[0]
    console.log('winners', winners[0])
    console.log('losers', losers)
     

    //Display the winner
    var nameLabel = game.add.text(game.world.width / 2, 40, `Winner: Player ${winner.id} `,
      {font: '50px Arial', fill: '#ffbfda'});
    nameLabel.anchor.set(0.5); 
  //  console.log('backgroundColor', game.stage.backgroundColor(0xbada55));

   //Dispaly the losers
   this.drawLosers(losers);

    var startLabel = game.add.text(game.world.width/2, game.world.height - 40,
      'click to return to the lobby', 
      {font: '25px Arial', fill: '#f001f2' });
    startLabel.anchor.set(0.5);
  },
  
  update: function() {
    if(game.input.activePointer.isDown) {
      game.state.start('Load')
    }
  },

  drawLosers: function(losers) {
    var playerNameHeight =  80;
    _.forEach(losers, (player) => {
        var textStyle = {
          font: 'bold 30pt italic',
          fill: '#ffbfda'
        }
        var loserText = game.add.text(80, playerNameHeight, 'Loser', textStyle);
        var playerName = game.add.text(loserText.x + loserText.width + 30, playerNameHeight, player.id, textStyle);
        playerNameHeight += 150;
    })

  },
  toLobby: function() {
    game.state.start('Lobby');
  }
  

};