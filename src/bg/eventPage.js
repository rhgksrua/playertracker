import moment from 'moment';
import xml2js from 'xml2js';
import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import { zerofill } from '../lib/utils';

//const SCORE_BOARD_JSON_URL = getTodayScoreBoardUrl();
const API_DOMAIN = 'http://gd2.mlb.com/';
const API_BASE = 'http://gd2.mlb.com/components/game/mlb/';

chrome.alarms.create('update', {periodInMinutes: 1});
chrome.storage.sync.get('players', update);

chrome.alarms.onAlarm.addListener(function(){
    console.log('chrome alarm fired off');
    //chrome.storage.sync.get('players', update);
});

function getYearMonthDate() {
    return {
        date: zerofill(moment().date()),
        month: zerofill(moment().month() + 1),
        year: moment().year()
    };
}

/**
 * getTodayScoreBoard
 *
 * @returns {}
 */
function getTodayScoreBoardUrl() {
    let today = getYearMonthDate();
    return `${API_BASE}year_${today.year}/month_${today.month}/day_${today.date}/master_scoreboard.json`;
}

function update(players) {
    let playerList = players.players;
    setGameTime(playerList);
}

function setGameTime(players) {
    const parseString = xml2js.parseString;
    const options = {};
    fetch(getTodayScoreBoardUrl(), options)
        .then(data => {
            return data.json();
        })
        .then(data => {
            parseGameTime(data, players);
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}

function parseGameTime(data, players) {
    // data is list of game data
    // data.data.games.game is array of all games
    // data.data.games.game[0].time -> "1:05"
    // Assume all time are pm
    // moment format "YYYY-MM-DD HH:mm a"
    // need to pass 'pm' at the end of time.
    console.log(data, players);
    let updatedPlayerList = players.players.map(player => {
        // player.t is team name.  Need to look for team name abbr in data.data.games[0]
        //console.log(data.data.games);
        const games = data.data.games.game;

        const gamesLen = games.length;
        for (let i = 0; i < gamesLen; i++) {
            let currentGame = games[i];
            if (currentGame['home_name_abbrev'] === player.t || 
                currentGame['away_name_abbrev'] === player.t) {

                //console.log('game found', currentGame.time);
                player.time = currentGame.time;
                break;
            }
        }
        return player;
    });
    //console.log('list with time', updatedPlayerList);
    let newPlayerList = Object.assign({}, players, {players: updatedPlayerList});
    //console.log('newplayerlist', newPlayerList);
    chrome.storage.sync.set({'players': newPlayerList}, function() {
        console.log('updated player time');
    });
}


/**
 * getPlayersTeam
 * Returns all the teams for the players.  Gameday provides data based on the teams
 * playing eachother.
 *
 * @returns {undefined}
 */
function getPlayersTeam() {
}

function getLineup() {
}

/**
 * BatDeckHole
 * Gets current at bat, on deck, and in hole.
 * If players found in any of those situtation, fire off notification
 *
 * @returns {undefined}
 */
function BatDeckHole() {
}

function getAtBat() {
}

function getOnDeck() {
}

function getInHole() {
}
