module.exports = function(router) {
	var PlaylistMiddleware = require("./playlistMiddleware");
	var userMiddleware = require("../Link").User.middleware;

	router.get("/playlists/generate", userMiddleware.isLoggedIn,  PlaylistMiddleware.generate);
	
	router.get("/playlists/:raspberryName", userMiddleware.isLoggedIn,  PlaylistMiddleware.get);
	router.get("/playlists/:raspberryName/clear", userMiddleware.isLoggedIn,  PlaylistMiddleware.clearPlaylist);
	router.post("/playlists/:raspberryName", userMiddleware.isLoggedIn,  PlaylistMiddleware.add);
	router.delete("/playlists/:raspberryName/:trackId", userMiddleware.isLoggedIn,  PlaylistMiddleware.deleteTrack);
	
	

	return router;
};