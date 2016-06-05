import moment from 'moment-timezone';
import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import { getYearMonthDate } from '../lib/utils';
import PlayerList from './PlayerList';

//const SCORE_BOARD_JSON_URL = getTodayScoreBoardUrl();
const API_BASE = 'http://gd2.mlb.com/components/game/mlb/';


/**
 * When chrome starts.
 * The alarms created by start up will replace the alarms
 * created by on install.
 */
chrome.runtime.onStartup.addListener(initialize);

/**
 * When chrome extension is installed or reloaded.
 * This will replace alarms created by on start up if
 * it exists.
 */
chrome.runtime.onInstalled.addListener(initialize);

/**
 * Starts extension by getting checking if games are in progress
 * return
 */
function initialize() {
    console.log('start extension');
    let shouldUpdateTime;
    if (process.env.NODE_ENV === 'development') {
        shouldUpdateTime = 30;
        //chrome.alarms.create('log', {periodInMinutes: 0.2});
        //chrome.alarms.clear('log');
    } else {
        shouldUpdateTime = 30;
    }
    shouldUpdate();
    chrome.alarms.create('shouldUpdate', {periodInMinutes: shouldUpdateTime});
    chrome.storage.sync.get(['players', 'shouldUpdate'], update);
}


// Might not need to update when extension starts
chrome.alarms.onAlarm.addListener(function(alarm){
    //console.log('Alarm name', alarm);
    if (alarm.name === 'shouldUpdate') {
        console.log('calling shouldupdate from alarm');
        shouldUpdate();
    }
    if (alarm.name === 'update') {
        console.log('calling update from alarm');
        chrome.storage.sync.get(['players', 'shouldUpdate'], update);
    }
    if (alarm.name === 'log') {
        chrome.storage.sync.get('log', items => {
            //console.log('log item', items);
            if (items.hasOwnProperty('log')) {
                chrome.storage.sync.set({'log': items.log + 1});
            } else {
                chrome.storage.sync.set({'log': 1});
            }
        });
    }
});

chrome.notifications.onButtonClicked.addListener(function(id, index) {
    let url = parseNotificationId(id);
    chrome.tabs.create({ url: url });
    chrome.notifications.clear(id, function(wasCleared) {
        console.log('notification cleared and opened link to mlbtv', wasCleared);
    });
});

/**
 * shouldUpdate
 * Checks to see if player data should be updated or not.
 * @return {[type]} [description]
 */
function shouldUpdate() {
    let miniUrl = getTodayScoreBoardUrl('miniscoreboard.json');
    const options = {};
    fetch(miniUrl, options)
        .then(data => {
            return data.json();
        })
        .then(data => {
            setUpdateStatus(data.data.games.game);
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}

/**
 * Stores shouldUpdate to chrome.storage.sync
 * @param {Object} data - array of games
 */
function setUpdateStatus(data) {
    const allGames = data; // array of games
    
    // Check if all games are finished.  Returns false if all done.
    if (allGamesFinal(allGames)) {
        chrome.alarms.clear('update', wasCleared => {
            console.log('All games are finished. No updates!!!!');
            if (!wasCleared) {
                console.log('failed to clear alarm');
                return;
            }
            console.log('alarms cleared');
        });
        return;
    }

    // Checks if there are games coming up in the next hour.
    // Start returns true if at least one game is scheduled.
    if (gameStartsInHour(allGames)) {
        console.log('At least ONE game starting within the hour');
        //chrome.storage.sync.get(['players', 'shouldUpdate'], update);
        chrome.alarms.create('update', {periodInMinutes: 1});
        return;
    }

    console.log('no games with in the next hourA');
}

/**
 * Looks for all finished games
 * @param  {array} allGames - array of all games
 * @return {boolean}
 */
function allGamesFinal(allGames) {
    return allGames.every(game => {
        return game.status === 'Final' || 
               game.status === 'Game Over' ||
               game.status === 'Postponed';
    });
}

/**
 * Checks to see if there are any games coming up in the next hour.
 * @param  {array} allGames - array of all games.
 * @return {boolean}
 */
function gameStartsInHour(allGames) {
    return allGames.some((game) => {
        let now = moment();
        let gameTime = moment(`${game.time_date} ${game.ampm}`, 'YYYY/MM/DD HH:mm a').tz('America/New_York');
        let compare = now.add(1, 'h').isAfter(gameTime);
        return compare;
    });
}

/**
 * Returns player Id of notification
 * @param  {string} id - notificatin id
 * @return {string}    - player id
 */
function parseNotificationId(id) {
    return id.split('|')[1];
}

/**
 * Returns notification id created by player id and mlb tv id
 * @param  {string} playerId - player id
 * @param  {string} mlbtv    - calender id
 * @return {string}          - string created by player and calender id
 */
function createNotificationId(playerId, mlbtv) {
    return `${playerId}|${mlbtv}`;
}

/**
 * Five hours into tomorrow (ET) is still 'today', since the longest game ever played was 8 hours
 * and 25 minutes and latest games are usually played around 9 pm (ET).
 * @param   {string} scoreboard - name of json
 * @returns {string}            - api URL
 */
function getTodayScoreBoardUrl(scoreboard = 'master_scoreboard.json') {
    // need to set current time to ET.
    let today = getYearMonthDate();
    return `${API_BASE}year_${today.year}/month_${today.month}/day_${today.date}/${scoreboard}`;
}

/**
 * This is a callback function for chrome.storage.sync.get
 * @param  {Object} items - all objects defined from caller
 * @return {Object}       
 */
function update(items) {
    // If players.players is undefined, nothing is stored in storage.sync. Need to exit
    // and do nothing

    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    }

    if (!items.hasOwnProperty('players')) {
        console.warn('storage has no property named players');
        return;
    }

    let playerList = new PlayerList(items.players);
    fetchGameData(playerList);
}

function fetchGameData(playerList) {
    // for XML use parseString from xml2js
    //const parseString = xml2js.parseString;
    //const options = {};
    const options = {};
    let url = getTodayScoreBoardUrl();
    //url = '/master.json';
    fetch(url, options)
        .then(data => {
            return data.json();
        })
        .then(data => {
            playerList.parseGameData(data);
            chrome.storage.sync.get('players', players => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
                let newPlayerList = Object.assign({}, players, {players: playerList.getPlayersArr()});
                //console.table(newPlayerList.players);
                chrome.storage.sync.set({'players': newPlayerList}, function() {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                    console.log('PLAYER DATA UPDATED');
                });
                notifyUser(playerList.notis);
            });
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}

/**
 * Creates notification based on user options
 * @param  {array} notification - array of players that needs notification
 * @return {null}
 */
function notifyUser(notification) {
    notification.forEach(player => {
        if (player.toggleNotify) {
            let notiOpt = {
                type: 'basic',
                iconUrl: `http://mlb.mlb.com/images/players/assets/74_${player.p}.png`,
                title: player.n,
                message: `${player.order}, ${player.outs} Outs`,
                contextMessage: `${player.hits} for ${player.ab}`,
                buttons: [
                    {
                        title: 'watch on mlb.tv'
                    }
                ],
                isClickable: true,
                priority: 2,
                requireInteraction: player.toggleInteraction 
            };
            let notificationId = createNotificationId(player.p, player.mlbtv);
            chrome.notifications.create(notificationId, notiOpt, notiId => {
                console.log('created notification', notiId);
            });
        }
    });
}



