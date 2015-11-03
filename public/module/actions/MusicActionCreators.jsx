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
	}
}