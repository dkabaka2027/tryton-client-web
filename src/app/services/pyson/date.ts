import _ from 'underscore';
import * as moment from 'moment';
import { SDate } from '../../sao/date';
import { Pyson, PysonObject } from './interfaces';

type DateObject = {
	y: number;
    M: number;
    d: number;
    dy: number;
    dM: number;
    dd: number;
};

export class Date extends Pyson<DateObject> {
    _year: number;
    _month: number;
    _day: number;
    _delta_years: number;
    _delta_months: number;
    _delta_days: number;

    constructor(year: number, month: number, day: number, delta_years: number, delta_months: number, delta_days: number) {
        super();
        if (year === undefined) year = null;
        if (month === undefined) month = null;
        if (day === undefined) day = null;
        if (delta_years === undefined) delta_years = 0;
        if (delta_months === undefined) delta_months = 0;
        if (delta_days === undefined) delta_days = 0;

        this._test(year, 'year');
        this._test(month, 'month');
        this._test(day, 'day');
        this._test(delta_years, 'delta_years');
        this._test(delta_days, 'delta_days');
        this._test(delta_months, 'delta_months');

        this._year = year;
        this._month = month;
        this._day = day;
        this._delta_years = delta_years;
        this._delta_months = delta_months;
        this._delta_days = delta_days;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Date',
            y: this._year,
            M: this._month,
            d: this._day,
            dy: this._delta_years,
            dM: this._delta_months,
            dd: this._delta_days
        }
    }

    types(): string[] {
        return ['object'];
    }

    __string_params__(): string[] {
        return [this._year.toString(), this._month.toString(), this._day.toString(), this._delta_years.toString(), this._delta_months.toString(), this._delta_days.toString()];
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

    eval_(value: DateObject, context: any): moment.Moment {
        var date = SDate.init(value.y, value.M && value.M - 1, value.d);
        if (value.dy) date.add(value.dy, 'y');
        if (value.dM) date.add(value.dM, 'M');
        if (value.dd) date.add(value.dd, 'd');
        return date;
    };

    static init_from_object(obj: DateObject) {
        return new Date(obj.y, obj.M, obj.d, obj.dy, obj.dM, obj.dd);
    };

}