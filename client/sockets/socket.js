var Client = {};
Client.socket = io.connect()

Client.askNewPlayer = function() {
	Client.socket.emit('addNewPlayer');
};

Client.socket.on('newPlayer', function(player) {
	//data is one player
	Game.addNewPlayer(player.id, player.x, player.y);
})

Client.socket.on('allPlayers', function(players) {
	//data is series of players
	players.forEach((player) => {
		Game.addNewPlayer(player.id, player.x, player.y);
	})
})

Client.socket.on('remove', function(playerId) {
	Game.remove(playerId);
})

Client.socket.on('updatePlayer', function(player) {
	Game.updatePlayer(player.id, player.x, player.y);
})

Client.heartBeat = function(coordinates) {
	Client.socket.emit('heartBeat', coordinates);
}

Client.joinLobby = function() {
	Client.socket.emit('joinLobby');
}

Client.socket.on('playerJoined', function(username) {
	lobbyState.onPlayerJoin(username);
})