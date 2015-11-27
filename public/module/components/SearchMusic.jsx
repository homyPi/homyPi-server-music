import React, {PropTypes} from 'react';
import {TextField, FlatButton, Tabs, Tab} from 'material-ui';


import MusicSearchStore from '../stores/MusicSearchStore';
import MusicSearchActions from '../actions/MusicSearchActionCreators';

import PlayerStore from '../stores/PlayerStore';
import PlayerActions from '../actions/PlayerActionCreators';
import Track from "./Track";
import AlbumItem from "./AlbumItem";
import ArtistItem from "./ArtistItem";
var Io = window.io;
import {History} from "react-router"

export default React.createClass({
	mixins: [ History ],
	_onChange() {
	    this.setState({
	      tracks: MusicSearchStore.getAll().tracks,
	      albums: MusicSearchStore.getAll().albums,
	      artists: MusicSearchStore.getAll().artists
	    });
    },
    _onPlayerChange() {
    	this.setState({player: PlayerStore.getAll().selected});
    },
	  getInitialState() {
	  	let search = "";
	  	if (this.props.params && this.props.params.search) {
			search = this.props.params.search;
		}
	    return {
	      player: PlayerStore.getAll().selected,
	      tracks: MusicSearchStore.getAll().tracks,
	      albums: MusicSearchStore.getAll().albums,
	      artists: MusicSearchStore.getAll().artists,
	      search: search,
	      searchType: "track"
	    };
	  },
  	componentDidMount() {
	  	MusicSearchStore.addChangeListener(this._onChange);
	  	PlayerStore.addChangeListener(this._onPlayerChange);
    	if (this.state.search != "") {
	    	this._handleSearch();
	    }
  	},
  	componentWillUnmount() {
    	MusicSearchStore.removeChangeListener(this._onChange);
	  	PlayerStore.removeChangeListener(this._onPlayerChange);
  	},

	render() {
		let {tracks, albums, artists} = this.state;
		console.log("IN SEARCH MUSIC, player = ", this.state.player);
		return (
			<div id="search">
				<form className="search-form">
					<TextField
						className="search-input"
		  				value={this.state.search}
		  				onChange={this._handleSearchChange}/>
		  			<FlatButton 
						className="search-button"
						label="Search" onClick={this._handleSearch}/>
				</form>
				<Tabs>
			
					<Tab label="Tracks"
						onActive={this._setSeachType.bind(this, "track")}>
			  			
			  			{(tracks.items)?
				  			tracks.items.map(result =>
					          <Track key={result._id} track={result} playTrack={(track) => {this._playTrack(track)}} addTrack={this._addTrackInPlaylist}/>
				            ): null
				        }
					</Tab>

  					<Tab label="Albums" 
  						onActive={this._setSeachType.bind(this, "album")}>
						<div className="album-list">
				  			{(albums.items)?
					  			albums.items.map(result =>
						          <AlbumItem key={result.id} album={result} playAlbum={this._playAlbum}/>
					            ): null
					        }
				        </div>
					</Tab>
  					<Tab label="Artists" 
  						onActive={this._setSeachType.bind(this, "artists")}>
						<div className="artist-list">
				  			{(artists.items)?
					  			artists.items.map(result =>
						          <ArtistItem key={result.id} artist={result} playAlbum={this._playAlbum}/>
					            ): null
					        }
				        </div>
					</Tab>

			
				</Tabs>
			</div>
		);
	},
	_setSeachType(type) {
		let {player} = this.state;
		if(!player) return;
		this.setState({searchType: type});
	},
	_playAlbum (album) {
		let {player} = this.state;
		if(!player) return;
		Io.socket.emit("player:play:album", {player: {name: player.name}, id: album.id}); 
	},
	_playTrack(track) {
		let {player} = this.state;
		if(!player) return;
		Io.socket.emit("player:play:track", {player: {name: player.name}, "track": {"source": "spotify", "uri": track.uri}});
	},
	_addTrackInPlaylist(track) {
		Io.socket.emit("player:playlist:add", {player: {name: player.name}, "track": {"uri": track.uri, "source": "spotify"}});
	},
	_handleSearchChange(event) {
		this.setState({search: event.target.value});
	},
	_handleSearch() {
		let search =this.state.search;
		this.history.pushState(null, "/app/music/search/" + search);
		MusicSearchActions.search(this.state.search);
	}
});
