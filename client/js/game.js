var Game = {};
Game.Players = {};
Game.boundaries = [];
Game.holes = [];
Game.text = {};

Game.init = function() {
  game.state.disableVisibilityChange = true;
  setGameEventHandlers();
};

Game.create = function() {
  Game.add.sprite(0, 0, 'background');
  Client.askNewPlayer();
  Game.cursor = {x: 450, y: 300};
  Game.Player = game.add.group();
  Game.bound = game.add.group();
  Game.hole = game.add.group();

  Game.heartBeat();
  Game.pulse = setInterval(Game.heartBeat, 10);

  Game.holes.push(Game.hole.create(375, 375, 'hole'));
  Game.holes.forEach( (hole) => {
  	hole.animations.add('explode');
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 50, true)
  });

  Game.bound.create(750, 0, 'vertical');
};

Game.update = function() {
  Game.cursor = {x: game.input.mousePointer.x, y: game.input.mousePointer.y};
};

Game.heartBeat = function() {
  Client.heartBeat(Game.cursor);
};

Game.updatePlayerPosition = function(player) {
  var pastPlayer = Game.Players[player.id];
  if (pastPlayer) {
    var tween = Game.add.tween(pastPlayer);
    tween.to({x: player.x, y: player.y}, 10);
    tween.start();
  }
  Game.displayPlayerInfo(player);
}

Game.addNewPlayer = function(player) {
  if (Game.Players[player.id]) {
    Game.Players[player.id].destroy();
  }
  Game.Players[player.id] = Game.Player.create(player.x, player.y, 'character');
  var player = Game.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
};

Game.remove = function(id) {
  Game.Players[id].destroy();
  delete Game.Players[id];
};


Game.death = function(player) {
  player = Game.Players[player.id];
  player.kill();
};

Game.displayPlayerInfo = function(player) {
  if (player.username) {
    var username = player.username + '.'; //temp
    if (Game.text[username]) {
    	Game.text[username].destroy();
    }
    Game.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#000000' });
  	var displayText = player.username + ': ' + player.lives + ' lives';
  	var textHeight = 30 + 30 * player.id;
  	var id = player.id;
  	if (Game.text[id]) {
  		Game.text[id].destroy();
  	}
  	Game.text[id] = game.add.text(760, textHeight, displayText, {font: '18px Arial', fill: '#000000' });
  }
}

Game.over = function(players) {
  //pass the players object to results to display
  game.state.start('Results', true, false, players);
  removeAllSocketListenersGame();
}