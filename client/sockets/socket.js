var Client = {};
Client.socket = io.connect();

var setGameEventHandlers = function() {
  Client.socket.on('newPlayer', function(player) {
    //data is one player
    Game.addNewPlayer(player.id, player.x, player.y);
  });

  Client.socket.on('allPlayers', function(players) {
    //data is series of players
    players.forEach((player) => {
      Game.addNewPlayer(player.id, player.x, player.y);
    });
  });

  Client.socket.on('remove', function(playerId) {
    Game.remove(playerId);
  });

  Client.socket.on('updatePlayer', function(player) {
    Game.updatePlayer(player.id, player.x, player.y);
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
