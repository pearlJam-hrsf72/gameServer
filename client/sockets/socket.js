var Client = {};
Client.socket = io.connect();

var setGameEventHandlers = function() {
  Client.socket.on('newPlayer', function(player) {
    Game.addNewPlayer(player);
  });

  Client.socket.on('allPlayers', function(players) {
    players.forEach((player) => {
      Game.addNewPlayer(player);
    });
  });

  Client.socket.on('pulse', function(players) {
  	players.forEach( (player) => {
  		Game.updatePlayerPosition(player);
  	})
  })

  Client.socket.on('death', function(player) {
  	Game.death(player);
  })

  Client.socket.on('remove', function(playerId) {
    Game.remove(playerId);
  });

};

var setLobbyEventHandlers = function() {
  Client.socket.on('playerJoined', function(username) {
    lobbyState.onPlayerJoin(username);
  });

  Client.socket.on('playerReady', function(username) {
    lobbyState.playerReady(username);
  });

  Client.socket.on('allPlayersInLobby', function(allPlayers) {
    allPlayers.forEach(function(player) {
      lobbyState.onPlayerJoin(player.id);
    });
  });
};

var removeAllSocketListeners = function() {
  Client.socket.removeAllListeners('playerJoined');
  Client.socket.removeAllListeners('playerReady');
  Client.socket.removeAllListeners('allPlayersInLobby');
  Client.socket.removeAllListeners('newPlayer');
  Client.socket.removeAllListeners('allPlayers');
  Client.socket.removeAllListeners('remove');
  Client.socket.removeAllListeners('updatePlayer');
};

Client.askNewPlayer = function() {
  Client.socket.emit('addNewPlayer');
};

Client.heartBeat = function(coordinates) {
  Client.socket.emit('heartBeat', coordinates);
};

Client.joinLobby = function() {
  Client.socket.emit('joinLobby');
};

Client.ready = function() {
  Client.socket.emit('playerReady');
};

Client.askNewSpectator = function() {
  Client.socket.emit('newSpectator');
};