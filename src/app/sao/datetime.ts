import { SDate } from './date';
import { Time } from './time';
import * as moment from 'moment';

export class SDateTime {
	min = moment(new Date(-100000000 * 86400000)).local();
    max = moment(new Date(100000000 * 86400000)).local();

	static init(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, utc?: boolean): moment.Moment {
        var datetime;
        if (month === undefined) {
          	month = 1;
            year = undefined;
            datetime = moment()
        } else {
            if (hour === undefined) {
                hour = 0;
            }
            if (minute === undefined) {
                minute = 0;
            }
            if (second === undefined) {
                second = 0;
            }
            if (millisecond === undefined) {
                millisecond = 0;
            }
            datetime = moment();
        }

        if (utc) {
            datetime.utc();
        }

        datetime.year(year);
        datetime.month(month);
        datetime.date(day);

        if (month !== undefined) {
            datetime.hour(hour);
            datetime.minute(minute);
            datetime.second(second);
            datetime.milliseconds(millisecond);
        }

        datetime.isDateTime = true;
        datetime.local();
        return datetime;
    }

    combine(date: moment.Moment, time: moment.Moment) {
        var datetime = date.clone();
        datetime.set({hour: time.hour(), minute: time.minute(), second: time.second(), millisecond: time.millisecond()});
        return datetime;
    }

}