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
    if (mouse === undefined) {
      mouse = {x: 0, y: 0};
    }
    var velocity = 10; //distance traveled every 10 ms;
    var distance = module.exports.distanceBetween(player, mouse);
    if (distance.distance < 10) {
      velocity = 0;
    }
    var xPercent = distance.x / distance.distance;
    var yPercent = distance.y / distance.distance;
    player.x += xPercent * velocity;
    player.y += yPercent * velocity;
  }

};