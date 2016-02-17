/**
 * Created by nolitsou on 9/8/15.
 */
var Playlist  = require("../playlist/Playlist");
var Raspberry  = require("../Link").Raspberry;
var _ = require("lodash");
var MusicSource = require("../sources/MusicSource");
var PlaylistGenerator = require("../playlist/PlaylistGenerator");
var Players = require("./Players");

module.exports = function(socket, io) {
	socket.on("player:resume", function(data) {
		if (!data.name) {
			return;
		}
		var player = Players.get(data.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		console.log(player);
		player.setStatus("PLAYING");
		io.sockets.connected[player.socketId].emit("player:resume");
	});
	socket.on("player:pause", function(data) {
		if (!data.name) {
			return;
		}
		var player = Players.get(data.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		player.setStatus("PAUSED");
		io.sockets.connected[player.socketId].emit("player:pause");
	});
	socket.on("player:next", function(data) {
		if (!data.name) {
			return;
		}
		var player = Players.get(data.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		io.sockets.connected[player.socketId].emit("player:next");
	});
	socket.on("player:previous", function(data) {
		if (!data.name) {
			return;
		}
		var player = Players.get(data.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		io.sockets.connected[player.socketId].emit("player:previous");
	});
	socket.on("player:play:track", function(data) {
		if (!data.player || !data.player.name || !data.track) {
			console.log("missing data for 'player:play:track': " + JSON.stringify(data, null, 2));
			return;
		}
		var player = Players.get(data.player.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		console.log("player:play  " + JSON.stringify(data.track));
		io.sockets.connected[player.socketId].emit("player:play:track", data.track);
	});
	socket.on("player:play:album", function(data) {
		if (!data.player || !data.player.name || !data.album || !data.album.id) {
			console.log("missing data for 'player:play:album': " + JSON.stringify(data, null, 2));
			return;
		}
		var player = Players.get(data.player.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		var trackset = [];
		var Spotify = MusicSource.getSourceModule("spotify");

		Spotify.getApi(socket.decoded_token).then(function(api) {
			api.getAlbumTracks(data.album.id).then(function(response) {
				_.forEach(response.body.items, function(item) {
					trackset.push({"source": "spotify", "uri": item.uri});
				});
				console.log("play: " + JSON.stringify(trackset, null, 2));
				console.log("on player " + player.name);
				io.sockets.connected[player.socketId].emit("player:play:trackset", {trackset: trackset});
			}).catch(function(err) {
				console.log(err);
			});
		});
	});
	socket.on("player:play:generated", function(data) {
		console.log("player:play:generated with:\n" + JSON.stringify(data, null, 2));
		if (!data.player || !data.player.name) {
			return;
		}
		var player = Players.get(data.player.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		if(!data.options) {
			data.options = {};
		}
		PlaylistGenerator.generate(socket.decoded_token, data.generator, data.musicSource, data.options)
			.then(function(playlist) {
				var trackset = [];
				for(var i = 0; i < playlist.length; i++) {
					if (playlist[i].track) {
						trackset.push({
							source: "spotify",
							uri: playlist[i].track.uri,
							name: playlist[i].track.name
						});
					}
				} 
				console.log("SOCKET PLAYER GENERATE: got playlist: " + JSON.stringify(trackset, null, 4));
				io.sockets.connected[player.socketId].emit("player:play:trackset", {"trackset": trackset});
			}).catch(function(err) {
				socket.emit("error", err);
			});
	});
	socket.on("player:play:trackset", function(data) {
		socket.broadcast.emit("player:play:trackset", data);
	});
	socket.on("player:playlist:add", function(data) {
		console.log("player:playlist:add  " + JSON.stringify(data));
		socket.broadcast.emit("player:playlist:add", data);
	});
	socket.on("player:playlist:remove", function(data) {
		if (!data || !data.player || !data.player.name || !data._id) {
			return;
		}
		var player = Players.get(data.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		io.sockets.connected[player.socketId].emit("player:playlist:remove", {_id: data._id});
	});
	socket.on("player:playing:id", function(data) {
		console.log("player:playing:id  " + JSON.stringify(data));
		Playlist.setPlayingId(data._id);
	});
	socket.on("player:status", function(request) {
		if (!socket.raspberryInfo || !socket.raspberryInfo.name) return;
		Raspberry.findOne(socket.raspberryInfo.name)
			.then(function(raspberry) {
				var player = Players.get(raspberry.name);
				if (!player) return;
				player.setStatus(request.status);
				if(request.playingId) {
					Playlist.setPlayingId(socket.raspberryInfo, request.playingId);
				}
				socket.broadcast.emit("player:status:updated", {name: raspberry.name, status: request.status});
			}).catch(function(err) {
				console.log(err);
			});
		
	});
	socket.on("playlist:track:progress", function(data) {
		Playlist.trackOffset_ms = data.progress;
	});
	socket.on("playlist:track:progress:get", function(data) {
		console.log("playlist:track:progress:get", Playlist.trackOffset_ms);
		socket.emit("playlist:track:progress", {trackOffset_ms: Playlist.trackOffset_ms})
	});
	socket.on("player:volume:set", function(data) {
		console.log("player:volume:set with " + JSON.stringify(data));
		if (!data || !data.player || !data.player.name ||
			!data.volume || isNaN(data.volume)) {
			console.log("invalid data");
			return;
		}
		var player = Players.get(data.player.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		io.sockets.connected[player.socketId].emit("player:volume:set", {volume: data.volume})
	});
	socket.on("player:volume:isSet", function(data) {
		console.log("player:volume:isSet", JSON.stringify(data, null, 2))
		if (!socket.raspberryInfo || !socket.raspberryInfo.name) {
			console.log("missing raspberryInfo");
			return;
		}
		data.player = {name: socket.raspberryInfo.name};
		var player = Players.get(data.player.name);
		if (!player) {
			console.log("unknown player");
			return;
		}
		player.volume = data.volume;
		socket.broadcast.emit("player:volume:isSet", data);
	});
	socket.on("player:seek", function(data) {
		if (!data.player || !data.player.name || !data.progress_ms) {
			return;
		}
		var player = Players.get(data.player.name);
		if (!player || !player.socketId) {
			console.log("id unknown");
			return;
		}
		io.sockets.connected[player.socketId].emit("player:seek", {progress_ms: data.progress_ms})
	});
};