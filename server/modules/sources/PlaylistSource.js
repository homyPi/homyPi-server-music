var Promise = require("bluebird");
var _ = require("lodash");

var PlaylistSource = function() {"use strict";}
PlaylistSource.sources = [];
PlaylistSource.preferredSource = "spotify";

PlaylistSource.setPreferredSource = function(user, source) {
	var User = require("../../link").getShared().MongooseModels.User
	return new Promise(function(resolve, reject) {
		User.update({ _id: user._id }, 
			{ 
				$set: { 
					"externals.music.settings.preferredPlaylistSource": source 
				}
			},
			{upsert: true},
			function(err, val) {
				if(err) {
					return reject(err);
				} else {
					return resolve();
				}
			});
	});
}

PlaylistSource.getSource = function(user, sourceName) {
	var User = require("../../link").getShared().MongooseModels.User
	return new Promise(function(resolve, reject) {
		if(sourceName) {
			return resolve(sourceName);
		}
		User.findOne({_id: user._id}, 
			function(err, res) {
				if(err) {
					return reject(err);
				} else {
					if(res && 
						res.externals && 
						res.externals.music && 
						res.externals.music.settings &&
						res.externals.music.settings.preferredPlaylistSource) {
						return resolve(res.externals.music.settings.preferredPlaylistSource);
					} else {
						if (PlaylistSource.sources.length) {
							return PlaylistSource.setPreferredSource(user, PlaylistSource.sources[0].name)
								.then(function() {
									return resolve(PlaylistSource.sources[0].name);
								}).catch(reject);
						} else {
							return resolve();
						}
					}
				}
			});
	});
};

PlaylistSource.getModuleApi = function(module, user) {
	"use strict";
	return new Promise(function(resolve, reject) {
		if (typeof module.getApi === "function") {
			module.getApi(user).then(resolve).catch(reject);
		} else {
			return resolve(module);
		}
	});
};

PlaylistSource.getSourceModule = function(sourceName, user) {
	"use strict";
	return new Promise(function(resolve, reject) {
		PlaylistSource.getSource(user, sourceName)
			.then(function(sourceName) {
				var module = null;
				_.forEach(PlaylistSource.sources, function(s) {
					if (s.name === sourceName) {
						module = s.module;
					}
				});
				if(module) {
					return resolve(module);
				} else {
					return reject("unknown  module");
				}
			}).catch(reject);
	});
};



module.exports = PlaylistSource;