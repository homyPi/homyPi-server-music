import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let sources = {music: [], playlist: []};
let favSources = {};


function setSources(music, playlist, favMusicSource, favPlaylistSource) {
  sources = {music: music, playlist: playlist};
  if(!favMusicSource) {
    if(sources.music.length) {
      favSources.music = sources.music[0];
    }
  } else {
    favSources.music = favMusicSource;
  }
  if(!favPlaylistSource) {
    if(sources.playlist.length) {
      favSources.playlist = sources.playlist[0];
    }
  } else {
    favSources.playlist = favPlaylistSource;
  }
}

function setFavMusicSources(favMusicSource) {
  if(!favMusicSource) {
    if(sources.music.length) {
      favSources.music = sources.music[0];
    }
  } else {
    favSources.music = favMusicSource;
  }
}
function setFavPlaylistSources(favPlaylistSource) {
  if(!favPlaylistSource) {
    if(sources.playlist.length) {
      favSources.playlist = sources.playlist[0];
    }
  } else {
    favSources.playlist = favPlaylistSource;
  }
}
// Facebook style store creation.
const MusicStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      sources: sources,
      favSources: favSources
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.MusicActionTypes.SET_SOURCES:
        try {
          let {sources, favorites} = action.results;
          setSources(sources.music, sources.playlist, favorites.music, favorites.playlist);
          MusicStore.emitChange();
        } catch(e) {
          console.log(e);
          console.log(e.stack);
        }
        break;
      case Constants.MusicActionTypes.SET_FAVORITE_MUSIC_SOURCES:
        try {
          let {newFavMusicSource} = action;
          setFavMusicSources(newFavMusicSource);
          MusicStore.emitChange();
        } catch(e) {
          console.log(e);
          console.log(e.stack);
        }
        break;
      case Constants.MusicActionTypes.SET_FAVORITE_PLAYLIST_SOURCES:
        try {
          let {newFavPlaylistSource} = action;
          setFavPlaylistSources(newFavPlaylistSource);
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
