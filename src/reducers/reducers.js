'use strict';

import { combineReducers } from 'redux';
import { UPDATE_ON_CHANGE,
         ADD_PLAYER,
         REMOVE_PLAYER,
         INITIALIZE,
         TOGGLE_AT_BAT,
         TOGGLE_ON_DECK,
         TOGGLE_IN_HOLE
        } from '../actions/actions';

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
export function playerList(state = initialStatePlayerList, action) {
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
                return player.p !== action.playerId;
            });
            let removedState = Object.assign({}, state, {players: filteredPlayers});
            chrome.storage.sync.set({'players': removedState});
            return removedState;

        case UPDATE_ON_CHANGE:
            let updatedState = Object.assign({}, state, {players: action.players});
            return updatedState;

        case TOGGLE_AT_BAT:
            let togglePlayers = state.players.map(player => {
                if (action.id === player.p) {
                    player.toggleAtBat = player.toggleAtBat ? false : true;
                }
                return player;
            });
            let toggleState = Object.assign({}, state, {players: togglePlayers});
            chrome.storage.sync.set({'players': toggleState});
            return toggleState;

        case TOGGLE_ON_DECK:
            togglePlayers = state.players.map(player => {
                if (action.id === player.p) {
                    player.toggleOnDeck = player.toggleOnDeck ? false : true;
                }
                return player;
            });
            toggleState = Object.assign({}, state, {players: togglePlayers});
            chrome.storage.sync.set({'players': toggleState});
            return toggleState;

        case TOGGLE_IN_HOLE:
            togglePlayers = state.players.map(player => {
                if (action.id === player.p) {
                    player.toggleInHole = player.toggleInHole ? false : true;
                }
                return player;
            });
            toggleState = Object.assign({}, state, {players: togglePlayers});
            chrome.storage.sync.set({'players': toggleState});
            return toggleState;

        default:
            return state;
    }
}

export function options(state = {}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

const playerIdInitialState = playerId.search_autocomp.search_autocomplete.queryResults.row;

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
