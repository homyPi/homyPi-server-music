var _ = require("lodash");
var Promise = require("bluebird");
var async = require("async");
var Music = require("../music/Music");
var PlaylistSource = require("../sources/PlaylistSource");

PlaylistGenerator = function() {"use strict";};

PlaylistGenerator.generate = function(user, playlistSource) {
	return new Promise(function(resolve, reject) {
		var module = PlaylistSource.getSourceModule(playlistSource);
		if (!module) {
			return reject("unknown module");
		}

		Music.getMyArtists(user).then(function(myArtists) {
			var instance = new module(myArtists, 3)
			instance.init(user).then(function() {
				instance.generate()
					.then(function() {
						resolve(instance.playlist);
					}).catch(reject);
			}).catch(reject);
		}).catch(reject);
	});
};


module.exports = PlaylistGenerator;

