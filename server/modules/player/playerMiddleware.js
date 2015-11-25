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

module.exports = {
	getAll: getAll,
};