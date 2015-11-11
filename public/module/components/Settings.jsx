import React from "react";
import {RaisedButton, DropDownMenu} from "material-ui";

import MusicStore from '../stores/MusicStore';
import MusicActionCreators from '../actions/MusicActionCreators';


class Settings extends React.Component {
    constructor (props) {
        super(props);
        MusicActionCreators.getSources();
	    this.state = {
	      sources: MusicStore.getAll().sources
	    };
    }

	_onMusicChange() {
		var {sources, favSources} = MusicStore.getAll();
		var musicSource = favSources.music
		var playlistSource = favSources.playlist;

		this.setState({
			sources: sources,
			musicSource: musicSource,
			playlistSource: playlistSource
		});
		
	}
	componentDidMount() {
	    MusicStore.addChangeListener(()=>{this._onMusicChange()});
	}

	render() {		
		let {sources, musicSource, playlistSource} = this.state;
		let musicSourceMenu = sources.music.map(function(name) {
			return { payload: name, text: name }
		});
		var  favMusicSourceIndex = 0;
		if (musicSource) {
			favMusicSourceIndex = sources.music.indexOf(musicSource);
			favMusicSourceIndex = (favMusicSourceIndex !== -1)? favMusicSourceIndex : 0;
		}
		let playlistSourceMenu = sources.playlist.map(function(name) {
			return { payload: name, text: name }
		});
		var  favPlaylistSourceIndex = 0;
		if (playlistSource) {
			favPlaylistSourceIndex = sources.playlist.indexOf(playlistSource);
			favPlaylistSourceIndex = (favPlaylistSourceIndex !== -1)? favPlaylistSourceIndex : 0;
		}
		return (
			<div>
				<h1>Music settings</h1>
				<h3>Favorite music source</h3>
				<DropDownMenu menuItems={musicSourceMenu} selectedIndex={favMusicSourceIndex} onChange={(event, selectedIndex, menuItem) => {this._setFavoriteMusicSource(event, selectedIndex, menuItem)} } />
				<h3>Favorite playlist source</h3>
				<DropDownMenu menuItems={playlistSourceMenu} selectedIndex={favPlaylistSourceIndex} onChange={(event, selectedIndex, menuItem) => {this._setFavoritePlaylistSource(event, selectedIndex, menuItem)} } />
	        	<br />
			</div>
		); 
	}

	_setFavoriteMusicSource(event, selectedIndex, menuItem) {
		this.setState({musicSource: menuItem.payload});
	}
	_setFavoritePlaylistSource(event, selectedIndex, menuItem) {
		this.setState({playlistSource: menuItem.payload});
		MusicActionCreators.updateFavoritePlaylistSource(menuItem.payload);
	}
};
Settings.defaultProps = {};
export default Settings;