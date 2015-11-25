module.exports = function(router) {
	var playerMiddleware = require("./playerMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/players", userMiddleware.isLoggedIn, playerMiddleware.getAll);


	return router;
};