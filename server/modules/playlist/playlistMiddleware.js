var Playlist = require("./Playlist");
var PlaylistGenerator = require("./PlaylistGenerator");
/**
 * Get current trackset
 */
var get = function(req, res) {
	console.log("get playlist");
	Playlist.get({name: req.params.raspberryName})
		.then(function(playlist) {
			res.json({playlist: {"trackset": playlist.tracks, "idPlaying": playlist.idPlaying}});
		}).catch(function(err) {
			res.json({err: err});
		});
};

/**
 * Delete a track from current trackset
 * @param {ObjectId} req.params.trackId Id of the track to delete
 */
var deleteTrack = function(req, res) {
	Playlist.deleteTrack({raspberry: {name: req.params.raspberryName}}, req.params.trackId).then(function() {
		res.json({status: "success"});
	}).catch(function(err) {
		res.json({err: err});
	});
};


var add = function(req, res) {
	var data = req.body;
	console.log("MIDDLEWARE_ADD_PLAYLIST: get playlist for " + req.params.raspberryName);
	Playlist.get({name: req.params.raspberryName}).then(function(playlist) {
		console.log("MIDDLEWARE_ADD_PLAYLIST: got playlist");
		if (data.track) {
			console.log("MIDDLEWARE_ADD_PLAYLIST: add track");
			Playlist.addTrack(req.user, data.track, playlist)
				.then(function(track) {
					res.json({track: track});
				}).catch(function(err) {
					console.log("===========");
					console.log(err);
					console.log("===========");
					res.json({err: err});
				});
		} else if (data.trackset) {
			console.log("MIDDLEWARE_ADD_PLAYLIST: add trackset");
			Playlist.addTrackset(req.user, data.trackset, playlist)
				.then(function(playlist) {
					res.json({trackset: playlist.tracks});
				}).catch(function(err) {
					console.log(err);
					res.json({err: err});
				});
		} else {
			res.json({err: "invalid request"});
		}
	});
}
/**
 * Remove al tracks from trackset
 */
var clearPlaylist = function(req, res) {
	Playlist.clearPlaylist({name: req.params.raspberryName}).then(function() {
		console.log("CLEAR_PLAYLIST: done");
		res.json({"status": "success"});
	}).catch(function(err) {
		console.log("===========");
		console.log(err);
		res.json({err: err});
	})
};

var generate = function(req, res) {
	PlaylistGenerator.generate(req.user, req.query.generator, req.query.musicSource, req.query)
		.then(function(playlist) {
			res.json({playlist: playlist});
		}).catch(function(err) {
			console.log(err);
			console.log(err.stack);
			res.json({err: err});
		})
}

module.exports = {
	get: get,
	deleteTrack: deleteTrack,
	add: add,
	clearPlaylist: clearPlaylist,
	generate: generate
}