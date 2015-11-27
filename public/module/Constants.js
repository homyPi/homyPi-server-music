import keyMirror from 'fbjs/lib/keyMirror';

export default {
  // event name triggered from store, listened to by views
  CHANGE_EVENT: 'change',

  // Each time you add an action, add it here... They should be past-tense
  ActionTypes: keyMirror({
    SET_ARTIST: null,
    SET_MY_ARTISTS: null
  }),
  MusicSearchActionTypes: keyMirror({
    SET_RESULTS: null
  }),
  MusicActionTypes: keyMirror({
    SET_SOURCES: null,
    SET_VOLUME: null,
    SET_FAVORITE_MUSIC_SOURCES: null,
    SET_FAVORITE_PLAYLIST_SOURCES: null
  }),
  PlaylistActionTypes: keyMirror({
    SET_PLAYLIST: null,
    ADD_TRACK: null,
    ADD_TRACKSET: null,
    REMOVE_TRACK: null,
    UPDATE_PLAYING_ID: null,
    UPDATE_PROGRESS: null
  }),
  UserActionTypes: keyMirror({
    LOGIN_SUCCESS: null
  }),
  PlayerActionTypes: keyMirror({
    SET_LIST: null,
    SET_PLAYER: null,
    REMOVE_PLAYER: null,
    UPDATE_STATUS: null,
    SET_SELECTED: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })
};
