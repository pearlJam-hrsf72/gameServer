var spectateState = {};

spectateState.Players = {};
spectateState.boundaries = [];
spectateState.holes = [];

spectateState.init = function() {
  spectateState.state.disableVisibilityChange = true;
  setGameEventHandlers();
};

spectateState.create = function() {
  spectateState.add.sprite(0, 0, 'background');
  spectateState.Player = game.add.group();
  spectateState.bound = game.add.group();
  spectateState.hole = game.add.group();
  spectateState.boundaries.push(spectateState.bound.create(0, 0, 'horiontal'));
  spectateState.boundaries.push(spectateState.bound.create(0, spectateState.world.height - 10, 'horiontal'));
  spectateState.boundaries.push(spectateState.bound.create(0, 0, 'vertical'));
  spectateState.boundaries.push(spectateState.bound.create(spectateState.world.width - 10, 0, 'vertical'));
  game.physics.enable(spectateState.boundaries);
  spectateState.boundaries.forEach( (bound) => {
    bound.body.immovable = true;
  });

  spectateState.holes.push(spectateState.hole.create(spectateState.world.width / 2, spectateState.world.height / 2, 'theHOLE'));
  
  game.physics.enable(spectateState.holes);
  spectateState.holes.forEach( (hole) => {
    hole.padding = 0;
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
  });
  
  Client.askNewSpectator();
};

spectateState.update = function() {
  var playerCollide = game.physics.arcade.collide(spectateState.Player, spectateState.bound);
  game.physics.arcade.collide(spectateState.Player);
  var overlap = game.physics.arcade.overlap(spectateState.Player, spectateState.hole, spectateState.fallInTheHole);
};

spectateState.fallInTheHole = function(player, hole) {
  console.log(player, '<-- haha you died');
  console.log(hole, '<-- wins agian');
  player.kill();
};

spectateState.colission = function(player1, object2) {
  if (object2.x === 0 || object2.y === 0) {
    var bounce = 1000;
    if (object2 === spectateState.boundaries[1]) {
      player1.body.velocity.y = -1 * bounce;
    } else if (object2 === spectateState.boundaries[0]) {
      player1.body.velocity.y = bounce;
    } else if (object2 === spectateState.boundaries[3]) {
      player1.body.velocity.x = -1 * bounce;
    } else {
      player1.body.velocity.x = bounce;
    }
    player1.body.hasCollided = true;
    setTimeout(function(player1) {
      this.body.hasCollided = false;
    }.bind(player1), 500);
  } else {
    var velocity = 500;
    xDistance = player1.x - object2.x;
    yDistance = player1.y - object2.y;
    var distance = spectateState.distance(player1.x, player1.y, object2.x, object2.y);
    var yVelocity = yDistance / distance;
    var xVelocity = xDistance / distance;
    player1.body.velocity.x = xVelocity * velocity;
    player1.body.velocity.y = yVelocity * velocity;
    player1.body.hasCollided = true;
    setTimeout(function(player1) {
      this.body.hasCollided = false;
    }.bind(player1), 1000);
  }
};

spectateState.addNewPlayer = function(id, x, y) {
  spectateState.Players[id] = spectateState.Player.create(x, y, 'character');
  spectateState.Players[id].anchor.x = 0.5;
  spectateState.Players[id].anchor.y = 0.5;
  game.physics.enable(spectateState.Players[id]);
  spectateState.Players[id].body.collideWorldBounds = true;
  spectateState.Players[id].body.onCollide = new Phaser.Signal();
  spectateState.Players[id].body.onCollide.add(spectateState.colission, this);  
};

spectateState.remove = function(id) {
  spectateState.playerMap[id].destroy();
  delete spectateState.playerMap[id];
};

spectateState.updatePlayer = function(id, x, y) {
  var player = spectateState.Players[id];
  if (player && !player.body.hasCollided) {
    var velocity = 1000;
    var xDistance = x - player.x;
    var yDistance = y - player.y;
    var distance = spectateState.distance(player.x, player.y, x, y);
    var yVelocity = yDistance / distance;
    var xVelocity = xDistance / distance;
    if (Math.abs(yDistance) < 10 && Math.abs(xDistance) < 10) {
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
};

spectateState.distance = function(x, y, xTo, yTo) {
  var xDistance = Math.pow(x - xTo, 2);
  var yDistance = Math.pow(y - yTo, 2);
  return Math.sqrt(xDistance + yDistance);
};