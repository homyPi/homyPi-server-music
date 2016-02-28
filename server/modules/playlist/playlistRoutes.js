module.exports = function (router) {
    var PlaylistMiddleware = require("./playlistMiddleware");
    var User = require("../../link").getShared().User;

    router.get("/playlists/generate", User.isLoggedIn, PlaylistMiddleware.generate);
    router.get("/playlists/:raspberryName", User.isLoggedIn, PlaylistMiddleware.get);
    router.get("/playlists/:raspberryName/clear", User.isLoggedIn,
        PlaylistMiddleware.clearPlaylist);
    router.get("/playlists/:raspberryName/tracks/:id", User.isLoggedIn,
        PlaylistMiddleware.getTrack);
    router.post("/playlists/:raspberryName", User.isLoggedIn, PlaylistMiddleware.add);
    router.post("/playlists/:raspberryName/set", User.isLoggedIn, PlaylistMiddleware.setPlaylist);
    router.delete("/playlists/:raspberryName/:trackId", User.isLoggedIn,
        PlaylistMiddleware.deleteTrack);

    return router;
};
