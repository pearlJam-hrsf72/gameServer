var Game = {};

Game.init = function() {
	game.state.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('background', 'assets/board.png');
	game.load.image('character', 'assets/ball.png');
}

Game.create = function() {
	Game.playerMap = {};
	Game.add.sprite(0, 0, 'background');
	Client.askNewPlayer();
	Game.cursor = {x: 450, y: 300};
	Game.pulse = setInterval(Game.heartBeat, 16);
}

Game.update = function() {
	Game.cursor = {x: game.input.mousePointer.x, y: game.input.mousePointer.y};
}

Game.heartBeat = function() {
	console.log('pulse');
	Client.heartBeat(Game.cursor);
}

Game.addNewPlayer = function(id, x, y) {
	Game.playerMap[id] = Game.add.sprite(x, y, 'character');
}

Game.remove = function(id) {
	Game.playerMap[id].destroy();
	delete Game.playerMap[id];
}

Game.updatePlayer = function(id, x, y) {
	var player = Game.playerMap[id];
	var tween = game.add.tween(player);
	console.log(tween);
	tween.to({x: x, y: y}, 50);
	tween.start();
}