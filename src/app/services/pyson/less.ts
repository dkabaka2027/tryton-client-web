import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type LessObject = {
	s1: any;
    s2: any;
    e: boolean;
};

export class Less extends Pyson<LessObject> {
    _statement1: any;
    _statement2: any;
    _equal: boolean;

    constructor(statement1: any, statement2: any, equal: boolean) {
        super();
        var statements: any[] = [statement1, statement2];
        for (var i = 0; i < 2; i++) {
            var statement: any = statements[i];
            if (statement instanceof Pyson) {
                if (_.difference(statement.types(), ['number']).length > 0) {
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
            __class__: 'Less',
            s1: this._statement1,
            s2: this._statement2,
            e: this._equal
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._statement1, this._statement2, this._equal];
    }

    static _convert(value: LessObject) {
        value = _.extend({}, value);
        value.s1 = Number(value.s1);
        value.s2 = Number(value.s2);
        return value;
    };

    eval_(value: any, context: any): boolean {
        value = Less._convert(value);
        if (value.e) {
            return value.s1 <= value.s2;
        } else {
            return value.s1 < value.s2;
        }
    };

    static init_from_object(obj: LessObject): Less {
        return new Less(obj.s1, obj.s2, obj.e);
    };

}