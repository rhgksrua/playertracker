import moment from 'moment';

export function zerofill(val) {
    return val < 10 ? '0' + val : val;
}


export function getYearMonthDate() {
    let now = moment();
    return {
        date: zerofill(now.date()),
        month: zerofill(now.month() + 1),
        year: now.year(),
    };
}
