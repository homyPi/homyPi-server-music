

var PlayerInstance = function(raspberryName, socketId, status, progress) {
	this.name = raspberryName;
	this.socketId = socketId;
	this.status = status || "PAUSED";
	this.progress = progress || 0;

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

Players.new = function(raspberryName, socketId, status, progress) {
	console.log("New Player " + raspberryName);
	for (var i = 0; i < Players.players.length; i++) {
		if (Players.players[i].name === raspberryName) {
			console.log("Already exists");
			return;
		}
	}
	var p = new PlayerInstance(raspberryName, socketId, status, progress);
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