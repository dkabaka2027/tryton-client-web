import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type GetObject = {
	v: any;
    k: any;
    d: any;
};

export class Get extends Pyson<GetObject> {
    _obj: any;
    _key: any;
    _default: any;

    constructor(obj: any, key: any, default_: any) {
        super();
        if (default_ === undefined) {
            default_ = null;
        }
        if (obj instanceof Pyson) {
            if (_.difference(obj.types(), ['object']).length > 0 || _.difference(['object'], obj.types()).length > 0) {
                throw 'obj must be a dict';
            }
        } else {
            if (!(obj instanceof Object)) {
                throw 'obj must be a dict';
            }
        }
        this._obj = obj;
        if (key instanceof Pyson) {
            if (_.difference(key.types(), ['string']).length > 0 || _.difference(['string'], key.types()).length > 0) {
                throw 'key must be a string';
            }
        } else {
            if (typeof key != 'string') {
                throw 'key must be a string';
            }
        }
        this._key = key;
        this._default = default_;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Get',
            v: this._obj,
            k: this._key,
            d: this._default
        }
    }

    types(): string[] {
        if (this._default instanceof Pyson) {
            return this._default.types();
        } else {
            return [typeof this._default];
        }
    }

    __string_params__(): string[] {
        return [this._obj, this._key, this._default];
    }

    eval_(value: GetObject, context: any) {
        if (value.k in value.v) {
            return value.v[value.k];
        } else {
            return value.d;
        }
    };

    static init_from_object(obj: GetObject): Get {
        return new Get(obj.v, obj.k, obj.d);
    };

}