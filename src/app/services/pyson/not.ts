import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type NotObject = {
	v: any;
};

export class Not extends Pyson<NotObject> {
	_value: any;

	constructor(value: any) {
        super();
        if (value instanceof Pyson) {
            if (_.difference(value.types(), ['boolean', 'object']).length > 0 || _.difference(['boolean'], value.types()).length > 0) {
                throw 'value must be boolean';
        	}
        } else {
            if (typeof value != 'boolean') {
                throw 'value must be boolean';
            }
        }
        this._value = value;
	}

    pyson(): PysonObject {
        return {
            __class__: 'Not',
            v: this._value
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._value];
    }

	eval_(value: NotObject, context: any) {
        return !value.v;
	}

	static init_from_object(obj: NotObject) {
		return new Not(obj.v);
	}

}