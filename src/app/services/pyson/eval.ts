import { Pyson, PysonObject } from './interfaces';

type EvalObject = {
	v: string;
	d: string;
};

export class Eval extends Pyson<EvalObject> {
	_value: any;
	_default: any;

	constructor(value: string, default_: string) {
        super();
		if (default_ === undefined) {
            default_ = '';
        }
        
        this._value = value;
        this._default = default_;
	}

	pyson(): PysonObject {
        return {
            __class__: 'Eval',
            v: this._value,
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
        return [this._value.toString(), this._default.toString()];
    }

	eval_(value: EvalObject, context: any) {
		if (value.v in context) {
            return context[value.v];
        } else {
            return value.d;
        }
	}

	static init_from_object(obj: EvalObject): Eval {
		return new Eval(obj.v, obj.d);
	}

}