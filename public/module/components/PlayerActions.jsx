import React, {PropTypes} from 'react';
import {AppCanvas, FontIcon, RaisedButton, DropDownMenu} from 'material-ui';



var Io = window.io;

export default React.createClass({
	resume(event) {
		let {player} = this.props;
		console.log("resume to ", player);
		event.preventDefault();
		event.stopPropagation();

		Io.socket.emit("player:resume", {name: player.name});
	},
	pause(event) {
		let {player} = this.props;
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:pause", {name: player.name});
	},
	previous(event) {
		let {player} = this.props;
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:previous", {name: player.name});
	},
	next(event) {
		let {player} = this.props;
		event.preventDefault();
		event.stopPropagation();
		Io.socket.emit("player:next", {name: player.name});
	},
	render() {
		let {player} = this.props;
		let statusAction = null;

		console.log("IN PLAYER ACTION:", player)
		if (player) {
			if (player.status === "PLAYING") {
				statusAction = (<i onClick={this.pause} className="material-icons pause-icon">pause_arrow</i>)
			} else if (player.status === "PAUSED") {
				statusAction = (<i onClick={this.resume} className="material-icons play-icon">play_arrow</i>)
			}
		}
		return (
			<div className="player-actions">
				<i onClick={this.previous} className="material-icons previous-icon">skip_previous</i>
				{statusAction}
				<i onClick={this.next} className="material-icons next-icon">skip_next</i>
			</div>
		);
	}
})