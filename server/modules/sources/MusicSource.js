var Promise = require("bluebird");
var _ = require("lodash");

var MusicSource = function() {"use strict";}
MusicSource.sources = [];

MusicSource.preferredSource = "spotify";

MusicSource.getModuleApi = function(module, user) {
	"use strict";
	return new Promise(function(resolve, reject) {
		if (typeof module.getApi === "function") {
			module.getApi(user).then(resolve).catch(reject);
		} else {
			return resolve(module);
		}
	});
};

MusicSource.getSourceModule = function(sourceName) {
	"use strict";
	sourceName = sourceName || MusicSource.preferredSource;
	var module = null;
	_.forEach(MusicSource.sources, function(s) {
		if (s.name === sourceName) {
			module = s.module;
		}
	});
	return module;
};



module.exports = MusicSource;