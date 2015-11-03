module.exports = function(router) {
	var musicMiddleware = require("./musicMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/search", userMiddleware.isLoggedIn,  musicMiddleware.search);

	return router;
};