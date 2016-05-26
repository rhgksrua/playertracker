import React from 'react';
import { connect } from 'react-redux';

import Players from './Players';

const mapStateToProps = (state) => {
    const { playerList, options } = state;
    return {
        playerList,
        options
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        test: () => {
            console.log('test from container');
            dispatch();
        }
    };
};

const PlayersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Players);

export default PlayersContainer;
