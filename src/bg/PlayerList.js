import { getYearMonthDate } from '../lib/utils';
import moment from 'moment-timezone';
import fetch from 'isomorphic-fetch';

class PlayerList {
    /**
     * constructor
     * 
     *
     * @returns {undefined}
     */
    constructor(players) {
        this.players = players.players;
        this.gameTimeSet = players.gameTimeSet;
        this.notification = [];
    }
    setGameTime() {
        let newPlayers = this.players.map(player => {
            // player.t is team name.  Need to look for team name abbr in data.data.games[0]
            const games = this.data.data.games.game;
            const gamesLen = games.length;
            for (let i = 0; i < gamesLen; i++) {
                let currentGame = games[i];
                if (currentGame['home_name_abbrev'] === player.t || 
                    currentGame['away_name_abbrev'] === player.t) {
                    // player game is finished
                    if (currentGame.status.status === 'Final') {
                        player.time = 'Final';
                        break;
                    }

                    // game not finished or in progress
                    player.timeDate = currentGame.time_date;
                    //player.url = currentGame.game_data_directory;
                    break;
                }
            }
            return player;
        });
        this.players = newPlayers;
    }
    getPlayers() {
        return this.players;
    }
    parseGameData(data) {
        if (!data) {
        }
        this.data = data;
        this.setGameTime();
        this.updateIfNecessary(data);
    }
    /**
     * updateIfNecessary
     * If there are at least one player playing at current time,
     * update starts until all games are finished for the day.
     *
     * @returns {undefined}
     */
    updateIfNecessary(data = this.data) {
        //let currentTime = moment();
        //console.log(this.players);
        //let updatedList = this.players.map(player => {
        if(this.shouldUpdate()) {
            //console.log('player status should be updated', player.n);
            this.updatePlayerStats();
        } else {
            console.log('game has not started yet', player.n);
        }
        //return player;
        //});
        //this.players = updatedList;
    }
    /**
     * shouldUpdate
     * The base ti
     *
     * @returns {undefined}
     */
    shouldUpdate(time) {
        return true;
        // Time when data is being parsed
        //let currentTime = moment();
        // Time when the game starts
        //console.log(time);
        //let gameTime =  moment(`${time} pm`, 'YYYY/MM/DD HH:mm a').tz('America/New_York');

        //console.log(currentTime.format(), gameTime.format());
        //console.log(currentTime.isAfter(gameTime));

        //return currentTime.isAfter(gameTime);
        //return true;
    }
    updatePlayerStats() {
        //this.fetchDataBasedOnTeam(player);
        //console.log(this.data);
        console.log('why twice', this.players);
        let allGames = this.data.data.games.game;
        let updatedPlayers = this.players.map(player => {
            for (let i = 0, len = allGames.length; i < len; i++) {
                let currentGame = allGames[i];
                if (currentGame.status.status !== 'In Progress') {
                    continue;
                }
                if (currentGame.away_name_abbrev === player.t ||
                    currentGame.home_name_abbrev === player.t) {
                    player.lastOrder = player.order;
                    player.order = this.getCurrentOrder(player.p, currentGame);
                    player.lastUpdated = moment().format();
                    break;
                }
                //player.lastOrder = player.order;
                //player.order = 'dugout';
                //player.lastUpdated = moment().format();
            }
            if (player.order === undefined || player.order === 'Dugout') {
                player.order = 'Dugout';
            }
            this.setNotificationIfNecessary(player);
            return player;

        });
        this.players = updatedPlayers;
    }
    getCurrentOrder(id, game) {
        console.log('--current game batter', game.batter.id, id, game.batter.id === id);
        console.log('--current game deck', game.ondeck.id, id, game.ondeck.id === id);
        console.log('--current game hole', game.inhole.id, id, game.inhole.id === id);
        if (game.status.status === 'Final' ||
            game.status.status === 'Game Over') {
            return 'Final';
        } else if (game.batter.id === id) {
            return 'At Bat';
        } else if (game.inhole.id === id) {
            return 'In Hole';
        } else if (game.ondeck.id === id) {
            return 'On Deck';
        }
        return 'dugout';
    }
    /**
     * setNotificationIfNecessary
     * Pushes all the notification that need to be activated in to this.noti(Array)
     *
     * @returns {undefined}
     */
    setNotificationIfNecessary(player) {
        console.log('---order', player.n, player.order, player.lastOrder);
        if (player.order === 'Final' || player.lastOrder === player.order) {
            console.log('--- no notification b/c same or game ended');
            return;
        }
        //console.log('--- show noti since order changed');
        console.log('pushing', player.n, player.p);
        this.notification = this.notification.concat(player);
    }

    /**
     * notification
     * getter
     *
     * @returns {undefined}
     */
    getNotification() {
        if (!this.notification) {
            return [];
        }
        return this.notification;
    }

    getPlayersArr() {
        return this.players;
    }

    fetchDataBasedOnTeam(player) {

        let options = {};
        if (!player.url) {
            return;
        }
        let url = `http://gd2.mlb.com${player.url}/plays.json`;
        fetch(url, options)
            .then(data => {
                return data.json();
            })
            // cannot use arrow func because 'this' cannot be changed
            .then(function(data) {
                //this.buffer[`${player.t}${}`] = data;
                return data;
            }.bind(this))
            .then(data => {
                let outs = data.data.game.o;
                let status = data.data.game.status;
                if (status === 'Game Over' || status === 'Final') {
                    return data;
                }
                let comingUp = data.data.game.players;
                //console.log('PLAYER: ', player.n, player.p);
                if (comingUp.batter.pid === player.p) {
                    console.log('AT BAT');
                }
                if (comingUp.deck.pid === player.p) {
                    console.log('ON DECK');
                }
                if (comingUp.hole.pid === player.p) {
                    console.log('IN HOLE');
                }
                console.log('---- done');
                return data;
            })
            .catch(err => {
                console.warn(err);
            });
    }
}

export default PlayerList;
