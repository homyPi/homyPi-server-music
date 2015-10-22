import React from "react";
import {Paper} from "material-ui";
import MusicSearch from './SearchMusic';


class Music extends React.Component {
    constructor (props) {
        super(props);
        console.log("music props = ", props);
    }

	render() {
		let search = "";
		
		return (
			<div>
			<Paper id="music" className="container">	
	          {
	            this.props.children || ""
	          }
			</Paper>
			</div>
		); 
	}
};
Music.defaultProps = {};
export default Music;