import React from 'react';
import {AppCanvas, RaisedButton, DropDownMenu} from 'material-ui';
import PlaylistStore from '../stores/PlaylistStore';
import MusicStore from '../stores/MusicStore';
import PlaylistActionCreators from '../actions/PlaylistActionCreators';
import MusicActionCreators from '../actions/MusicActionCreators';

import PlayerActionCreators from '../actions/PlayerActionCreators';
import PlayerStore from '../stores/PlayerStore';

import PlayerActions from './PlayerActions';
import Playlist from './Playlist';
import PlayerProgress from './PlayerProgress';
import Volume from './Volume';

var Io = window.io;

export default React.createClass({
	getProgressInterval: null,
	autoUpdateProgress: null,
	_onPlaylistChange() {
		this.setState({
			playing: PlaylistStore.getAll().playing,
			tracks: PlaylistStore.getAll().tracks,
			progress: PlaylistStore.getAll().progress
		});
		this.setGetTrackProgressInterval();
	},
	_onMusicChange() {
		let {player} = this.state;
		if (!player) return;
		var sources = MusicStore.getAll().sources;
		var musicSource, playlistSource;
		if(sources.music.length) {
			musicSource = sources.music[0];
		}
		if(sources.playlist.length) {
			playlistSource = sources.playlist[0];
		}
		this.setState({
			sources: sources,
			musicSource: musicSource,
			playlistSource: playlistSource,
			volume: MusicStore.getAll().volume
		});
		
	},
	getPlaylist() {
		console.log("player get playlist");
		let {player} = this.state;
		if (!player) return;
	   	PlaylistActionCreators.loadPlaylist(player);

	},
	getInitialState() {
	   	MusicActionCreators.getSources();
	   	var pl = PlayerStore.getAll().selected;
	   	if (pl) {
	   		getPlaylist();
		}
	    return {
	     	player: pl,
	      	playing: PlaylistStore.getAll().playing,
	      	tracks: PlaylistStore.getAll().tracks,
	      	progress: PlaylistStore.getAll().progress,
	      	sources: MusicStore.getAll().sources,
	      	extended: false,
	      	volume: MusicStore.getAll().volume
	    };
	},
	_onPlayerChange() {
		var player = PlayerStore.getAll().selected;
	    this.setState({
	      	player : player,
			tracks: PlaylistStore.getAll().tracks
	    });
	    this.setGetTrackProgressInterval();
	    this.getPlaylist();
	},
	componentDidMount() {
		PlayerStore.addChangeListener(() => {this._onPlayerChange()});
	    PlaylistStore.addChangeListener(this._onPlaylistChange);
	    MusicStore.addChangeListener(this._onMusicChange);
	    
	   	PlayerActionCreators.getAll();

		this.setGetTrackProgressInterval();
	},
	componentWillUnmount() {
	    PlaylistStore.removeChangeListener(this._onPlaylistChange);
	    if (this.getProgressInterval) {
			clearInterval(this.getProgressInterval);				
			this.getProgressInterval = null;
		}
		if (this.autoUpdateProgress) {
			clearInterval(this.autoUpdateProgress)
			this.autoUpdateProgress = null;
		}
	},
	render() {
		let {
			player,
			playing,
			tracks,
			progress,
			sources
		} = this.state;
		let playerClassName  = "player";
		if(this.state.extended) {
			playerClassName += " extended";
		}
		let musicSourceMenu = sources.music.map(function(name) {
			return { payload: name, text: name }
		});
		let playlistSourceMenu = sources.playlist.map(function(name) {
			return { payload: name, text: name }
		});
		if (player)
		console.log("referesh player view (status = " + player.status+ ")");
		return (
			<div className={playerClassName} style={(player)? {display:"block"}:{display:"none"}}>
				<div className="player-body">
					<div className="player-header">
						{(player)? <PlayerActions player={player}/>:<div></div>}
						{(playing)? 
							<div className="playing-track">
								<div className="track-info">
									<img className="cover" src={playing.album.images[0].url}  onClick={this._extend}/>
									<div className="info">
										<span className="track-name">{playing.name}</span>
										<span className="artist">{playing.artists.map(function(artist) { return (artist.name + "; ")})}</span>
									</div>
								</div>
								<div className="track-progress">
									<PlayerProgress value={progress.progressMs} min={0}  max={playing.durationMs} onSeekTrack={(value, event) => {this._seek(value, event)}}/>
									<span className="time">{progress.minutes}:{progress.seconds}/{playing.durationStr}</span>
								</div>
								
								
						</div>: null}
						<div className="volume-container">
							<Volume value={this.state.volume} setVolume={(value, event) => {this._volume(value, event)} }/>
						</div>
					</div>
	        		<Playlist playing={playing} tracks={tracks} play={this._playTrack} removeTrack={(track) => {this._removeTrack(track)}}/>
					<h3>Music source</h3>
					<DropDownMenu menuItems={musicSourceMenu} onChange={this._setMusicSource} />
					<h3>Playlist source</h3>
					<DropDownMenu menuItems={playlistSourceMenu} onChange={this._setPlaylistSource} />
	        		<br />
	        		<RaisedButton label="Generate a random playlist" onClick={(event) => {this._generateRandomPlaylist(event)}}/>
        		</div>
			</div>
		);
	},
	setGetTrackProgressInterval() {
		if (this.state.player && this.state.player.status === "PLAYING") {
			if (!this.getProgressInterval) {
				Io.socket.emit("playlist:track:progress:get");
				this.getProgressInterval = setInterval(function(){
					Io.socket.emit("playlist:track:progress:get");
				}, 5000);
			}
			if (!this.autoUpdateProgress) {
				this.autoUpdateProgress = setInterval(function() {
					var ms = this.state.progress.progressMs + 1000;
					PlaylistActionCreators.updateProgress(ms);
				}.bind(this), 1000)
			}
		} else {
			if (this.getProgressInterval) {
				clearInterval(this.getProgressInterval);
				this.getProgressInterval = null;
			}
			if (this.autoUpdateProgress) {
				clearInterval(this.autoUpdateProgress)
				this.autoUpdateProgress = null;
			}
		}
	},
	_seek(value, event) {
		event.preventDefault();
		event.stopPropagation();
		let {player} = this.state;
		Io.socket.emit("player:seek", {player: {name: player.name}, progress_ms: value});
		PlaylistActionCreators.updateProgress(value);
	},
	_volume(value, event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({volume: value});
		let {player} = this.state;
		Io.socket.emit("player:volume", {player: {name: player.name}, volume: value});
		MusicActionCreators.updateVolume(value);
	},
	_playTrack(track) {

	},
	_generateRandomPlaylist(event) {
		event.preventDefault();
		event.stopPropagation();
		let {player} = this.state;
		Io.socket.emit("player:play:generated", {
				player: {name: player.name},
				generator: this.state.playlistSource,
				musicSource: this.state.musicSource,
				options: {nbItems: 5}
		})
	},
	_removeTrack(track) {
		let {player} = this.state;
		Io.socket.emit("player:playlist:remove", {player: {name: player.name}, _id: track._id});
	},
	_setMusicSource(event, selectedIndex, menuItem) {
		this.setState({musicSource: menuItem.payload});
	},
	_setPlaylistSource(event, selectedIndex, menuItem) {
		this.setState({playlistSource: menuItem.payload});
	},
	_extend() {
		this.setState({
			extended: !this.state.extended
		})
	}
})