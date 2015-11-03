var playlistRoutes = require("./modules/playlist/playlistRoutes");
var Music = require("./modules/music/Music");
var MusicSource = require("./modules/sources/MusicSource");
var PlaylistSource = require("./modules/sources/PlaylistSource");
var musicRoutes = require("./modules/music/routes");
module.exports = {
	addMusicSource: function(module, name) {
		MusicSource.sources.push({name: name, module: module});
	},
	addPlaylistSource: function(module, name) {
		PlaylistSource.sources.push({name: name, module: module});
	},
	setSocket: function(socket) {
		require("./modules/player/playerSocket")(socket);
	},
	routes: function(app, router) {
		router.get("/", function(req, res) {
			res.json({"name": "music", "status": "up"});
		});
		router.get("/sources", function(req, res) {
			var sources = {
				music: MusicSource.sources.map(function(s) { return s.name}),
				playlist: PlaylistSource.sources.map(function(s) { return s.name})
			}
			res.json(sources);
		});
		musicRoutes(router);
		playlistRoutes(router);
		return router;
	},
	config: require("./config")
}