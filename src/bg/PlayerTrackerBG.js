import moment from 'moment';
import xml2js from 'xml2js';
import promise from 'es6-promise';
promise.polyfill();
import fetch from 'isomorphic-fetch';
import { zerofill, getYearMonthDate } from '../lib/utils';

const API_DOMAIN = 'http://gd2.mlb.com/';
const API_BASE = 'http://gd2.mlb.com/components/game/mlb/';

class PlayerTracker {
    constructor() {
        this.initialize = this.initialize.bind(this);
        this.getTodayScoreBoardUrl = this.getTodayScoreBoardUrl.bind(this);
        this.update = this.update.bind(this);
        this.setGameTime = this.setGameTime.bind(this);
        this.parseGameTime = this.parseGameTime(this);

    }
    initialize() {
        //console.log('update func', this.update);
        //console.log('setGameTime func', this.setGameTime);
        chrome.alarms.create('update', {periodInMinutes: 1});
        chrome.storage.sync.get('players', this.update);

        chrome.alarms.onAlarm.addListener(function(){
            console.log('chrome alarm fired off');
            //chrome.storage.sync.get('players', update);
        });
    }
    getTodayScoreBoardUrl() {
        let today = getYearMonthDate();
        return `${API_BASE}year_${today.year}/month_${today.month}/day_${today.date}/master_scoreboard.json`;
    }
    update(players) {
            let playerList = players.players;
            console.log('players', players);
            //console.log('initialzi func', this.initialize);
            //this.setGameTime(playerList);
    }
    setGameTime(players) {
        fetch(this.getTodayScoreBoardUrl(), options)
            .then(function(data) {
                return data.json();
            })
            .then(function(data) {
                console.log('before parsetime');
                this.parseGameTime(data, players);
                return data;
            })
            .catch(err => {
                console.warn(err);
            });
    }
    parseGameTime(data, players) {
        console.log(data, players);
        let updatedPlayerList = players.players.map(player => {
            // player.t is team name.  Need to look for team name abbr in data.data.games[0]
            const games = data.data.games.game;

            const gamesLen = games.length;
            for (let i = 0; i < gamesLen; i++) {
                let currentGame = games[i];
                if (currentGame['home_name_abbrev'] === player.t || 
                    currentGame['away_name_abbrev'] === player.t) {
                    player.time = currentGame.time;
                    break;
                }
            }
            return player;
        });
        let newPlayerList = Object.assign({}, players, {players: updatedPlayerList});
        chrome.storage.sync.set({'players': newPlayerList}, function() {
            console.log('updated player time');
        });
    }
}

export default PlayerTracker;
