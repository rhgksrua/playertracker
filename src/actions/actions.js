'use strict';

import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';

export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const UPDATE = 'UPDATE';
export const INITIALIZE = 'INITIALIZE';
export const UPDATE_ON_CHANGE = 'UPDATE_ON_CHANGE';
export const TOGGLE_AT_BAT = 'TOGGLE_AT_BAT';
export const TOGGLE_ON_DECK = 'TOGGLE_ON_DECK';
export const TOGGLE_IN_HOLE = 'TOGGLE_IN_HOLE';
export const TOGGLE_INTERACTION = 'TOGGLE_INTERACTION';
export const TOGGLE_NOTIFY = 'TOGGLE_NOTIFY';

/**
 * Add a player to playerList.
 *
 * @returns {undefined}
 */
export const addPlayer = (player) => {
    player.toggleAtBat = true;
    player.toggleOnDeck = true;
    player.toggleInHole = false;
    player.toggleInteraction = false;
    player.toggleNotify = true;
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

export const updateOnChanged = (obj) => {
    return {
        type: UPDATE_ON_CHANGE,
        players: obj
    };
};

/**
 * Initializes store from chrome.storage.sync.
 * chrome.storage.sync.get is async.  Need to listen for callback when the App.js mounts.
 *
 * @returns {undefined}
 */
export const initialize = (val) => {
    return {
        type: INITIALIZE,
        val
    };
};

export const initializing = () => {
    return (dispatch, getState) => {
        chrome.storage.sync.get('players', function(val) {
            dispatch(initialize(val.players));
        });
    };
};

export const toggleAtBatById = id => {
    return {
        type: TOGGLE_AT_BAT,
        id
    };
};

export const toggleOnDeckById = id => {
    return {
        type: TOGGLE_ON_DECK,
        id
    };
};

export const toggleInHoleById = id => {
    return {
        type: TOGGLE_IN_HOLE,
        id
    };
};

export const toggleInteraction = id => {
    return {
        type: TOGGLE_INTERACTION,
        id
    };
};

export const toggleNotify = id => {
    return {
        type: TOGGLE_NOTIFY,
        id
    };
};