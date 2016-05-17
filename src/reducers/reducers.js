'use strict';

import { combineReducers } from 'redux';
import { ADD_PLAYER, REMOVE_PLAYER, INITIALIZE } from '../actions/actions';

import playerId from '../playerId';

const getStoredPlayers = () => {
    chrome.storage.sync.get('players', function(val) {
        if (val.players === 'undefined') {
        }
    });
};

const initialStatePlayerList = { gameTimeSet: false, players: []};

/**
 * playerList - Also adds playerlist to storage.sync
 * 
 * chrome.storage.sync.get is async.  The "real" initialization values are set in App.js
 * inside componentDidMount().
 *
 * @param state = initialStatePlayerList
 * @param action
 * @returns {undefined}
 */
function playerList(state = initialStatePlayerList, action) {
    switch (action.type) {
        case INITIALIZE:
            console.log('action val', action.val);
            if (!action.val) return state;
            let newState = Object.assign({}, state, {players: action.val.players});
            return newState;
        case ADD_PLAYER:
            let addState = Object.assign({}, state, {players: state.players.concat(action.player)});
            chrome.storage.sync.set({'players': addState});
            return addState;
        case REMOVE_PLAYER:
            let filteredPlayers = state.players.filter(player => {
                console.log(player.p, action.playerId);
                return player.p !== action.playerId;
            });
            let removedState = Object.assign({}, state, {players: filteredPlayers});
            chrome.storage.sync.set({'players': removedState});
            return removedState;
        default:
            return state;
    }
}

function options(state = {}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

const playerIdInitialState = playerId.search_autocomp.search_autocomplete.queryResults.row;
console.log(playerIdInitialState);

function playerIds(state = playerIdInitialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    playerList,
    options,
    playerIds
});

export default rootReducer;
