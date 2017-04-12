var lobbyState = {
  players: {},
  playerNameHeight: 0,

  preload: function() {
  },

  create: function() {
    setLobbyEventHandlers();
    lobbyState.players = {};

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
    console.log('onPlayerJoin');
    var playerName = game.add.text(80, lobbyState.playerNameHeight, username);
    lobbyState.playerNameHeight += 100;
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
      removeAllSocketListeners();
      lobbyState.players = {};
      game.state.start('Game');
    }
    console.log('allReady: ', allReady);
  }
};