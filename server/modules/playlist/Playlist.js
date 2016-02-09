var PlaylistModel = require("../Link").MongooseModels.Playlist;
var mongoose = require('mongoose');
var _ = require("lodash");

var MusicSource = require("../sources/MusicSource");


var initPlaylist = function(raspberry, tracks) {
	return new Promise(function(resolve, reject) {
		console.log("INIT PLAYLIST for " + raspberry.name);
		var playlist = new PlaylistModel();
		playlist.raspberryName = raspberry.name;
		playlist._id = mongoose.Types.ObjectId();
		playlist.tracks = tracks || [];
		if (tracks) {
			playlist.idPlaying = 0;
		}

		console.log("INIT PLAYLIST saving")
		playlist.save(function(err) {
			if (err) {
				console.log("err")
				console.log(err);
				return reject(err);
			} else {
				console.log("done")
				return resolve(playlist);
			}
		});
	});
};
var getTrackData = function(user, track, musicSource) {
	return new Promise(function(resolve, reject) {
		var module = MusicSource.getSourceModule(musicSource);
		module.getApi(user).then(function(api) {
			track.id = track.uri.split(":")[2];
			console.log("track uri = " + track.uri + "  ==>  id = " + track.id);
			api.getTrack(track.id).then(function(response) {
				trackData = response.body;
				module.trackToSchema(trackData, track);
				console.log("GET_TRACK: got track data: " + JSON.stringify(track, null, 4));
				resolve(track);
			}).catch(function(err) {
				console.log("GET_TRACK: error in getTrack: " + err);
				console.log("GET_TRACK: error was for track uri = " + track.uri + "  ==>  id = " + track.id);
				reject(err);
			});
		}).catch(function(err) {
			console.log("GET_TRACK: error in getAPI: " + err);
			reject(err);
		});
	});
}
var getTracksData = function(user, tracks, musicSource) {
	return new Promise(function(resolve, reject) {
		var module = MusicSource.getSourceModule(musicSource);
		module.getApi(user).then(function(api) {
			ids = tracks.map(function(track) {
				console.log("GET_TRACK_DATA: track = " + track)
				track.id = track.uri.split(":")[2];
				return track.id;
			});
			console.log("GET_TRACK_DATA ids = " + ids);
			api.getTracks(ids).then(function(response) {
				tracksData = response.body.tracks;
				tracks = [];
				for (var i = 0; i < tracksData.length; i++) {
					tracks.push(module.trackToSchema(tracksData[i], tracks[i]));
				}
				resolve(tracks);
			}).catch(function(err) {
				console.log("GET_TRACK_DATA: error in getTracksData: " + err);
				reject(err);
			});
		}).catch(function(err) {
			console.log("GET_TRACK_DATA: error in getAPI: " + err);
			reject(err);
		})
	});
}
var get = function(raspberry) {
	return new Promise(function(resolve, reject) {
		console.log("GET PLAYLIST: start for " + raspberry.name)
		PlaylistModel.findOne({raspberryName: raspberry.name}, function(err, playlist) {
			if (err) {
				return reject(err);
			} else {
				if (!playlist) {
					console.log("no playlist for " + raspberry.name);
					initPlaylist(raspberry).then(resolve).catch(reject);
				} else {
					console.log("got playlist for " + raspberry.name)
					resolve(playlist);
				}
			}
		});
	});
};
var addTrack = function(user, track, playlist) {
	return new Promise(function(resolve, reject) {
		getTrackData(user, track).then(function(track) {
			console.log("PLAYLIST_ADD_TRACK: got track data");
			playlist.tracks.push(track);
			playlist.save(function(err) {
				if (err) {
					console.log("PLAYLIST_ADD_TRACK: error on saving: " + err);
					return reject(err);
				} else {
					console.log("PLAYLIST_ADD_TRACK: saved");
					process.io.sockets.emit("playlist:track:added", {track:track});
					return resolve(track);
				}
			})
		}).catch(reject);
	});
};
var addTrackset = function(user, trackset, playlist) {
	return new Promise(function(resolve, reject) {
		getTracksData(user, trackset).then(function(trackset) {
			if (!playlist.tracks) {
				playlist.tracks = trackset;
			} else {
				playlist.tracks = playlist.tracks.concat(trackset);
			}
			playlist.save(function(err) {
				if (err) {
					console.log("save playlist err");
					console.log(err);
					return reject(err);
				} else {
					process.io.sockets.emit("playlist:track:added", {trackset:trackset});
					return resolve(playlist);
				}
			});
		}).catch(reject);
	});
};;
var deleteTrack = function(raspberry, trackId) {
	return new Promise(function(resolve, reject) {
		get(raspberry).then(function(playlist) {
			for(var i = 0; i < playlist.tracks.length; i++) {
				if (playlist.tracks[i]._id.equals(trackId)) {
					console.log("found track to delete " + playlist.tracks[i]);
					playlist.tracks.splice(i, 1);
					break;
				}
			}
			playlist.save(function(err) {
				if (err) {
					return reject(err);
				}
				process.io.sockets.emit("playlist:track:removed", {_id:trackId});
				return resolve();
			})
		}).catch(reject);
	});
}
var clearPlaylist = function(raspberry) {
	console.log("clearPlaylist");
	return new Promise(function(resolve, reject) {
		get(raspberry).then(function(playlist) {
			console.log("got playlist");
			playlist.tracks = [];
			playlist.save(function(err) {
				if (err) {
					console.log("=========");
					console.log(err);
					return reject(err);
				} else {
					process.io.sockets.emit("playlist:track:clear", {raspberry: playlist.raspberryName});
					return resolve();
				}
			})
		}).catch(reject);
	});
}
var setPlayingId = function(raspberry, _id) {
	return new Promise(function(resolve, reject) {
		get(raspberry).then(function(playlist) {
			playlist.idPlaying = _id;
			playlist.save(function(err) {
				if (err) {
					console.log("=========");
					console.log(err);
					return reject(err);
				} else {
					console.log("set idPlaying = " + _id);
					var track = {};
					for(var i = 0; i < playlist.tracks.length; i++) {
						if (playlist.tracks[i]._id == _id) {
							track = playlist.tracks[i];
							break;
						}
					}
					process.io.sockets.emit("playlist:playing:id", {idPlaying: _id, track: track, raspberry: playlist.raspberryName});
					return resolve();
				}
			})
		}).catch(reject);
	});
};

trackOffset_ms = 0;


module.exports = {
	initPlaylist: initPlaylist,
	get: get,
	addTrack: addTrack,
	addTrackset: addTrackset,
	deleteTrack: deleteTrack,
	clearPlaylist: clearPlaylist,
	setPlayingId: setPlayingId,
	trackOffset_ms: trackOffset_ms
};