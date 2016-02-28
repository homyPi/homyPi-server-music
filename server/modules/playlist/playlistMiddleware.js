var Playlist = require("./Playlist");
var PlaylistGenerator = require("./PlaylistGenerator");
var mongoose = require("mongoose");

/**
 * Get current trackset
 */
var get = function (req, res) {
    console.log("get playlist");
    Playlist.get({name: req.params.raspberryName})
        .then(function (playlist) {
            res.json({playlist: {
                tracks: playlist.tracks,
                idPlaying: playlist.idPlaying
            }});
        }).catch(function (err) {
            res.json({err: err});
        });
};

/**
 * Delete a track from current trackset
 * @param {ObjectId} req.params.trackId Id of the track to delete
 */
var deleteTrack = function (req, res) {
    Playlist.deleteTrack({raspberry: {
        name: req.params.raspberryName
    }}, req.params.trackId).then(function () {
        res.json({status: "success"});
    }).catch(function (err) {
        res.json({err: err});
    });
};


var add = function (req, res) {
    var data = req.body;
    console.log("MIDDLEWARE_ADD_PLAYLIST: get playlist for " + req.params.raspberryName);
    Playlist.get({name: req.params.raspberryName}).then(function (playlist) {
        console.log("MIDDLEWARE_ADD_PLAYLIST: got playlist");
        if (data.track) {
            console.log("MIDDLEWARE_ADD_PLAYLIST: add track");
            Playlist.addTrack(req.user, data.track)
                .then(function (track) {
                    res.json({track: track});
                }).catch(function (err) {
                    console.log("===========");
                    console.log(err);
                    console.log("===========");
                    res.json({err: err});
                });
        } else if (data.trackset) {
            console.log("MIDDLEWARE_ADD_PLAYLIST: add trackset");
            Playlist.addTrackset(req.user, data.trackset, playlist)
                .then(function (updatedPlaylist) {
                    updatedPlaylist.tracks.map(item => {
                        item._id = mongoose.Types.ObjectId();
                    });
                    res.json({trackset: updatedPlaylist.tracks});
                }).catch(function (err) {
                    console.log(err);
                    res.json({err: err});
                });
        } else {
            res.json({err: "invalid request"});
        }
    }).catch(function (error) {
        console.log(error);
        res.json({status: "error", error});
    });
};

var setPlaylist = function (req, res) {
    var data = req.body;
    console.log("MIDDLEWARE_SET_PLAYLIST: get playlist for " + req.params.raspberryName);
    Playlist.get({name: req.params.raspberryName}).then(function (playlist) {
        console.log("MIDDLEWARE_SET_PLAYLIST: set playlist... ");
        Playlist.setPlaylist(req.user, playlist, data)
            .then(function (updatedPlaylist) {
                res.json({
                    status: "success",
                    playlist: updatedPlaylist
                });
            }).catch(function (error) {
                console.log(error);
                res.json({status: "error", error});
            });
    }).catch(function (error) {
        console.log(error);
        res.json({status: "error", error});
    });
};

var getTrack = function (req, res) {
    if (!req.params.raspberryName || !req.params.id) {
        return res.json({status: "error", error: "invalid request"});
    }
    return Playlist.getTrack(req.params.raspberryName, req.params.id)
        .then(track => {
            return res.json({status: "success", track});
        })
        .catch(error => {
            return res.json({status: "error", error});
        });
};

/**
 * Remove al tracks from trackset
 */
var clearPlaylist = function (req, res) {
    Playlist.clearPlaylist({name: req.params.raspberryName}).then(function () {
        console.log("CLEAR_PLAYLIST: done");
        res.json({status: "success"});
    }).catch(function (error) {
        console.log("===========");
        console.log(error);
        res.json({status: "error", error});
    });
};

var generate = function (req, res) {
    console.log("middleware playlist generate");
    PlaylistGenerator.generate(req.user, req.query.generator, req.query.musicSource, req.query)
        .then(function (playlist) {
            res.json({status: "success", data: playlist});
        }).catch(function (error) {
            console.log(error);
            res.json({status: "error", error});
        });
};


module.exports = {
    get,
    setPlaylist,
    getTrack,
    deleteTrack,
    add,
    clearPlaylist,
    generate
};
