import moment from 'moment';
import xml2js from 'xml2js';
import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import { zerofill, getYearMonthDate } from '../lib/utils';
import PlayerList from './PlayerList';

//const SCORE_BOARD_JSON_URL = getTodayScoreBoardUrl();
const API_DOMAIN = 'http://gd2.mlb.com/';
const API_BASE = 'http://gd2.mlb.com/components/game/mlb/';

/**
 * Uses chrome.alarms to update player status once per minute.
 **/
chrome.alarms.create('update', {periodInMinutes: 1});
chrome.storage.sync.get('players', update);

chrome.alarms.onAlarm.addListener(function(){
    chrome.storage.sync.get('players', update);
});

chrome.notifications.onButtonClicked.addListener(function(id, index) {
    let url = parseNotificationId(id);
    chrome.tabs.create({ url: url });
    chrome.notifications.clear(id, function(wasCleared) {
        console.log('notification cleared and opened link to mlbtv');
    });
});

function parseNotificationId(id) {
    return id.split('|')[1];
}

/**
 * getTodayScoreBoard
 * Five hours into tomorrow (ET) is still 'today', since the longest game ever played was 8 hours
 * and 25 minutes and latest games are usually played around 9 pm (ET).
 *
 * @returns {}
 */
function getTodayScoreBoardUrl() {
    // need to set current time to ET.
    let today = getYearMonthDate();
    return `${API_BASE}year_${today.year}/month_${today.month}/day_${today.date}/master_scoreboard.json`;
}

function update(players) {
    // If players.players is undefined, nothing is stored in storage.sync. Need to exit
    // and do nothing
    console.log('start extension');

    // No players found.  Ends execution.
    if (!players.players) {
        return;
    }

    let playerList = new PlayerList(players.players);
    if (shouldUpdate(players.players)) {
        fetchGameData(playerList);
    }
    console.log('nothing to update');
}

function shouldUpdate(players) {
    return true;

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
                    console.log('updated player time');
                });

                //notifyUser(playerList.getNotification());
                console.log('notis', playerList.notis);
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
            requireInteraction: true
        };
        // Might need to consider using player id and mlbtv id to create
        // notification id.
        let notificationId = createNotificationId(player.p, player.mlbtv);
        chrome.notifications.create(notificationId, notiOpt, notiId => {
            console.log('created notification');
        });
        console.log('--- noti info', player.n, player.order);
    });
    console.log('----------------------- END --------------------------');
}

function createNotificationId(playerId, mlbtv) {
    return `${playerId}|${mlbtv}`;
}
