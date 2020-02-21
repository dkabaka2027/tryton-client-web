import _ from 'underscore';
import { And } from './and';
import { Bool } from './bool';
import { Date } from './date';
import { DateTime } from './datetime';
import { Equal } from './equal';
import { Eval } from './eval';
import { Get } from './get';
import { Greater } from './greater';
import { If } from './if';
import { In } from './in';
import { Len } from './len';
import { Less } from './less';
import { Not } from './not';
import { Or } from './or';
import { Pyson } from './interfaces';

const Classes = {
	'And': And,
	'Bool': Bool,
	'Date': Date,
	'DateTime': DateTime,
	'Equal': Equal,
	'Eval': Eval,
	'Get': Get,
	'Greater': Greater,
	'If': If,
	'In': In,
	'Len': Len,
	'Less': Less,
	'Not': Not,
	'Or': Or
}

export class Encoder {
	prepare(value: any, index?: any, parent?: any) {
        if (value !== null && value !== undefined) {
            if (value instanceof Array) {
                value = _.extend([], value);
                for (var i = 0, length = value.length; i < length; i++) {
                    this.prepare(value[i], i, value);
                }
            } else if (value._isAMomentObject) {
                if (value.isDate) {
                    value = new Date(value.year(), value.month() + 1, value.date(), 0, 0, 0).pyson();
                } else {
                    value = new DateTime(value.year(), value.month() + 1, value.date(), value.hours(), value.minutes(), value.seconds(), value.milliseconds() * 1000, 0, 0, 0, 0, 0, 0, 0).pyson();
                }
            }
        }
        if (parent) {
            parent[index] = value;
        }
        return parent || value;
    }

    encode(pyson: any) {
        pyson = this.prepare(pyson);
        return JSON.stringify(pyson, function(k, v) {
            if (v instanceof Pyson) {
                return v.pyson();
            } else if (v === null || v === undefined) {
                return null;
            }
            return v;
        });
    }
}

export class Decoder {
	__context: any;
	noeval: boolean = false;

	constructor(context: any, noeval?: boolean) {
        this.__context = context || {};
        this.noeval = noeval || false;
    }

    decode(str: string): any {
        var reviver = function(k: any, v: any) {
            if (typeof v == 'object' && v !== null) {
                var cls = Classes[v.__class__];
                if (cls) {
                    if (!this.noeval) {
                        return cls.eval_(v, this.__context);
                    } else {
                        var args = _.extend({}, v);
                        delete args.__class__;
                        return Classes[v.__class__].init_from_object(args);
                    }
                }
            }
            return v;
        };
        return JSON.parse(str, reviver.bind(this));
    }

}