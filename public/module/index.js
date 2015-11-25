import React from 'react';
var Player = require("./components/Player");
var PlayerActionCreators = require("./actions/PlayerActionCreators");
import PlaylistActionCreators from './actions/PlaylistActionCreators';
var Link = require("./Link");


module.exports = {
	link: function(functions) {
		
	},
	setSocket: function(socket) {
		socket.on("player:status:updated", function(data) {
	    	console.log("player:status:updated", data);
	    	PlayerActionCreators.updateState(data.name, data.status);
	    });
	    socket.on("playlist:track:added", function(data) {
	    	if (data.track) {
				PlaylistActionCreators.addTrack(data.track);
	    	} else if (data.trackset) {
	    		PlaylistActionCreators.addTrackset(data.trackset);
	    	}
		});
		socket.on("playlist:track:removed", function(data) {
			PlaylistActionCreators.removeTrack(data._id);
		});
		socket.on("playlist:track:clear", function(track) {
			PlaylistActionCreators.clear();
		});
		socket.on("playlist:playing:id", function(data) {
			PlaylistActionCreators.updatePlayingId(data.idPlaying);
		});
		socket.on("playlist:track:progress", function(data) {
			PlaylistActionCreators.updateProgress(data.trackOffset_ms);
		});
		socket.on("modules:new:player", function(data) {
			/*{raspberry: raspberry, module: moduleInfo}*/
			console.log("new playerrrrrrrrr", data)
			PlayerActionCreators.addPlayer(data.raspberry.name, data.module);
		});
		socket.on("modules:remove:player", function(data) {
			PlayerActionCreators.removePlayer(data.raspberry.name, data.module);
		});
	},
	config: require("./config"),
	actions: require("./actions"),
	api: require("./apis"),
	components: require("./components"),
	stores: require("./stores"),
	footer: (<Player />)
}