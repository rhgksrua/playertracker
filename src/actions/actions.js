'use strict';

import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';

export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const UPDATE = 'UPDATE';
export const INITIALIZE = 'INITIALIZE';
export const UPDATE_ON_CHANGE = 'UPDATE_ON_CHANGE';

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
 * Add a player to playerList.
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
    return dispatch => {
        return fetch(
            'http://gd2.mlb.com/components/game/mlb/year_2016/month_05/day_16/master_scoreboard.xml',
            {
                method: 'get'
            }
        )
        .then((data) => {
            console.log('-------fetch data', data);
            return data.text();
        })
        .then((data) => {
            //console.log('----- fetch json data', data);
            //const oParser = new DOMParser();
            //const oDOM = oParser.parseFromString(data, 'text/xml');
            //console.log('---- oDOM', oDOM);
            const parseString = xml2js.parseString;
            parseString(data, (err, result) => {
                console.dir(result);
            });
            return data;
        })
        .catch((err) => {
            console.warn(err)
        });
    }
};

export const updateOnChanged = (obj) => {
    return {
        type: UPDATE_ON_CHANGE,
        players: obj
    };
}

export const updateStore = () => {
    return {
        type: UPDATE
    };
}

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
    }
}

export const initializing = () => {
    return (dispatch, getState) => {
        chrome.storage.sync.get('players', function(val) {
            console.log('val players', val.players);
            console.log('val ', val);
            dispatch(initialize(val.players));
        });
    }
}
