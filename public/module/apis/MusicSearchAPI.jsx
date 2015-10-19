import $ from "jquery"
var UserAPI = window.UserAPI;

var config = window.homy_config;
var serverUrl = (config.server_url || "") + "/api/modules/music";

function setHeaders(xhr) {
    xhr.setRequestHeader ("Authorization", "Bearer " + UserAPI.getToken());
}

export default {
	search(request, type) {
console.log("hey =>",serverUrl);
		return new Promise((resolve, reject) => {
			let url = serverUrl + "/spotify/search?q=" + request;
			if (type) {
				url += "&type=" + type;
			}
			$.ajax({
					url: url,
					type: "GET",
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