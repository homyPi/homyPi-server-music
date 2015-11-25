import $ from "jquery"
var UserAPI = window.UserAPI;

var config = window.homy_config;
var serverUrl = (config.server_url || "") + "/api/modules/music/players";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	getAll() {
		return new Promise((resolve, reject) => {
			let url = serverUrl;
			$.ajax({
					url: url,
					type: "GET",
					beforeSend: setHeaders,
					success: function(resp) {
						if (resp.status === "error") {
							return reject(resp.error);
						} else {
							return resolve(resp.data.items);
						}
					},
					fail: function(err) {
						reject(err)
					}
				});
		});
	}
}