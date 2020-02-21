import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type InObject = {
	v: any;
    k: any;
    d: any;
};

export class In extends Pyson<InObject> {
    _obj: any;
    _key: any;

    constructor(key: any, obj: any) {
        super();
        if (key instanceof Pyson) {
            if (_.difference(key.types(), ['string', 'number']).length > 0) {
                throw 'key must be a string or a number';
            }
        } else {
            if (!~['string', 'number'].indexOf(typeof key)) {
                throw 'key must be a string or a number';
            }
        }
        if (obj instanceof Pyson) {
            if (_.difference(obj.types(), ['object']).length > 0 || _.difference(['object'], obj.types()).length > 0) {
                throw 'obj must be a dict or a list';
            }
        } else {
            if (!(obj instanceof Object)) {
                throw 'obj must be a dict or a list';
            }
        }
        this._key = key;
        this._obj = obj;
    }

    pyson(): PysonObject {
        return {
            __class__: 'In',
            v: this._obj,
            k: this._key
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._obj, this._key];
    }

    eval_(value: InObject, context: any): boolean {
        if (value.v.indexOf) {
            return Boolean(~value.v.indexOf(value.k));
        } else {
            return !!value.v[value.k];
        }
    };

    static init_from_object(obj: InObject): In {
        return new In(obj.k, obj.v);
    };

}