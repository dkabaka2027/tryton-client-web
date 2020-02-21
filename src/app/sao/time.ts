import * as moment from 'moment';

export class Time {

	static init(hour: number, minute: number, second: number, millisecond: number): moment.Moment {
        var time = moment({hour: hour, minute: minute, second: second, millisecond: millisecond || 0});

        return time;
    };

}