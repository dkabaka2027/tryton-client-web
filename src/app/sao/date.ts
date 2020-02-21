import * as moment from 'moment';

export class SDate {
	// Add 1 day to the limit because setting time make it out of the range
    min = moment(new Date((-100000000 + 1) * 86400000));
    max = moment(new Date(100000000 * 86400000));

	// this.min.set({hour: 0, minute: 0, second: 0, millisecond: 0});
	// this.max.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    
	static init(year: number, month: number, day: number): moment.Moment {

        var date;
        if (month === undefined) {
            date = moment();
            year = undefined;
        }
        else {
            date = moment();
        }

        date.year(year);
        date.month(month);
        date.date(day);
        date.set({hour: 0, minute: 0, second: 0, millisecond: 0});
        date.isDate = true;

        return date;
    }

}