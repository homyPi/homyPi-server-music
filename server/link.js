var Music = require("./modules/music/Music");


var Shared;

module.exports = {
	load: function(AppShared) {
		Shared = AppShared;
		require("./modules/player/playerSocket")(AppShared.messager);
		Shared.Raspberry.onModuleChange("music", function(raspberry, module, moduleInfo) {
			var Players = require("./modules/player/Players");
			console.log("Module change: state=" + module.state);
			if (module.state === "DOWN") {
				Players.remove(raspberry.name);
				Shared.messager.emit("client:" + raspberry.name, "modules:remove:player", {raspberry: raspberry, module: moduleInfo});
			} else if (module.state === "UP") {
				Players.new(raspberry.name, moduleInfo.status);
				console.log("emit modules:new:player");
				Shared.messager.emit("client:" + raspberry.name, "modules:new:player", {raspberry: raspberry, module: moduleInfo});
			}
		});
		Music.init(Shared);
	},
	getShared: function() {
		return Shared;
	}
}