var velocity = require('./velocity');
var interactions = require('./interactions');

module.exports = function(players) {
  var death = [];
	if (players.length === 1) {
    return true;
  } else {
    players.forEach( (player) => {
      var playerCollision = interactions.checkPlayerCollision(player, players);
      if (playerCollision) {
        interactions.collision(player, playerCollision);
      }
      interactions.checkWallCollision(player);
      velocity.updatePosition(player, player.mouse);
      var dead = interactions.checkHoleDeath(player);
      if (dead) {
        death.push(player);
      }
    });
    return death;
  }
}