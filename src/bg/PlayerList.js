import { getYearMonthDate } from '../lib/utils';
import moment from 'moment-timezone';

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
    }
    setGameTime(data) {
        this.data = data;
        console.log('in PL this players', this.players);
        let newPlayers = this.players.map(player => {
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
        this.players = newPlayers;
    }
    getPlayers() {
        return this.players;
    }
    parseGameData(data) {
        if (!data) {
        }
        this.setGameTime(data);
        this.updateIfNecessary(data);
    }
    /**
     * updateIfNecessary
     * checks current time and updates if game started
     *
     * @returns {undefined}
     */
    updateIfNecessary(data = this.data) {
        console.log('check time and begin update if necessary');
        let currentTime = moment();
        console.log(this.players);
        let updatedList = this.players.map(player => {
            if(this.shouldUpdate(player.time)) {
                console.log('player status should be updated');
            } else {
                console.log('game has not started yet');
            }
            return player;
        });
        this.players = updatedList;
    }
    shouldUpdate(time) {
        // Time when data is being parsed
        let currentTime = moment().tz('America/New_York');
        // Time when the game starts
        let convertedTime =  moment(`${time} pm`, 'HH:mm a');

        return currentTime.isAfter(convertedTime);
    }
}

export default PlayerList;
