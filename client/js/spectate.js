var spectateState = {};

spectateState.Players = {};
spectateState.boundaries = [];
spectateState.holes = [];
spectateState.text = {};


spectateState.init = function() {
  spectateState.state.disableVisibilityChange = true;
  setSpectateEventHandlers();
};

spectateState.create = function() {
  spectateState.add.sprite(0, 0, 'background');
  spectateState.Player = game.add.group();
  spectateState.bound = game.add.group();
  spectateState.hole = game.add.group();
  
  spectateState.holes.push(spectateState.hole.create(375, 375, 'hole'));
  spectateState.holes.forEach( (hole) => {
    hole.animations.add('explode');
    hole.anchor.y = 0.5;
    hole.anchor.x = 0.5;
    hole.animations.play('explode', 50, true);
  });

  spectateState.bound.create(750, 0, 'vertical');
  Client.askNewSpectator();
};

spectateState.addNewPlayer = function(player) {
  spectateState.Players[player.id] = spectateState.Player.create(player.x, player.y, 'character');
  var player = spectateState.Players[player.id];
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
};

spectateState.updatePlayerPosition = function(player) {
  var pastPlayer = spectateState.Players[player.id];
  if (pastPlayer) {
    var tween = spectateState.add.tween(pastPlayer);
    tween.to({x: player.x, y: player.y}, 10);
    tween.start();
  }
  spectateState.displayPlayerInfo(player);
}

spectateState.remove = function(id) {
  spectateState.playerMap[id].destroy();
  delete spectateState.playerMap[id];
};

spectateState.displayPlayerInfo = function(player) {
  var username = player.username;

  if (spectateState.text[username]) {
    spectateState.text[username].destroy();
  }
  spectateState.text[username] = game.add.text(player.x, player.y, username, {font: '18px Arial', fill: '#000000'});
  var displayText = player.username + ': ' + player.lives + ' lives';
  var textHeight = 30 + 30 * player.id;
  var id = player.id;
  if (spectateState.text[id]) {
    spectateState.text[id].destroy();
  }
  spectateState.text[id] = game.add.text(760, textHeight, displayText, {font: '18px Arial', fill: '#000000'});
}

spectateState.over = function(players) {
  game.state.start('Results', true, false, players);
  removeAllSocketListenersSpectate();
}

spectateState.death = function(player) {
  player = spectateState.Players[player.id];
  player.kill();
}

