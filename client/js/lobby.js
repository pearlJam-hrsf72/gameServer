var lobbyState = {
  players: {},

  preload: function() {

  },

  create: function() {
    Client.joinLobby();
    var startLabel = game.add.text(80, game.world.height - 80,
      "press the 'R' key when you're ready", 
      {font: '25px Arial', fill: '#000000' });


    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    rkey.onDown.addOnce(this.ready, this);

  },

  ready: function() {
    Client.ready();
  },

  onPlayerJoin: function(username) {
    var playerName = game.add.text(80, 150, username);
    var playerObj = {ready: false};
    lobbyState.players[username] = playerObj;

  },

  playerReady: function(username) {
    lobbyState.players[username].ready = true;
    var allReady = true;
    console.log(lobbyState.players);
    for (player in lobbyState.players) {
      console.log('playerReady: ', player);
      if (!lobbyState.players[player].ready) {
        allReady = false;
      }
    }
    if (allReady) {
      game.state.start('Game');
    }
    console.log('allReady: ', allReady);
  }
};