import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import MusicAPI from '../apis/MusicAPI';

export default {
	getSources() {
		MusicAPI.getSources()
			.then(function(results) {
				Dispatcher.handleViewAction({
			        type: Constants.MusicActionTypes.SET_SOURCES,
			      	results: results
			    });
			})
			.catch(function(err) {
				
			});
	},
	updateVolume(volume) {
		Dispatcher.handleViewAction({
		    type: Constants.MusicActionTypes.SET_VOLUME,
		   	volume: volume
		});
	},
	updateFavoritePlaylistSource(source) {
		MusicAPI.updateFavoritePlaylistSource(source)
			.then(function(results) {
				Dispatcher.handleViewAction({
			        type: Constants.MusicActionTypes.SET_FAVORITE_PLAYLIST_SOURCES,
			      	newFavPlaylistSource: source
			    });
			})
			.catch(function(err) {
				
			});
	}
}