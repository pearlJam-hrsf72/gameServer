var lobbyState = {
  preload: function() {

  },

  create: function() {
    Client.joinLobby();

  },

  onPlayerJoin: function(username) {
    var loadingLabel = game.add.text(80, 150, username);

  }
};