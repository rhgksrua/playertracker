import moment from 'moment';

export function zerofill(val) {
    return val < 10 ? '0' + val : val;
}


export function getYearMonthDate(offset = 5) {
    let now = moment().subtract(offset, 'hours');
    return {
        date: zerofill(now.date()),
        month: zerofill(now.month() + 1),
        year: now.year(),
    };
}

/**
 * momentTime
 * Returns moment object
 * @param  {string} timeDate [description]
 * @return {moment Object}          [description]
 */
export function momentTime(timeDate) {
    return moment(`${timeDate} pm`, 'YYYY/MM/DD HH:mm a');
}

export function getFirstGameTime(players = []) {
    if (players.length < 1) {
        return;
    }

    let filteredPlayers = players.filter(player => {
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


    // returns very first game
    return allTimes[0];
}
