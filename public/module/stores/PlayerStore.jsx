import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

var players = [];
var selected = null;
var selectedName = null;

function setPlayers(list) {
  players = list;
  setSelected(selectedName);
}

function addPlayer(name, module) {
  var p = getPlayer(name);
  if (p) {
    p.status = module.status;
    p.progress = module.progress;
  } else {
    players.push({name: name, status: module.status, progress: module.progress});
  }
  setSelected(selectedName);
}
function removePlayer(name, module) {
  var i = getPlayerIndex(name);
  if (i > -1) {
      players.splice(i, 1);
  }
  setSelected(selectedName);
}
function removePlayer(name) {
  for(var i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      players.splice(i, 1);
    }
  }
  setSelected(selectedName);
}
function updateStatus(name, status) {
  var p = getPlayer(name);
  if (p) {
    p.status = status;
  }
}
function getPlayer (name) {
  for(var i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      return players[i];
    }
  }
  return null;
}
function getPlayerIndex (name) {
  for(var i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      return i;
    }
  }
  return -1;
}
function setSelected (name) {
  selectedName = name;
  if (!players.length) {
    selected = null;
  } else {
    if (!selectedName) {
      selected = players[0];
    } else {
      selected = getPlayer(selectedName);
    }
  }
}
function setVolume(name, volume) {
  console.log("set volume for " + name + " to " + volume);
  var player = getPlayer(name);
  console.log("for player ", player);
  if (player) {
    player.volume = volume;
  }
}

// data storage
// Facebook style store creation.
const PlayerStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    if (players.length && !selected)
      setSelected();
    return {
      players: players,
      selected: selected
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.PlayerActionTypes.SET_LIST:
        setPlayers(action.players);
        PlayerStore.emitChange();
        break;
      case Constants.PlayerActionTypes.SET_SELECTED:
        setSelected(action.name);
        PlayerStore.emitChange();
        break;
      case Constants.PlayerActionTypes.SET_PLAYER:
        addPlayer(action.name, action.module);
        PlayerStore.emitChange();
        break;
      case Constants.PlayerActionTypes.REMOVE_PLAYER:
        removePlayer(action.name, action.module);
        PlayerStore.emitChange();
        break;
      case Constants.PlayerActionTypes.UPDATE_STATUS:
        let nameUpdated = action.name;
        let status = action.status;
        updateStatus(nameUpdated, status);
        PlayerStore.emitChange();
        break;
      case Constants.PlayerActionTypes.SET_VOLUME:
        setVolume(action.name, action.volume);
        PlayerStore.emitChange();
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default PlayerStore;
