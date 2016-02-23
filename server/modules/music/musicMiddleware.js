var Music = require("./Music");
var MusicSource = require("../sources/MusicSource");
var PlaylistSource = require("../sources/PlaylistSource");


var search = function(req, res) {
	if (!req.query || !req.query.q) {
		return res.json({err: "missing search parameters"});
	}
	if (!req.query || !req.query.source) {
		return res.json({err: "missing source parameters"});
	}
	var options = {
		source: req.query.source,
		limit: req.query.limit || 10,
		offset: req.query.offset || 0,
		type: req.query.type
	}
	console.log("!!!!!!!!!!!!!!!!!!");
				console.log("options = ", options);
	console.log("!!!!!!!!!!!!!!!!!!");
	Music.search(req.query.q, req.user, options).then(function(response) {
		return res.json(response);
	}).catch(function(err) {
		console.log("search ended with an error");
		console.log(err);
		console.log(err.stack);
		return res.json({err: err});
	});
};

var getAlbum = function(req, res) {
	Music.getAlbum(req.user, req.params.source, req.params.id)
		.then(function(response) {
			res.json({
				status: "success",
				data: response
			})
		}).catch(function(err) {
			console.log(err);
			console.log(err.stack);
			res.json({
				status: "error",
				error: err
			});
		})
}


var getSources = function(req, res) {
	var sources = {
		sources: {
			music: MusicSource.sources.map(function(s) { return s.name}),
			playlist: PlaylistSource.sources.map(function(s) { return s.name})
		},
		favorites: {
			music: null,
			playlist: null
		}
	}
	PlaylistSource.getSource(req.user).then(function(playlistSourceName) {
		if (req.user.externals && req.user.externals.music
			&& req.user.externals.music.settings) {
			sources.favorites = {
				music: req.user.externals.music.settings.preferredMusicSource,
				playlist: playlistSourceName
			}
		}
		res.json(sources);
	}).catch(function(err) {
		res.json({err: err});
	})
};

var setMusicSources = function(req, res) {
	res.json({});
}
var setPlaylistSources = function(req, res) {
	PlaylistSource.setPreferredSource(req.user, req.body.source).then(function() {
		res.json({status: "success"});
	}).catch(function(err) {
		res.json({err: err});
	})
}

module.exports = {
	search: search,
	getAlbum: getAlbum,
	getSources: getSources,
	setMusicSources: setMusicSources,
	setPlaylistSources: setPlaylistSources
};