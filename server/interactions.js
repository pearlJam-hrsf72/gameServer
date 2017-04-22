var velocity = require('./velocity.js');


const ballSize = 100;
const holeSize = 128;
const numHoles = 4;

module.exports = {
  holeCenters: [],

  createHoles: function() {
    for (let i = 0; i < numHoles; i++) {
      let x = Math.random() * 1700 + 100;
      let y = Math.random() * 1700 + 100;
      module.exports.holeCenters.push({x: x, y: y});
    }
  },

  checkPlayerCollision: function(player, players) {
    for (var i = 0; i < players.length; i ++ ) {
      var distance = velocity.distanceBetween(player, players[i]).distance 
      if (distance < (ballSize + 5) && distance > 1) {
        player.collided = true;
        players[i].collided = true;
        setTimeout(function() {
          if (this.collided === 'player')
            this.collided = null;
        }.bind(player), 500);
        setTimeout(function() {
          if (this.collided === 'player')
            this.collided = null;
        }.bind(players[i]), 400);
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
      if (player.y < 5 + ballSize / 2) {
        player.collided = 'top';
        if (player.yTo < 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          if (this.collided === 'top')
            this.collided = null;
        }.bind(player), 400);
      } else if (player.y > 1905 - (ballSize / 2)) {
        player.collided = 'bottom';
        if (player.yTo > 0) {
          player.yTo = - player.yTo;
        }
        setTimeout(function() {
          if (this.collided === 'bottom')
            this.collided = null;
        }.bind(player), 400);
      } else if (player.x < 5 + ballSize / 2) {
        player.collided = 'right';
        if (player.xTo < 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          if (this.collided === 'right')
            this.collided = null;
        }.bind(player), 400);
      } else if (player.x > 1905 - (ballSize / 2)) {
        player.collided = 'left';
        if (player.xTo > 0) {
          player.xTo = - player.xTo;
        }
        setTimeout(function() {
          if (this.collided === 'left')
            this.collided = null;
        }.bind(player), 400);
    } 
  },

  checkHoleDeath: function(player) {
    var death = false;
    module.exports.holeCenters.forEach( (holeCenter) => {
      var distance = velocity.distanceBetween(player, holeCenter);
      if (distance.distance < (ballSize + holeSize) / 2) {
        death = true;
      }
    })
    if (death) {
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
    var distance = 1900;
    module.exports.holeCenters.forEach( (holeCenter) => {
      tempDistance = velocity.distanceBetween(player, holeCenter);
      if (tempDistance.distance < distance) {
        distance = tempDistance.distance;
      }
    })
    module.exports.checkWallCollision(player);
    if (distance < 150 || player.collided) {
      player.collided = undefined;
      module.exports.spawn(player);
    }
  }

};








