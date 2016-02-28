var PlayerModel = require("../../link").getShared().MongooseModels.Players;

import Promise from "bluebird";

var Players = function(){};

Players.get = function(name) {
	return new Promise(function(resolve, reject) {
		PlayerModel.findOne({name: name}, function(err, player) {
			if (err) return reject(err);
			if (!player) return reject({code: 404, message: "player not found"});
			return resolve(player);
		})
	});;
}
Players.getAll = function() {
	return new Promise(function(resolve, reject) {
		PlayerModel.find({}, function(err, players) {
			if (err) return reject(err);
			return resolve(players);
		})
	})
}

Players.new = function(raspberryName, status) {
	return new Promise(function(resolve, reject) {
		PlayerModel.findOne({name: raspberryName}, function(err, player) {
			if (err) return reject(err);
			if (!player) {
				player = new PlayerModel();
				player.name = raspberryName;
			}
			player.status = status;
			player.save(function(err) {
				if(err) return reject(err);
				console.log("Player created: ", player);
				return resolve(player);
			});
		});
	});
}
Players.remove = function(raspberryName) {
	return;
}

module.exports = Players;