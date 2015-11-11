import React from 'react';
import { Router, Route, DefaultRoute} from 'react-router';
import {MenuItem} from "material-ui";


import MusicSearch from './components/SearchMusic';
import Music from './components/Music';
import ArtistDetails from "./components/ArtistDetails";
import MyArtists from "./components/MyArtists";

import Settings from "./components/Settings";

export default 
module.exports = {
	name: "Music",
	routes: (
	    <Route path="music" component={Music}>
            <Route name="searchMusic" path="search(/:search)" component={MusicSearch} />
            <Route name="my-artists" path="artists/me" component={MyArtists} />
            <Route name="artists" path="artists/:artistId" component={ArtistDetails} />
            <Route name="music-settings" path="settings" component={Settings} />
        </Route>
	),
	menu: [
		{ route: '/app/music/search', text: 'Search Music' },
		{ route: "/app/music/artists/me", text: "my artists"}
	],
	settingsRoute: { route: '/app/music/settings', text: 'Music Settings' }
};