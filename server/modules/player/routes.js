module.exports = function(router) {
	var playerMiddleware = require("./playerMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/players", userMiddleware.isLoggedIn, playerMiddleware.getAll);
	router.get("/players/:name", userMiddleware.isLoggedIn, playerMiddleware.get);


	return router;
};