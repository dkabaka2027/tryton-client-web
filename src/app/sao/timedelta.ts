import * as moment from 'moment';

export class TimeDelta {

	static init(days: number, seconds: number, milliseconds: number, minutes: number, hours: number, weeks: number): moment.Duration {
        var timedelta = moment.duration({
            days: days,
            seconds: seconds,
            milliseconds: milliseconds,
            minutes: minutes,
            hours: hours,
            weeks: weeks
        });

        return timedelta;
    };

}