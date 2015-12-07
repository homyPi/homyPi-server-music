
var PlayerInstance = function(raspberryName, socketId, status, progress, volume) {
	this.name = raspberryName;
	this.socketId = socketId;
	this.status = status || "PAUSED";
	this.progress = progress || 0;
	
	this.volume = volume || 0;

	this.setStatus = function(status) {
		this.status = status;
	}
}

var Players = function(){};

Players.players = [];

Players.get = function(name) {
	for (var i = 0; i < Players.players.length; i++) {
		if (Players.players[i].name === name) {
			return Players.players[i];
		}
	}
	console.log("PLAYER " + name + " not found");
}
Players.getAll = function() {
	return Players.players;
}

Players.new = function(raspberryName, socketId, status, progress, volume) {
	console.log("New Player " + raspberryName);
	for (var i = 0; i < Players.players.length; i++) {
		if (Players.players[i].name === raspberryName) {
			Players.players[i].socketId = socketId;
			Players.players[i].status = status;
			Players.players[i].progress = progress;
			Players.players[i].volume = volume;
			console.log("Already exists");
			return;
		}
	}
	var p = new PlayerInstance(raspberryName, socketId, status, progress, volume);
	Players.players.push(p);
	console.log("Player created: ", p);
}
Players.remove = function(raspberryName) {
	for (var i = 0; i < Players.players.length; i++) {
		if (Players.players[i].name === raspberryName) {
			Players.players.splice(i, 1);
			return;
		}
	}
}

module.exports = Players;