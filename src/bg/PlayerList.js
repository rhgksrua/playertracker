import moment from 'moment-timezone';

class PlayerList {
    constructor(players) {
        this.players = players.players;
        this.gameTimeSet = players.gameTimeSet;
        this.notification = [];
    }
    /**
     * setFirstGameTime
     * Finds the first game of the day and returns it
     *
     * This will be used to determine if the extension should fetch from mlb api
     *
     * @returns {undefined}
     */
    setFirstGameTime() {
        this.firstGameTime = this.getFirstGameTime();
    }
    /**
     * getFirstGameTime
     * Returns first game time in the player list
     * @return {string} [date and time in string]
     */
    getFirstGameTime() {
        if (!this.players && this.players.length < 1) return;

        // Remove no games
        let filteredPlayers = this.players.filter(player => {
            return player.timeDate !== 'No Game';
        });

        // Get array of game times
        let allTimes = filteredPlayers.map(player => {
            return player.timeDate;
        });

        // Sort by game time
        allTimes.sort((a, b) => {
            let aTime =  moment(`${a} pm`, 'YYYY/MM/DD HH:mm a').tz('America/New_York');
            let bTime =  moment(`${b} pm`, 'YYYY/MM/DD HH:mm a').tz('America/New_York');
            return aTime.isAfter(bTime);
            if (aTime.isAfter(bTime)) {
                return -1;
            }
            if (bTime.isAfter(aTime)) {
                return 1;
            }
            return 0;
        });

        //console.log('alltimes sorted', allTimes);

        // returns very first game
        return allTimes[0];
    }
    /**
     * setGameTime
     * Sets game time time for each player
     */
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
                        player.timeDate = 'Final';
                        break;
                    }

                    // game not finished or in progress
                    player.timeDate = currentGame.time_date;
                    break;
                }
            }

            // Game not scheduled
            if (!player.timeDate) {
                player.timeDate = 'No Game';
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
        //console.log('after game time set', this.players);
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
        if(this.shouldUpdate()) {
            //console.log('player status should be updated', player.n);
            this.updatePlayerStats();
        } else {
            console.log('game has not started yet', player.n);
        }
    }
    /**
     * shouldUpdate
     * The base ti
     *
     * @returns {undefined}
     */
    shouldUpdate(time) {
        console.log('all done', this.allGamesFinished());
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

        // should stop updating if all game are finished

    }

    /**
     * allGamesFinished
     * If there are games still in progress, returns true
     * @return {boolean}
     */
    allGamesFinished() {
        let allGames = this.data.data.games.game;
        let gamesAreInProgress = allGames.some(game => {
            return game.status.status !== 'Final';
        });

        if (gamesAreInProgress) return false;
        return true;
    }

    /**
     *  updatePlayerStats
     *  Updates players stats.
     *  It loops through all the players set by the user.  Then looks for
     *  all the games playing for the day.  If player's team is playing
     *  checks for batting order.
     *
     * @returns {undefined}
     */
    updatePlayerStats() {
        let allGames = this.data.data.games.game;

        //this.setFirstGameTime();
        //console.log('----- first game time', this.firstGameTime);

        // Loop through all the players stored
        let updatedPlayers = this.players.map(player => {

            // Loop thru all the games available
            for (let i = 0, len = allGames.length; i < len; i++) {
                let currentGame = allGames[i];
                if (currentGame.away_name_abbrev === player.t ||
                    currentGame.home_name_abbrev === player.t) {

                    player.lastOrder = player.order;

                    // Game did not start or has ended
                    if (currentGame.status.status !== 'In Progress') {
                        player.order = 'Dugout';
                        player.gameStatus = currentGame.status.status;
                        continue;
                    }

                    // Set all required data for player

                    let order = this.getCurrentOrder(player.p, currentGame);
                    player.order = order.order;
                    player.orderKey = order.orderKey;

                    player.outs = currentGame.status.o;

                    player.gameStatus = currentGame.status.status;
                    player.lastUpdated = moment().format();

                    player.mlbtv = this.parseMlbtv(currentGame.links.mlbtv);

                    // Get today stat for player
                    const validOrder = ['batter', 'inhole', 'ondeck'];
                    if (validOrder.indexOf(player.orderKey) >= 0) {
                        player.hits = currentGame[player.orderKey].h;
                        player.ab = currentGame[player.orderKey].ab;
                    }

                    break;
                }
            }

            // Checks for newly added player or in Dugout
            if (player.order === undefined || player.order === 'Dugout') {
                player.order = 'Dugout';
            }

            // No games found for the day
            if (player.gameStatus === undefined) {
                player.gameStatus = 'No Games';
            }

            this.setNotificationIfNecessary(player);
            return player;

        });
        this.players = updatedPlayers;
    }
    /**
     * getCurrentOrder
     * Returns current order of player
     *
     * @returns {undefined}
     */
    getCurrentOrder(id, game) {
        if (game.status.status === 'Final' ||
            game.status.status === 'Game Over') {
            return { order: 'Final', orderKey: '' };
        } else if (game.batter.id === id) {
            return { order: 'At Bat', orderKey: 'batter' };
        } else if (game.inhole.id === id) {
            return { order: 'In Hole', orderKey: 'inhole' };
        } else if (game.ondeck.id === id) {
            return { order: 'On Deck', orderKey: 'ondeck' };
        }
        return { order: 'Dugout', orderKey: '' };
    }
    /**
     * setNotificationIfNecessary
     * Pushes all the notification that need to be activated in to this.noti(Array)
     *
     * @returns {undefined}
     */
    setNotificationIfNecessary(player) {
        //console.log(player.lastOrder, player.order);
        if (player.order === 'Final' ||
            player.lastOrder === player.order ||
            player.order === 'Dugout') {
            return;
        }

        // User setting
        if (player.order === 'At Bat' && player.toggleAtBat === false) return;
        if (player.order === 'On Deck' && player.toggleOnDeck === false) return;
        if (player.order === 'In Hole' && player.toggleInHole === false) return;

        this.notification = this.notification.concat(player);
    }

    /**
     * notification
     *
     * @returns {undefined}
     */
    getNotification() {
        if (!this.notification) {
            return [];
        }
        return this.notification;
    }

    get notis() {
        return this.notification;
    }

    getPlayersArr() {
        return this.players;
    }
    parseMlbtv(raw) {
        let id = this.parseCalendarId(raw);
        let clickOrigin = '';
        let team = '';
        return `http://m.mlb.com/tv/e${id}/?clickOrigin=${clickOrigin}&team=${team}`;
    }
    parseCalendarId(raw) {
        const re = /calendar_event_id:\'([\d\-]+)\'/;
        let results = re.exec(raw);
        if (results.length > 1) {
            return results[1];
        }
        return '';
    }
}

export default PlayerList;
