var Game = {};
Game.playerMap = {};

Game.init = function() {
	game.state.disableVisibilityChange = true;
};

Game.preload = function() {
	game.load.image('background', 'assets/board.png');
	game.load.image('character', 'assets/ball.png');
}

Game.create = function() {
	//Game.add.sprite(0, 0, 'background');
	Client.askNewPlayer();
	Game.cursor = {x: 450, y: 300};
	Game.pulse = setInterval(Game.heartBeat, 16);
}

Game.update = function() {
	Game.cursor = {x: game.input.mousePointer.x, y: game.input.mousePointer.y};
}

Game.heartBeat = function() {
	Client.heartBeat(Game.cursor);
}

Game.addNewPlayer = function(id, x, y) {
	Game.playerMap[id] = Game.add.sprite(x, y, 'character');
	Game.playerMap[id].anchor.x = 0.5;
	Game.playerMap[id].anchor.y = 0.5;
	game.physics.enable(Game.playerMap[id]);	
}

Game.remove = function(id) {
	Game.playerMap[id].destroy();
	delete Game.playerMap[id];
}

Game.updatePlayer = function(id, x, y) {
	var player = Game.playerMap[id];
	if (player) {
		var velocity = 1000;
		var xDistance = x - player.x;
		var yDistance = y - player.y;
		var distance = Game.distance(player.x, player.y, x, y);
		var yVelocity = yDistance/distance;
		var xVelocity = xDistance/distance;
		if (Math.abs(yDistance) < 5 && Math.abs(xDistance) < 5) {
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
		} else {
		player.body.velocity.y = yVelocity * velocity;
		player.body.velocity.x = xVelocity * velocity;
		}

		// var tween = Game.add.tween(player);
		// var travel = Game.distance(player.x, player.y, x, y);
		// var time = travel * 3;
		// tween.to({x: x, y: y}, time);
		// tween.start();
	}
}

Game.distance = function(x, y, xTo, yTo) {
	var xDistance = Math.pow(x - xTo, 2);
	var yDistance = Math.pow(y - yTo, 2);
	return Math.sqrt(xDistance + yDistance);
}