var Music = require("./Music");


var search = function(req, res) {
	if (!req.query || !req.query.q) {
		return res.json({err: "missing search parameters"});
	}
	if (!req.query || !req.query.source) {
		return res.json({err: "missing source parameters"});
	}
	Music.search(req.query.source, req.query.q, req.user).then(function(response) {
		return res.json(response);
	}).catch(function(err) {
		console.log("search ended with an error");
		console.log(err);
		console.log(err.stack);
		return res.json({err: err});
	});
};

module.exports = {
	search: search
};