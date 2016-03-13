var playlistRoutes = require("./modules/playlist/playlistRoutes");
var musicRoutes = require("./modules/music/routes");
var playerRoutes = require("./modules/player/routes");


module.exports = {
    routes: function (app, router) {
        router.get("/", function (req, res) {
            res.json({name: "music", status: "up"});
        });
        musicRoutes(router);
        playlistRoutes(router);
        playerRoutes(router);
        return router;
    },
    shared: require("./shared"),
    config: require("./config"),
    link: require("./link")
};
