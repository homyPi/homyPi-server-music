import $ from "jquery"
var UserAPI = window.UserAPI;

var config = window.homy_config;
var serverUrl = (config.server_url || "") + "/api/modules/music";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getSources() {
		return new Promise((resolve, reject) => {
			let url = serverUrl + "/sources";
			$.ajax({
					url: url,
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						console.log("sources= ", resp);
						resolve(resp);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	updateFavoriteMusicSource(musicSource) {
		return new Promise((resolve, reject) => {
			let url = serverUrl + "/sources/music";
			$.ajax({
					url: url,
					type: "POST",
					data: { 
				        'source': musicSource
				    },
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	},
	updateFavoritePlaylistSource(playlistSource) {
		return new Promise((resolve, reject) => {
			let url = serverUrl + "/sources/playlist";
			$.ajax({
					url: url,
					type: "POST",
					data: { 
				        'source': playlistSource
				    },
					beforeSend: setHeaders,
					success: function(resp) {
						resolve(resp);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
}