var Players = require("./Players");

var getAll = function(req, res) {
	var list = Players.getAll();
	res.json({
		status: "success", data: {
			items: list,
			total: list.length
		}
	});
};
var get = function(req, res) {
	var player = Players.get(req.params.name);
	res.json({
		status: "success", data: player
	});
};

module.exports = {
	getAll: getAll,
	get: get
};