import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let sources = {music: [], playlist: []};


function setSources(music, playlist) {
  sources = {music: music, playlist: playlist};
}
// Facebook style store creation.
const MusicStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      sources: sources
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.MusicActionTypes.SET_SOURCES:
      try {
        let {music, playlist} = action.results;
        setSources(music, playlist);
        MusicStore.emitChange();
      } catch(e) {
        console.log(e);
        console.log(e.stack);
      }
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default MusicStore;
