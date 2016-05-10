import React from 'react';
import { connect } from 'react-redux';

import Players from './Players';

const mapStateToProps = (state, ownProps) => {
    const { playerList, options, playerIds } = state;
    return {
        playerList,
        options
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        test: () => {
            console.log('test from container');
        }
    };
}

const PlayersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Players);

export default PlayersContainer;
