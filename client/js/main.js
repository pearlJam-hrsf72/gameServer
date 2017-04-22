var winW = window.innerWidth;
var winH = window.innerHeight;

var game = new Phaser.Game(winW - 50, winH - 50, Phaser.CANVAS, document.getElementById('game'), null, true);

game.state.add('Load', loadState);
game.state.add('Menu', menuState);
game.state.add('Lobby', lobbyState);
game.state.add('Game', Game);
game.state.add('Spectate', spectateState);
game.state.add('Results', gameResult);
game.state.start('Load');
