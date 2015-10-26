var Promise = require("bluebird");
var _ = require("lodash");

var PlaylistSource = function() {"use strict";}
PlaylistSource.sources = [];

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

PlaylistSource.getSourceModule = function(sourceName) {
	"use strict";
	var module = null;
	_.forEach(PlaylistSource.sources, function(s) {
		if (s.name === sourceName) {
			module = s.module;
		}
	});
	return module;
};



module.exports = PlaylistSource;