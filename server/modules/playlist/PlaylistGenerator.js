var _ = require("lodash");
var Promise = require("bluebird");
var async = require("async");
var Music = require("../music/Music");
var PlaylistSource = require("../sources/PlaylistSource");
var MusicSource = require("../sources/MusicSource");

PlaylistGenerator = function() {"use strict";};

PlaylistGenerator.convertTo = function(playlist, musicSource, user) {
	return new Promise(function(resolve, reject) {
		var module = MusicSource.getSourceModule(musicSource);
		if (!module) {
			return reject("unknown module");
		}
		MusicSource.getModuleApi(module, user)
			.then(function(module) {
				module.convertPlaylist(playlist)
					.then(resolve)
					.catch(reject);
			}).catch(reject);
	});
}

PlaylistGenerator.generate = function(user, playlistSource, musicSource, options) {
	if (!options) {
		options = {};
	}
	options.nbItems = options.nbItems || 3
	return new Promise(function(resolve, reject) {
		console.log("GETTING module " + playlistSource);
		var module = PlaylistSource.getSourceModule(playlistSource);
		if (!module) {
			return reject("unknown module");
		}
		Music.getMyArtists(user).then(function(myArtists) {
			var instance = new module(myArtists, options);
			instance.init(user).then(function() {
				instance.generate()
					.then(function() {
						if(!musicSource || musicSource == playlistSource) {
							resolve(instance.playlist);
						} else {
							PlaylistGenerator.convertTo(instance.playlist, musicSource, user)
								.then(resolve)
								.catch(reject);
						}
					}).catch(reject);
			}).catch(reject);
		}).catch(reject);
	});
};


module.exports = PlaylistGenerator;

