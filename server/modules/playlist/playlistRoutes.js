module.exports = function(router) {
	var PlaylistMiddleware = require("./playlistMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/playlists", userMiddleware.isLoggedIn,  PlaylistMiddleware.get);
	router.get("/playlists/clear", userMiddleware.isLoggedIn,  PlaylistMiddleware.clearPlaylist);
	router.post("/playlists", userMiddleware.isLoggedIn,  PlaylistMiddleware.add);
	router.delete("/playlists/:trackId", userMiddleware.isLoggedIn,  PlaylistMiddleware.deleteTrack);
	
	router.get("/playlists/generate", userMiddleware.isLoggedIn,  PlaylistMiddleware.generate);


	return router;
};