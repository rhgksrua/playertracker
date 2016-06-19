import moment from 'moment-timezone';

/**
 * Handles all the players added to extension.
 *
 * @class PlayerList
 * @constructor
 */
class PlayerList {
    constructor(players) {
        this.players = players.players;
        this.gameTimeSet = players.gameTimeSet;
        this.notification = [];
    }

    /**
     * Set player time
     */
    setGameTime() {
        this.clearPlayerTime();
        let newPlayers = this.players.map(player => {
            // player.t is team name.  Need to look for team name abbr in data.data.games[0]
            const games = this.data.data.games.game;

            let playerGame = games.find(game => {
                return game['home_name_abbrev'] === player.t ||
                       game['away_name_abbrev'] === player.t;

            });

            if (playerGame) {
                if (playerGame.status.status === 'Final' ||
                    playerGame.status.status === 'Postponed') {
                    player.timeDate = playerGame.status.status;
                } else {
                    player.timeDate = playerGame.time_date;
                }
            } else {
                player.timeDate = 'No Game';
            }

            return player;
        });
        this.players = newPlayers;
    }

    /**
     * Removes player game time
     * @return {void}
     */
    clearPlayerTime() {
        this.players.forEach(player => {
            delete player.timeDate;
        });
    }

    /**
     * Updates player data
     * @param  {Object} data Object from JSON
     * @return
     */
    parseGameData(data) {
        if (!data) {
            return;
        }
        this.data = data;
        this.setGameTime();
        this.updatePlayerStats();
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

        // Loop through all the players stored
        let updatedPlayers = this.players.map(player => {

            // save previous batting order to compare with new order
            player.lastOrder = player.order;

            // Find player game
            let playerGame = allGames.find(game => {
                return game.away_name_abbrev === player.t ||
                       game.home_name_abbrev === player.t;
            });

            if (playerGame) {
                if (playerGame.status.status !== 'In Progress') {
                    // Game found but not started or ended.
                    player.order = 'Dugout';
                    player.gameStatus = playerGame.status.status;
                } else {
                    // Game in progress
                    let order = this.getCurrentOrder(player.p, playerGame);
                    player.order = order.order;
                    player.orderKey = order.orderKey;
                    player.outs = playerGame.status.o;
                    player.gameStatus = playerGame.status.status;
                    player.lastUpdated = moment().format();
                    player.mlbtv = this.parseMlbtv(playerGame.links.mlbtv);
                    const validOrder = ['batter', 'inhole', 'ondeck'];
                    if (validOrder.indexOf(player.orderKey) >= 0) {
                        player.hits = playerGame[player.orderKey].h;
                        player.ab = playerGame[player.orderKey].ab;
                    }
                }
            } else {
                // No games found for player
                player.order = 'Dugout';
                player.gameStatus = 'No Games';
            }

            this.setNotificationIfNecessary(player);
            return player;

        });
        this.players = updatedPlayers;
    }

    /**
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
        if (player.order === 'Final' ||
            player.lastOrder === player.order ||
            player.order === 'Dugout') {
            return;
        }

        // User setting
        if (player.order === 'At Bat' && player.toggleAtBat === false) return;
        if (player.order === 'On Deck' && player.toggleOnDeck === false) return;
        if (player.order === 'In Hole' && player.toggleInHole === false) return;
        if (player.toggleNotify === false) return;

        this.notification = this.notification.concat(player);
    }

    /**
     * returns notification
     * @return {array} 
     */
    get notis() {
        return this.notification;
    }

    /**
     * Returns all players
     * @return {array} Array of player object
     */
    getPlayersArr() {
        return this.players;
    }

    /**
     * Constructs mlb.tv url for player
     * @param  {string} raw ID from url
     * @return {string}
     */
    parseMlbtv(raw) {
        let id = this.parseCalendarId(raw);
        let clickOrigin = '';
        let team = '';
        return `http://m.mlb.com/tv/e${id}/?clickOrigin=${clickOrigin}&team=${team}`;
    }
    
    /**
     * Returns Id for each mlb.tv games
     * @param  {string} raw calender_event ID
     * @return {string}
     */
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
