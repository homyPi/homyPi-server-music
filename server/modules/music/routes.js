module.exports = function(router) {
	var musicMiddleware = require("./musicMiddleware");
	var userMiddleware = require(__base + "middleware/user");

	router.get("/search", userMiddleware.isLoggedIn,  musicMiddleware.search);

	return router;
};