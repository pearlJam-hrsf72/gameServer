module.exports = {
  distanceBetween: function(coor1, coor2) {
    xDistance = coor2.x - coor1.x;
    yDistance = coor2.y - coor1.y;
    distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    return {
      x: xDistance,
      y: yDistance,
      distance: distance
    }
  },

  updatePosition: function(player, mouse) {
    if (mouse) {
      if (mouse.x > 0 && mouse.y > 0) {
        var velocity = 10; //distance traveled every 10 ms;
        var distance = module.exports.distanceBetween(player, mouse);
        if (player.collided) {
          velocity = -2
          player.x += player.xTo * velocity;
          player.y += player.yTo * velocity;
        } else if (player.wall) {
          velocity = 2;
          player.x += player.xTo * velocity;
          player.y += player.yTo * velocity;
        } else if (distance.distance > 10) {
          player.xTo = distance.x / distance.distance;
          player.yTo = distance.y / distance.distance;
          player.x += player.xTo * velocity;
          player.y += player.yTo * velocity;
        } 
      }
    }
  }

};