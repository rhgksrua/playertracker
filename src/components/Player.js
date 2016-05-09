import React from 'react';

class Player extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='player'>
                <h2>Player name</h2>
                <p>AVG 0.234</p>
                <p>2 for 4</p>
                <p>In Hole, On Deck, At Bat</p>
            </div>
        );
    }
}

export default Player;
