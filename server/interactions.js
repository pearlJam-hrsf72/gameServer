var velocity = require('./velocity.js');

var holeCenter = {x: 375, y: 375} //current center of the board 

module.exports = {
  checkPlayerCollision: function(player, players) {
    for (var i = 0; i < players.length; i ++ ) {
      var distance = velocity.distanceBetween(player, players[i]).distance 
      if (distance < 35 && distance > 1) {
        player.collided = true;
        players[i].collided = true;
        setTimeout(function() {
          if (this.collided === true)
            this.collided = null;
        }.bind(player), 500);
        setTimeout(function() {
          if (this.collided === true)
            this.collided = null;
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
        player.collided = 'top';
        if (player.yTo < 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          if (this.collided === 'top')
            this.collided = null;
        }.bind(player), 2000);
      } else if (player.y > 735) {
        player.collided = 'bottom';
        if (player.yTo > 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          if (this.collided === 'bottom')
            this.collided = null;
        }.bind(player), 2000);
      } else if (player.x < 15) {
        player.collided = 'right';
        if (player.xTo < 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          if (this.collided === 'right')
            this.collided = null;
        }.bind(player), 2000);
      } else if (player.x > 735) {
        player.collided = 'left';
        if (player.xTo > 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          if (this.collided === 'left')
            this.collided = null;
        }.bind(player), 2000);
    } 
  },

  checkHoleDeath: function(player) {
    //need to remove player from the array on the server, if window gets refreshed 
    //'ghost ball' appears where dead player's cursor is
    var distance = velocity.distanceBetween(player, holeCenter);
    if (distance.distance < 40) {
      player.lives --;
      if (player.lives === 0) {
        return true;
      } else {
        module.exports.spawn(player);
      }
    }
    return false;
  },

  spawn: function(player) {
    player.x = Math.random() * 750;
    player.y = Math.random() * 750;
    distance = velocity.distanceBetween(player, holeCenter);
    module.exports.checkWallCollision(player);
    if (distance.distance < 150 || player.collided) {
      player.collided = undefined;
      module.exports.spawn(player);
    }
  }

};








