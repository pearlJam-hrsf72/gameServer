var velocity = require('./velocity.js');

var holeCenter = {x: 375, y: 375} //current center of the board 

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
        }.bind(player), 500);
        setTimeout(function() {
          this.collided = false;
        }.bind(players[i]), 500);
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
      if (player.y < 15) {
        player.wall = 'top';
        if (player.yTo < 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          player.wall = undefined;
        }, 2000);
      } else if (player.y > 735) {
        player.wall = 'bottom';
        if (player.yTo > 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          player.wall = undefined;
        }, 2000);
      } else if (player.x < 15) {
        player.wall = 'right';
        if (player.xTo < 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          player.wall = undefined;
        }, 2000);
      } else if (player.x > 735) {
        player.wall = 'left';
        if (player.xTo > 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          player.wall = undefined;
        }, 2000);
    } 
  },

  checkHoleDeath: function(player) {
    var distance = velocity.distanceBetween(player, holeCenter);
    if (distance.distance < 40) {
      return true;
    }
    return false;
  }

};