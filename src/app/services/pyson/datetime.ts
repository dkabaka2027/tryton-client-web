import _ from 'underscore';
import * as moment from 'moment';
import { Pyson, PysonObject } from './interfaces';
import { SDateTime } from '../../sao/datetime';

type DateTimeObject = {
	y: number;
    M: number;
    d: number;
    h: number;
    m: number;
    s: number;
    ms: number;
    dy: number;
    dM: number;
    dd: number;
    dh: number;
    dm: number;
    ds: number;
    dms: number;
};

export class DateTime extends Pyson<DateTimeObject> {
    _year: number;
    _month: number;
    _day: number;
    _hour: number;
    _minute: number;
    _second: number;
    _microsecond: number;
    _delta_years: number;
    _delta_months: number;
    _delta_days: number;
    _delta_hours: number;
    _delta_minutes: number;
    _delta_seconds: number;
    _delta_microseconds: number;

    constructor(year: number, month: number, day: number, hour: number, minute: number, second: number, microsecond: number,
                  delta_years: number, delta_months: number, delta_days: number, delta_hours: number,
                  delta_minutes: number, delta_seconds: number, delta_microseconds: number) {
        super();
        if (year === undefined) year = null;
        if (month === undefined) month = null;
        if (day === undefined) day = null;
        if (hour === undefined) hour = null;
        if (minute === undefined) minute = null;
        if (second === undefined) second = null;
        if (microsecond === undefined) microsecond = null;
        if (delta_years === undefined) delta_years = 0;
        if (delta_months === undefined) delta_months = 0;
        if (delta_days === undefined) delta_days = 0;
        if (delta_hours === undefined) delta_hours = 0;
        if (delta_minutes === undefined) delta_minutes = 0;
        if (delta_seconds === undefined) delta_seconds = 0;
        if (delta_microseconds === undefined) delta_microseconds = 0;

        this._test(year, 'year');
        this._test(month, 'month');
        this._test(day, 'day');
        this._test(hour, 'hour');
        this._test(minute, 'minute');
        this._test(second, 'second');
        this._test(microsecond, 'microsecond');
        this._test(delta_years, 'delta_years');
        this._test(delta_days, 'delta_days');
        this._test(delta_months, 'delta_months');
        this._test(delta_hours, 'delta_hours');
        this._test(delta_minutes, 'delta_minutes');
        this._test(delta_seconds, 'delta_seconds');
        this._test(delta_microseconds, 'delta_microseconds');

        this._year = year;
        this._month = month;
        this._day = day;
        this._hour = hour;
        this._minute = minute;
        this._second = second;
        this._microsecond = microsecond;
        this._delta_years = delta_years;
        this._delta_months = delta_months;
        this._delta_days = delta_days;
        this._delta_hours = delta_hours;
        this._delta_minutes = delta_minutes;
        this._delta_seconds = delta_seconds;
        this._delta_microseconds = delta_microseconds;
    }

    pyson(): PysonObject {
        return {
            __class__: 'DateTime',
            y: this._year,
            M: this._month,
            d: this._day,
            h: this._hour,
            m: this._minute,
            s: this._second,
            ms: this._microsecond,
            dy: this._delta_years,
            dM: this._delta_months,
            dd: this._delta_days,
            dh: this._delta_hours,
            dm: this._delta_minutes,
            ds: this._delta_seconds,
            dms: this._delta_microseconds
        }
    }

    types(): string[] {
        return ['object'];
    }

    __string_params__(): string[] {
        return [this._year.toString(), this._month.toString(), this._day.toString(), this._hour.toString(), this._minute.toString(), this._second.toString(),
        this._microsecond.toString(), this._delta_years.toString(), this._delta_months.toString(), this._delta_days.toString(), this._delta_hours.toString(),
        this._delta_minutes.toString(), this._delta_seconds.toString(), this._delta_microseconds.toString()];
    }

    _test(value: any, name: any) {
        if (value instanceof Pyson) {
            if (_.difference(value.types(), ['number', typeof null]).length > 0) {
                throw name + ' must be an integer or None';
            }
        } else {
            if ((typeof value != 'number') && (value !== null)) {
                throw name + ' must be an integer or None';
            }
        }
    }

    eval_(value: DateTimeObject, context: any): moment.Moment {
        var date = SDateTime.init(value.y, value.M && value.M - 1, value.d, value.h, value.m, value.s, value.ms && value.ms / 1000, true);
        if (value.dy) date.add(value.dy, 'y');
        if (value.dM) date.add(value.dM, 'M');
        if (value.dd) date.add(value.dd, 'd');
        if (value.dh) date.add(value.dh, 'h');
        if (value.dm) date.add(value.dm, 'm');
        if (value.ds) date.add(value.ds, 's');
        if (value.dms) date.add(value.dms / 1000, 'ms');
        return date;
    };

    static init_from_object(obj: DateTimeObject): DateTime {
        return new DateTime(obj.y, obj.M, obj.d, obj.h, obj.m, obj.s, obj.ms, obj.dy, obj.dM, obj.dd, obj.dh, obj.dm, obj.ds, obj.dms);
    };

}