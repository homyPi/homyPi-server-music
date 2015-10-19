import $ from 'jquery'
var UserAPI = window.UserAPI;

var config = window.homy_config;
var serverUrl = (config.server_url || "") + "/api/modules/music/playlists";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {

	loadPlaylist() {
		return new Promise((resolve, reject) => {
			$.ajax({
					url: serverUrl + "/",
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						console.log(resp);
						resolve(resp.playlist);
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
};