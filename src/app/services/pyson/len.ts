import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type LenObject = {
	v: any;
};

export class Len extends Pyson<LenObject> {
    _value: any;

    constructor(value: any) {
        super();
        if (value instanceof Pyson) {
            if (_.difference(value.types(), ['object', 'string']).length > 0 || _.difference(['object', 'string'], value.types()).length > 0) {
                throw 'value must be an object or a string';
            }
        } else {
            if ((typeof value != 'object') && (typeof value != 'string')) {
                throw 'value must be an object or a string';
            }
        }
        this._value = value;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Len',
            v: this._value
        }
    }

    types(): string[] {
        return ['integer'];
    }

    __string_params__(): string[] {
        return [this._value];
    }

    eval_(value: LenObject, context: any) {
        if (typeof value.v == 'object') {
            return Object.keys(value.v).length;
        } else {
            return value.v.length;
        }
    };

    static init_from_object(obj: LenObject) {
        return new Len(obj.v);
    };

}