module.exports = function(router) {
	var musicMiddleware = require("./musicMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/search", userMiddleware.isLoggedIn, musicMiddleware.search);
	router.get("/sources", userMiddleware.isLoggedIn, musicMiddleware.getSources);
	router.post("/sources/music", userMiddleware.isLoggedIn, musicMiddleware.setMusicSources);
	router.post("/sources/playlist", userMiddleware.isLoggedIn, musicMiddleware.setPlaylistSources);


	return router;
};