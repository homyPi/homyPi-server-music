var playlistRoutes = require("./modules/playlist/playlistRoutes");
var Music = require("./modules/music/Music");
var MusicSource = require("./modules/sources/MusicSource");
var PlaylistSource = require("./modules/sources/PlaylistSource");
var musicRoutes = require("./modules/music/routes");
var playerRoutes = require("./modules/player/routes");
var Link = require("./modules/Link");
var Players = require("./modules/player/Players");

var IO;

module.exports = {
	addMusicSource: function(module, name) {
		MusicSource.sources.push({name: name, module: module});
	},
	addPlaylistSource: function(module, name) {
		PlaylistSource.sources.push({name: name, module: module});
	},
	setSocket: function(socket, io) {
		require("./modules/player/playerSocket")(socket, io);
		IO = io;
	},
	routes: function(app, router) {
		router.get("/", function(req, res) {
			res.json({"name": "music", "status": "up"});
		});
		musicRoutes(router);
		playlistRoutes(router);
		playerRoutes(router);
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
		Link.Raspberry.onModuleChange("music", function(raspberry, module, moduleInfo) {
			console.log("Module change: state=" + module.state);
			if (module.state === "DOWN") {
				Players.remove(raspberry.name);
				IO.emit("modules:remove:player", {raspberry: raspberry, module: moduleInfo});
			} else if (module.state === "UP") {
				Players.new(raspberry.name, raspberry.socketId, moduleInfo.status, moduleInfo.progress);
				console.log("emit modules:new:player");
				console.log(IO);
				IO.emit("modules:new:player", {raspberry: raspberry, module: moduleInfo});
			}
		})
	}
}