var Players = require("./Players");

var getAll = function(req, res) {
	Players.getAll().then(function(players) {
		res.json({
			status: "success", data: {
				items: players,
				total: players.length
			}
		});
	}).catch(function(error) {
		console.log(error);
		res.json({status: "error", error})
	});
};
var get = function(req, res) {
	Players.get(req.params.name).then(function(player) {
		res.json({status: "success", data: player});
	}).catch(function(error) {
		console.log(error);
		res.json({status: "error", error})
	});
};

module.exports = {
	getAll: getAll,
	get: get
};