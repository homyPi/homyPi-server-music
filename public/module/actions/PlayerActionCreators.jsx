import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import PlayerAPI from '../apis/PlayerAPI';

export default {
	getAll() {
		PlayerAPI.getAll()
			.then(function(list){
				Dispatcher.handleViewAction({
					type: Constants.PlayerActionTypes.SET_LIST,
					players: list
      			});
			});
	},
	setSelected(raspberryName) {
		Dispatcher.handleViewAction({
			type: Constants.PlayerActionTypes.SET_SELECTED,
			name: raspberryName
      	});
	},
	addPlayer(name, module) {
		Dispatcher.handleViewAction({
			type: Constants.PlayerActionTypes.SET_PLAYER,
			name: name,
			module: module
      	});
	},
	removePlayer(name) {
		Dispatcher.handleViewAction({
			type: Constants.PlayerActionTypes.REMOVE_PLAYER,
			name: name
      	});
	},
	updateState(name, status) {
		Dispatcher.handleViewAction({
			type: Constants.PlayerActionTypes.UPDATE_STATUS,
			name: name,
			status: status
      	});
	},
	setVolume(name, volume) {
		Dispatcher.handleViewAction({
			type: Constants.PlayerActionTypes.SET_VOLUME,
			name: name,
			volume: volume
      	});
	}
}