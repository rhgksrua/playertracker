import moment from 'moment-timezone';
import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import { zerofill, getYearMonthDate, momentTime } from '../lib/utils';
import PlayerList from './PlayerList';

//const SCORE_BOARD_JSON_URL = getTodayScoreBoardUrl();
const API_DOMAIN = 'http://gd2.mlb.com/';
const API_BASE = 'http://gd2.mlb.com/components/game/mlb/';


shouldUpdate();
chrome.alarms.create('shouldUpdate', {periodInMinutes: 30});

chrome.alarms.create('update', {periodInMinutes: 1});
chrome.storage.sync.get(['players', 'shouldUpdate'], update);

chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name === 'shouldUpdate') {
        shouldUpdate();
    }
    if (alarm.name === 'update') {
        chrome.storage.sync.get(['players', 'shouldUpdate'], update);
    }
});

chrome.notifications.onButtonClicked.addListener(function(id, index) {
    let url = parseNotificationId(id);
    chrome.tabs.create({ url: url });
    chrome.notifications.clear(id, function(wasCleared) {
        console.log('notification cleared and opened link to mlbtv');
    });
});

/**
 * shouldUpdate
 * Checks to see if player data should be updated or not.
 * @return {[type]} [description]
 */
function shouldUpdate() {
    //console.log('start shouldUpdate')
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
 * setUpdateStatus
 * Stores shouldUpdate to chrome.storage.sync
 * @param {Object} data [array of games]
 */
function setUpdateStatus(data) {
    const allGames = data; // array of games
    
    // Check if all games are finished.  Returns false if all done.
    let allGamesFinal = allGames.every(game => {
        return game.status === 'Final';
    });
    if (allGamesFinal) {
        chrome.storage.sync.set({shouldUpdate: false}, () => {
            console.log('shouldUpdate set to FALSE!');
        });
        return;
    }

    // Checks if there are games coming up in the next hour.
    // Start returns true if at least one game is scheduled.
    let gameStartsInHour = allGames.some((game) => {
        let now = moment();
        let gameTime = moment(`${game.time_date} ${game.ampm}`, 'YYYY/MM/DD HH:mm a').tz('America/New_York');
        let compare = now.add(1, 'h').isAfter(gameTime);
        return now.add(1, 'h').isAfter(gameTime);
    });
    if (gameStartsInHour) {
        chrome.storage.sync.set({shouldUpdate: true}, () => {
            console.log('Ther is a game starting within an hour. shouldUpdate set to TRUE');
        });
        return;
    }

    // No games have started yet.
    chrome.storage.sync.set({shouldUpdate: false}, () => {
        console.log('No games have started yet. shouldUpdate to FALSE');
    });
}

/**
 * [parseNotificationId description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function parseNotificationId(id) {
    return id.split('|')[1];
}

function createNotificationId(playerId, mlbtv) {
    return `${playerId}|${mlbtv}`;
}

/**
 * getTodayScoreBoard
 * Five hours into tomorrow (ET) is still 'today', since the longest game ever played was 8 hours
 * and 25 minutes and latest games are usually played around 9 pm (ET).
 *
 * @returns {}
 */
function getTodayScoreBoardUrl(scoreboard = 'master_scoreboard.json') {
    // need to set current time to ET.
    let today = getYearMonthDate();
    return `${API_BASE}year_${today.year}/month_${today.month}/day_${today.date}/${scoreboard}`;
}

/**
 * [update description]
 * @param  {[type]} items [description]
 * @return {[type]}       [description]
 */
function update(items) {
    // If players.players is undefined, nothing is stored in storage.sync. Need to exit
    // and do nothing

    // No players found.  Ends execution.
    if (!items.players || !items.shouldUpdate) {
        return;
    }

    let playerList = new PlayerList(items.players);
    fetchGameData(playerList);
}

/**
 * setGameTime
 *
 *
 * @param players
 * @returns {undefined}
 */
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
                let newPlayerList = Object.assign({}, players, {players: playerList.getPlayersArr()});
                chrome.storage.sync.set({'players': newPlayerList}, function() {
                    console.log('updated player time. player time set to storage');
                });

                //notifyUser(playerList.getNotification());
                //console.log('notis', playerList.notis);
                notifyUser(playerList.notis);
            });
            return data
        })
        .catch(err => {
            console.warn(err);
        });
}

function notifyUser(notification) {
    console.log('----------------------- noti --------------------------');
    let interaction = true;
    notification.forEach(player => {
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
            requireInteraction: interaction 
        };
        // Might need to consider using player id and mlbtv id to create
        // notification id.
        let notificationId = createNotificationId(player.p, player.mlbtv);
        chrome.notifications.create(notificationId, notiOpt, notiId => {
            console.log('created notification');
        });
    });
    console.log('----------------------- END --------------------------');
}



