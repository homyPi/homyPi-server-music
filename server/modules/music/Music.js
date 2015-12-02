var Promise = require("bluebird");
var _ = require("lodash");
var MusicSource = require("../sources/MusicSource");
var models;

var Music = function() {"use strict"};
Music.init = function(Link) {
	models = Link.MongooseModels;
}

Music.getMyArtists = function(user, options) {
	if (!options) {
		options = {};
	}
	options.offset = options.offset || 0;
	options.limit = options.limit || -1;
	return new Promise(function(resolve, reject) {
		console.log("Music.getMyArtists: start");
		if (!user) {
			return reject({err: "user undefined"});
		}
		var Artist = models.Artist;
		var query = Artist.find({"user._id": user._id})
			.skip(options.offset);
		if (options.limit >= 0) {
			query.limit(options.limit);
		}
		query.exec(function(err, artists) {
			if (err) {
				err.source = "Music.getMyArtists";
				return reject(err);
			} else {
				console.log("Music.getMyArtists: done with ");
				return resolve(artists);
			}
		});
	});
};

Music.getRandomArtist = function(user, nb) {
	return new Promise(function(resolve, reject) {
		if(!nb) {
			nb = 3;
		}
		var result = [];
		var random;
		Music.getMyArtists(user).then(function(artists) {
			for(var i = 0; i < nb; i++) {
				random = Math.floor((Math.random() * artists.length));
				result.push(artists[random]);
				artists.splice(random, 1);
			}
			resolve(result);
		}).catch(reject);
	});
}

Music.convertTrackTo = function(track, to) {
	return new Promise(function(resolve, reject) {
		if (to == "spotify") {
			console.log("CONVERT TRACK TO SPOTIFY: artist name = " + track.artist_name + " title = " + track.title)
			api.searchTracks(track.artist_name + " " + track.title, { 'offset' : 0, 'limit' : 1}).then(function (data) {
				var track = data.body.tracks.items[0];
				console.log("CONVERT TRACK TO SPOTIFY: search track: Got song");
				return resolve(track);
			}).catch(function (err) {
				err.source = "Spotify.searchTrack";
				console.log(err);
				return reject(err);
			});
		} else {
			console.log("unknown to " + to);
			return resolve(track);
		}
	});
}

Music.convertTracksetTo = function(trackset, to, user) {
	return new Promise(function(resolve, reject) {
		if (to == "spotify") {
			Spotify.getApi(user).then(function(api) {
				var getSpotifyTrackPromises = [];
				for(var i = 0; i < trackset.length; i++) {
					getSpotifyTrackPromises.push(
						Music.convertTrackTo(trackset[i], "spotify", api)
					);
				}
				Promise.all(getSpotifyTrackPromises)
					.then(function(tracks) {
						resolve(tracks);
				})
				.catch(reject);
			}).catch(reject);
		} else {
			console.log("unknown to " + to);
			return resolve(trackset);
		}
	});
}

Music.search = function(query, user, options) {
	options = options || {};
	return new Promise(function(resolve, reject) {
		var module = MusicSource.getSourceModule(options.source);
		if (!module) {
			return reject("unknown source");
		}
		MusicSource.getModuleApi(module, user).then(function(api) {
			api.search(query, {
				limit: options.limit,
				offset: options.offset,
				type: options.type
			}).then(resolve).catch(reject);
		}).catch(reject);
		
	});
}

module.exports = Music;