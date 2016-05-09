'use strict';

export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';

export const addPlayer = (playerId) => {
    return {
        type: ADD_PLAYER,
        playerId
    };
};

export const removePlayer = (playerId) => {
    return {
        type: REMOVE_PLAYER,
        playerId
    };
};

