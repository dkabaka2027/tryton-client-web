import _ from 'underscore';
import * as moment from 'moment';
import { compare } from '../../utils';
import { Pyson, PysonObject } from './interfaces';

type EqualObject = {
	s1: any;
    s2: any;
};

export class Equal extends Pyson<EqualObject> {
    _statement1: any;
    _statement2: any;

    constructor(statement1: any, statement2: any) {
        super();
        var types1, types2;
        if (statement1 instanceof Pyson) {
            types1 = statement1.types();
        } else {
            types1 = [typeof statement1];
        }
        if (statement2 instanceof Pyson) {
            types2 = statement2.types();
        } else {
            types2 = [typeof statement2];
        }
        if (_.difference(types1, types2).length > 0 || _.difference(types2, types1).length > 0) {
            throw 'statements must have the same type';
        }
        this._statement1 = statement1;
        this._statement2 = statement2;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Equal',
            s1: this._statement1,
            s2: this._statement2
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return [this._statement1, this._statement2];
    }

    eval_(value: EqualObject, context: any): boolean {
        if (value.s1 instanceof Array && value.s2 instanceof Array) {
            return compare(value.s1, value.s2);
        } else if (moment.isMoment(value.s1) && moment.isMoment(value.s2)) {
            return ((moment.isDate(value.s1) == moment.isDate(value.s2)) && (moment.isDate(value.s1) == moment.isDate(value.s2)) && (value.s1.valueOf() == value.s2.valueOf()));
        } else {
            return value.s1 == value.s2;
        }
    };

    static init_from_object(obj: EqualObject): Equal {
        return new Equal(obj.s1, obj.s2);
    };

}