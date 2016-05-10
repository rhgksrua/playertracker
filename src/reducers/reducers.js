'use strict';

import { combineReducers } from 'redux';
import { ADD_PLAYER, REMOVE_PLAYER } from '../actions/actions';

import playerId from '../playerId';

const initialStatePlayerList = [];

function playerList(state = initialStatePlayerList, action) {
    switch (action.type) {
        case ADD_PLAYER:
            return state.concat(action.player);
        case REMOVE_PLAYER:
            return state;
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
