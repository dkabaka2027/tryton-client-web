import _ from 'underscore';
import * as moment from 'moment';
import { Pyson, PysonObject } from './interfaces';

type BoolObject = {
	v: any;
};

export class Bool extends Pyson<BoolObject> {
	_value: any;

	constructor(value: any) {
        super();
		this._value = value;
	}

    pyson(): PysonObject {
        return {
            __class__: 'Bool',
            v: this._value
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._value];
    }

	eval_(value: any, context: any): boolean {
        if (moment.isMoment(value.v) && value.v.isTime) {
            return Boolean(value.v.hour() || value.v.minute() || value.v.second() || value.v.millisecond());
        } else if (moment.isDuration(value.v)) {
            return Boolean(value.v.valueOf());
        } else if (value.v instanceof Number) {
            return Boolean(value.v.valueOf());
        } else if (value.v instanceof Object) {
            return !_.isEmpty(value.v);
        } else {
            return Boolean(value.v);
        }
    };

    static init_from_object(obj: BoolObject): Bool {
        return new Bool(obj.v);
    };

} 