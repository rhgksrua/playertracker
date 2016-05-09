import React from 'react';

import Player from './Player';

class Players extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='players-container'>
                <Player />
            </div>
        );
    }
}

export default Players;
