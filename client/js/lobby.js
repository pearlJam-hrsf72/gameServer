var lobbyState = {
  playerNameHeight: 30,

  preload: function() {
  },

  create: function() {
    setLobbyEventHandlers();
    // lobbyState.players = {};


    //Maybe you have to add a username like
    //Client.joinLobby(client.username);
    Client.joinLobby();


  
    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    rkey.onDown.addOnce(this.ready, this);
     game.stage.backgroundColor = "#4488AA";

  },

  ready: function() {
    Client.ready();
  },

  addStartLabels: function() {
    var welcomeLabel = game.add.text(game.world.width /2, 30, 
    "Welcome to Game Server 1", 
      {font: '35px Arial', fill: '#000000' });
    welcomeLabel.anchor.set(0.5);

    var startLabel = game.add.text(game.world.width/2, game.world.height - 20,
      "press the 'R' key when you're ready", 
      {font: '35px Arial', fill: '#000000' });
    startLabel.anchor.set(0.5)
  },

  renderServerInfo: function(players) {

    console.log('all players ready?', this.allReady(players))
    if (this.allReady(players)) {
      removeAllSocketListeners();
      game.state.start('Game');
    }

    //remove all the elements
    console.log('removing elements', game.world.children = []);

    //Add the starting labels
    this.addStartLabels();

    //Draw the players
    playerNameHeight = 30;
    _.forEach(players, (player) => {
        console.log('player', player);
        var textStyle = {
          font: 'bold 30pt italic'
        }
        var playerName = game.add.text(80, playerNameHeight, player.id, textStyle);
        if (player.ready) { //add the ready symbol
          var playerReady = game.add.button(120, playerNameHeight, 'playerReady');
        } else { //add the not ready symbol
          var playerNotReady = game.add.sprite(120, playerNameHeight, 'playerNotReady');

          playerNotReady.scale.set(0.5);
          playerNotReady.animations.add('toggle', [0, 1, 2, 3], 12, true);
          playerNotReady.play('toggle');

        }
        playerNameHeight += 150;
    })
  },

  allReady: function(players) {
    return players.reduce((acc, curr) => {
     return acc && curr.ready
    }, true)
  }



};