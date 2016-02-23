module.exports = function(router) {
	var playerMiddleware = require("./playerMiddleware");
	var User = require("../../link").getShared().User;

	router.get("/players", User.isLoggedIn, playerMiddleware.getAll);
	router.get("/players/:name", User.isLoggedIn, playerMiddleware.get);


	return router;
};