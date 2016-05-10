import React from 'react';

class Player extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='player'>
                <h3>{this.props.playerObj.n}</h3>
                <p>{this.props.playerObj.p}</p>
                <p>{this.props.playerObj.t}</p>
            </div>
        );
    }
}

export default Player;
