var MusicSource = require("./modules/sources/MusicSource");
var PlaylistSource = require("./modules/sources/PlaylistSource");

module.exports = {
    addMusicSource: function (module, name) {
        MusicSource.sources.push({name: name, module: module});
    },
    addPlaylistSource: function (module, name) {
        PlaylistSource.sources.push({name: name, module: module});
    }
};
