module.exports = function(router) {
	var musicMiddleware = require("./musicMiddleware");
	var User = require("../../link").getShared().User;

	router.get("/search", User.isLoggedIn, musicMiddleware.search);
	router.get("/:source/albums/:id", User.isLoggedIn, musicMiddleware.getAlbum);
	

	router.get("/sources", User.isLoggedIn, musicMiddleware.getSources);
	router.post("/sources/music", User.isLoggedIn, musicMiddleware.setMusicSources);
	router.post("/sources/playlist", User.isLoggedIn, musicMiddleware.setPlaylistSources);


	return router;
};