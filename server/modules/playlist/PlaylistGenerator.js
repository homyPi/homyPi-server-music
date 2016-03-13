var Promise = require("bluebird");
var Music = require("../music/Music");
var PlaylistSource = require("../sources/PlaylistSource");
var MusicSource = require("../sources/MusicSource");

var PlaylistGenerator = function () {
    "use strict";
};

PlaylistGenerator.convertTo = function (playlist, musicSource, user) {
    return new Promise(function (resolve, reject) {
        var module = MusicSource.getSourceModule(musicSource);
        if (!module) {
            return reject("unknown module");
        }
        return MusicSource.getModuleApi(module, user)
            .then(function (moduleReady) {
                moduleReady.convertPlaylist(playlist)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
    });
};
PlaylistGenerator.getGeneratorInstance = function (playlistSource, user, options) {
    return new Promise(function (resolve, reject) {
        PlaylistSource.getSourceModule(playlistSource, user)
            .then(function (module) {
                Music.getMyArtists(user).then(function (myArtists) {
                    var instance = new module(myArtists, options); // eslint-disable-line
                    instance.init(user).then(function () {
                        resolve(instance);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
    });
};

PlaylistGenerator.generate = function (user, playlistSource, musicSource, options) {
    if (!options) {
        options = {};
    }
    console.log("PlaylistGenerator.generate options: " + options);
    options.nbItems = options.nbItems || 3;
    return new Promise(function (resolve, reject) {
        console.log("GETTING module " + playlistSource);
        PlaylistGenerator.getGeneratorInstance(playlistSource, user, options)
            .then(function (instance) {
                instance.generate()
                    .then(function () {
                        if (!musicSource || musicSource === playlistSource ||
                            musicSource === "default") {
                            resolve(instance.playlist);
                        } else {
                            if (musicSource === "default") {
                                musicSource = null;
                            }
                            console.log("convert it");
                            PlaylistGenerator.convertTo(instance.playlist, musicSource, user)
                                .then(convertedTracks => {
                                    resolve({
                                        playlist: convertedTracks,
                                        source: musicSource
                                    });
                                })
                                .catch(reject);
                        }
                    }).catch(reject);
            }).catch(function (err) {
                reject(err);
            });
    });
};


module.exports = PlaylistGenerator;
