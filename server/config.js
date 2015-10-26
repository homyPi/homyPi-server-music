var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = {
	"path": "music",
	"schemas": {
		artist: {
			name: String,
			images: Schema.Types.Mixed,
			useItAsAlarm: Boolean,
			user: {
				_id: Schema.ObjectId,
				username: String
			},
			externals: {}
		},
		playlist: {
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
	"setSchemas": function(schemaDescriptions) {
		mongoose.model('Artist', new Schema(schemaDescriptions.artist));
		mongoose.model('Playlist', new Schema(schemaDescriptions.playlist));	
	}
}