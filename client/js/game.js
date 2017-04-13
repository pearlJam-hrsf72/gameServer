var Game = {};
Game.Players = {};
Game.boundaries = [];
Game.holes = [];

Game.init = function() {
  game.state.disableVisibilityChange = true;
  setGameEventHandlers();
};

Game.create = function() {
  Game.add.sprite(0, 0, 'background');
  Client.askNewPlayer();
  Game.cursor = {x: 450, y: 300};
  Game.pulse = setInterval(Game.heartBeat, 16);
  Game.Player = game.add.group();
  Game.bound = game.add.group();
  Game.hole = game.add.group();

  Game.heartBeat();
  setInterval(Game.heartBeat(), 10);

  Game.holes.push(Game.hole.create(game.world.width / 2, game.world.height / 2, 'theHOLE'));
  Game.holes.forEach( (hole) => {
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
  });
};

Game.update = function() {
  Game.cursor = {x: game.input.mousePointer.x, y: game.input.mousePointer.y};
  var playerCollide = game.physics.arcade.collide(Game.Player, Game.bound);
  game.physics.arcade.collide(Game.Player);
  var overlap = game.physics.arcade.overlap(Game.Player, Game.hole, Game.fallInTheHole);
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
}


Game.addNewPlayer = function(player) {
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
