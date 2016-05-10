'use strict';

import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';

export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const UPDATE = 'UPDATE';

/**
 * updates game time if needed
 *
 * @returns {undefined}
 */
export const updateGameTimeIfNeeded = () => {
    return (dispatch, getState) => {
        if (shouldUpdateGameTime(getState())) {
            return dispatch(getNewGameTime);
        }
    };
};

/**
 * Checks game time has been set
 *
 * @returns {undefined}
 */
const shouldUpdateGameTime = (state) => {
    if (state.playerList.gameTimeSet) {
        return true;
    }
    return false;
};

/**
 * Add a player to playerList
 *
 * @returns {undefined}
 */
export const addPlayer = (player) => {
    return {
        type: ADD_PLAYER,
        player
    };
};

/**
 * Remove a player from playerList
 *
 * @returns {undefined}
 */
export const removePlayer = (playerId) => {
    return {
        type: REMOVE_PLAYER,
        playerId
    };
};

/**
 * update - Handles updating of player status.
 *
 * @returns {undefined}
 */
export const update = () => {
    return {
        type: UPDATE
    };
};
