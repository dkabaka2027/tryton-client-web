import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type GreaterObject = {
	s1: number;
    s2: number;
    e: boolean;
};

export class Greater extends Pyson<GreaterObject> {
    _statement1: number;
    _statement2: number;
    _equal: boolean;

    constructor(statement1: any, statement2: any, equal: boolean) {
        super();
        var statements: any[] = [statement1, statement2];
        for (var i = 0; i < 2; i++) {
            var statement: any = statements[i];
            if (statement instanceof Pyson) {
                if (_.difference(statement, ['number']).length > 0) {
                    throw 'statement must be an integer or a float';
                }
            } else {
                if (!~['number', 'object'].indexOf(typeof statement)) {
                    throw 'statement must be an integer or a float';
                }
            }
        }
        if (equal === undefined) {
            equal = false;
        }
        if (equal instanceof Pyson) {
            if (_.difference(equal.types(), ['boolean']).length > 0 || _.difference(['boolean'], equal.types()).length > 0) {
                throw 'equal must be boolean';
            }
        } else {
            if (typeof equal != 'boolean') {
                throw 'equal must be boolean';
            }
        }
        this._statement1 = statement1;
        this._statement2 = statement2;
        this._equal = equal;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Greater',
            s1: this._statement1,
            s2: this._statement2,
            e: this._equal
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._statement1.toString(), this._statement2.toString(), this._equal.toString()];
    }

    static _convert(value: GreaterObject) {
        value = _.extend({}, value);
        value.s1 = Number(value.s1);
        value.s2 = Number(value.s2);
        return value;
    };

    eval_(value: GreaterObject, context: any): boolean {
        value = Greater._convert(value);
        if (value.e) {
            return value.s1 >= value.s2;
        } else {
            return value.s1 > value.s2;
        }
    };

    static init_from_object(obj: GreaterObject): Greater {
        return new Greater(obj.s1, obj.s2, obj.e);
    };

}