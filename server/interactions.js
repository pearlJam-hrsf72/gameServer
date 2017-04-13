var velocity = require('./velocity.js');

module.exports = {
  checkPlayerCollision: function(player, players) {
    for (var i = 0; i < players.length; i ++ ) {
      var distance = velocity.distanceBetween(player, players[i]).distance 
      if (distance < 35 && distance > 1) {
        console.log('collision');
        player.collided = true;
        players[i].collided = true;
        setTimeout(function() {
          this.collided = false;
        }.bind(player), 250);
        setTimeout(function() {
          this.collided = false;
        }.bind(players[i]), 250);
        return players[i];
      }
    }
    return false;
  },

  collision: function(player1, player2) {
    var distance = velocity.distanceBetween(player1, player2);
    player1.xTo = distance.x / distance.distance;
    player1.yTo = distance.y / distance.distance;
    player2.xTo = - player1.xTo;
    player2.yTo = - player1.yTo;
  },

  checkWallCollision: function(player) {
      if (player.y < 15 && player.wall !== 'top') {
        player.wall = 'top';
        player.yTo = - player.yTo;
        setTimeout(function() {
          player.wall = undefined;
        }, 1000);
      } else if (player.y > 735 && player.wall !== 'bottom') {
        player.wall = 'bottom';
        player.yTo = - player.yTo;
        setTimeout(function() {
          player.wall = undefined;
        }, 1000);
      } else if (player.x < 15 && player.wall !== 'right') {
        player.wall = 'right';
        player.xTo = - player.xTo;
        setTimeout(function() {
          player.wall = undefined;
        }, 1000);
      } else if (player.x > 735 && player.wall !== 'left') {
        player.wall = 'left';
        player.xTo = - player.xTo;
        setTimeout(function() {
          player.wall = undefined;
        }, 1000);
    } 
  }



};