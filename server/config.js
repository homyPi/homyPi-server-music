var Schema = require("mongoose").Schema;
module.exports = {
	"path": "music",
	"schemas": {
		Artist: {
			name: String,
			images: Schema.Types.Mixed,
			useItAsAlarm: Boolean,
			user: {
				_id: Schema.ObjectId,
				username: String
			},
			externals: {}
		},
		Playlist: {
			raspberryName: String,
			idPlaying: String,
			tracks: [{
				_id: Schema.ObjectId,
				id: String,
				source: String,
				uri: String,
				name: String,
				duration_ms: Number,
				artists: [{
						id: String,
						name: String,
						uri:String
					}],
				album: {
					id: String,
					album_type: String,
					name: String,
					uri: String,
					images: { type : Array , "default" : [] }
				},
				externals: {}
			}]
		}
	},
	"externals": [
		{
			baseSchema: "User",
			name: "music",
			schema: {
				settings: {
					preferredPlaylistSource: String,
					preferredMusicSource: String
				}
			}
		}
	]
}