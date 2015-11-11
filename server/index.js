var playlistRoutes = require("./modules/playlist/playlistRoutes");
var Music = require("./modules/music/Music");
var MusicSource = require("./modules/sources/MusicSource");
var PlaylistSource = require("./modules/sources/PlaylistSource");
var musicRoutes = require("./modules/music/routes");
var Link = require("./modules/Link");

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
		musicRoutes(router);
		playlistRoutes(router);
		return router;
	},
	config: require("./config"),
	link: function(moduleManager, Raspberry, MongooseModels, UserMiddleware) {
		console.log("linking music");
		Link.Raspberry = Raspberry;
		Link.MongooseModels = MongooseModels;
		Link.User = {
			middleware: UserMiddleware
		}
	}
}