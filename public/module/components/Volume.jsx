import React from 'react';
import $ from 'jquery';

let { PropTypes, Component } = React;

class Volume extends Component {
    constructor (props) {
        super(props);
        this.percentage = 100;
        this.state = {showBar: false};
       
    }
    handleSetVolume(e) {
        e.stopPropagation();
        let { setVolume } = this.props;
        const yPos = -1 * ((e.pageY - e.currentTarget.getBoundingClientRect().bottom) / e.currentTarget.offsetHeight);
        
        let value = Math.round(yPos * this.props.max);
        setVolume && setVolume.call(this, value, e);
    }
    componentDidMount() {
         $("body").click((e) => {
            if(e.target.className != "volume-bar-container"
                && e.target.className != "volume-bar") {
                this.setState({showBar: false});
            }
        });
    }

    render() {
        let { value, min, max } = this.props;

        if (value < min ) {
            value = min;
        }

        if (value > max) {
            value = max;
        }
        this.percentage = (value*100) / max;
        let containerStyle = {
            "visibility": (this.state.showBar)? "visible": "hidden",
            "zIndex": 99999,
            "position": "absolute",
            "height": "160px",
            "width": "20px",
            "bottom": "60px",
            "backgroundColor": "#667278"
        };
        let bar = {
            "position": "absolute",
            "backgroundColor": "#FC561E",
            "height": this.percentage + "%",
            "bottom": 0,    
            "marginLeft": "20%",
            "width": "60%"
        }

        return (
            <div>
                <p onClick={()=> {this.setState({showBar: !this.state.showBar})}}>hello</p>
                <div className="volume-bar-container" style={containerStyle} onClick={(e)=>{this.handleSetVolume(e)}}>
                    <div className="volume-bar" style={bar}></div>
                </div>
            </div>
        );
    }
}


Volume.defaultProps = {
    value: 0,
    min:0,
    max: 100
};

export default Volume;