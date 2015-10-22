import React from 'react';
var Player = require("./components/Player")
module.exports = {
	config: require("./config"),
	actions: require("./actions"),
	api: require("./apis"),
	components: require("./components"),
	stores: require("./stores"),
	footer: (<Player />)
}