var PlaylistModel = require("../../link").getShared().MongooseModels.Playlist;
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
					process.messager.emit("client:" + playlist.raspberryName,"playlist:track:added", {track:track});
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
					process.messager.emit("client:" + playlist.raspberryName,"playlist:track:added", {trackset:trackset});
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
				process.messager.emit("client:"+raspberry.name, "playlist:track:removed", {_id:trackId});
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
					process.messager.emit("client:"+raspberry.name, "playlist:track:clear", {raspberry: playlist.raspberryName});
					return resolve();
				}
			})
		}).catch(reject);
	});
}

var setPlaylist = function(user, playlist, data) {
	return new Promise((resolve, reject) => {
		playlist.tracks = [];
		if (data.source) {
			console.log("SET_PLAYLIST: get module... ");
			var module = MusicSource.getSourceModule(data.source);
			module.getApi(user).then(function(api) {
				if (data.track) {
					console.log("SET_PLAYLIST: get track data ");
					api.getTrack(data.track.serviceId).then(function(track) {
						console.log("GET_TRACK: got track data: " + JSON.stringify(data.track, null, 4));
						playlist.tracks.push(track);
						playlist.idPlaying = track._id;
						console.log("SET_PLAYLIST: saving playlist");
						playlist.save(function(err) {
							if (err)
								return reject(err);
							process.messager.emit("client:" + playlist.raspberryName,"playlist:set", {playlist: playlist});
							return resolve(playlist);
						});
					}).catch(function(err) {
						console.log("GET_TRACK: error in getTrack: " + err);
						console.log("GET_TRACK: error was for track uri = " + data.track.uri);
						return reject(err);
					});
				} else if (data.album) {
					api.getAlbum(data.album.serviceId).then(function(album) {
						playlist.tracks = album.tracks.items || [];
						playlist.idPlaying = (playlist.tracks.length)? playlist.tracks[0]._id: null;
						playlist.save(function(err) {
							if (err)
								return reject(err);
							process.messager.emit("client:" + playlist.raspberryName,"playlist:set", {playlist: playlist});
							return resolve(playlist);
						})
					}).catch(function(err) {
						console.log("GET_ALBUM: error in getAlbum: " + err);
						console.log("GET_ALBUM: error was for track uri = " + data.album.uri);
						return reject(err);
					});
				} else {
					return reject("Missing one of parameter ('track' or 'album')");
				}

			});
		} else {
			return reject("Missing parameter 'source' (got: " + JSON.stringify(data) + ")");
		}
	})
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
					return resolve();
				}
			})
		}).catch(reject);
	});
};

var getTrack = function(raspberryName, id) {
	return new Promise(function(resolve, reject) {
		get({name: raspberryName}).then(playlist => {
			if (!playlist || !playlist.tracks || !playlist.tracks) {
				return resolve(undefined);
			}
			return resolve(playlist.tracks.find(item => {
				return (item._id == id);
			}));

		}).catch(reject);
	});
};

var trackOffset_ms = 0;


module.exports = {
	initPlaylist,
	get,
	getTrack,
	addTrack,
	addTrackset,
	setPlaylist,
	deleteTrack,
	clearPlaylist,
	setPlayingId,
	trackOffset_ms
};