var playlistRoutes = require("./modules/playlist/playlistRoutes");
var Music = require("./modules/music/Music");
var musicRoutes = require("./modules/music/routes");
module.exports = {
	addSource: function(module, name) {
		console.log("====== new source ======");
		console.log(module);
		console.log("========================");
		Music.sources.push({module: module});
	},
	setSocket: function(socket) {
		require("./modules/player/playerSocket")(socket);
	},
	routes: function(app, router) {
		router.get("/", function(req, res) {
			res.json({"name": "music", "status": "up"});
		});
		router.get("/sources", function(req, res) {
			var sources = Music.sources.map(function(s) { return s.name});
			res.json(sources);
		});
		musicRoutes(router);
		playlistRoutes(router);
		return router;
	},
	config: require("./config")
}