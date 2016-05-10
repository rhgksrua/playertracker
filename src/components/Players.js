import React from 'react';

import Player from './Player';

class Players extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let playerList = this.props.playerList.players.map((playerObj) => {
            return (
                <Player key={playerObj.p} playerObj={playerObj} />
            );
        })
        console.log('---- playerlist', playerList);
        return (
            <div className='players-container'>
                {playerList}
            </div>
        );
    }
}

export default Players;
