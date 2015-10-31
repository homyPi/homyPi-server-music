var _ = require("lodash");
var Promise = require("bluebird");
var async = require("async");
var Music = require("../music/Music");
var PlaylistSource = require("../sources/PlaylistSource");

PlaylistGenerator = function() {"use strict";};

PlaylistGenerator.generate = function(user, playlistSource, musicSource, options) {
	if (!options) {
		options = {};
	}
	options.nbItems = options.nbItems || 3
	return new Promise(function(resolve, reject) {
		var module = PlaylistSource.getSourceModule(playlistSource);
		if (!module) {
			return reject("unknown module");
		}
		Music.getMyArtists(user).then(function(myArtists) {
			var instance = new module(myArtists, options)
			instance.init(user).then(function() {
				instance.generate()
					.then(function() {
						if(!musicSource || musicSource == playlistSource) {
							resolve(instance.playlist);
						}
					}).catch(reject);
			}).catch(reject);
		}).catch(reject);
	});
};


module.exports = PlaylistGenerator;

