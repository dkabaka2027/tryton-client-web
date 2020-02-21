import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type IfObject = {
	c: any;
    t: any;
    e: any;
};

export class If extends Pyson<IfObject> {
    _condition: any;
    _then_statement: any;
    _else_statement: any;

    constructor(condition: any, then_statement: any, else_statement: any) {
        super();
        if (condition instanceof Pyson) {
            if (_.difference(condition.types(), ['boolean']).length > 0 || _.difference(['boolean'], condition.types()).length > 0) {
                throw 'condition must be boolean';
            }
        } else {
            if (typeof condition != 'boolean') {
                throw 'condition must be boolean';
            }
        }
        var then_types, else_types;
        if (then_statement instanceof Pyson) {
            then_types = then_statement.types();
        } else {
            then_types = [typeof then_statement];
        }
        if (else_statement === undefined) {
            else_statement = null;
        }
        if (else_statement instanceof Pyson) {
            else_types = else_statement.types();
        } else {
            else_types = [typeof else_statement];
        }
        if (_.difference(then_types, else_types).length > 0 || _.difference(else_types, then_types).length > 0) {
            throw 'then and else statements must be the same type';
        }
        this._condition = condition;
        this._then_statement = then_statement;
        this._else_statement = else_statement;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Eval',
            c: this._condition,
            t: this._then_statement,
            e: this._else_statement
        }
    }

    types(): string[] {
        if (this._then_statement instanceof Pyson) {
            return this._then_statement.types();
        } else {
            return [typeof this._then_statement];
        }
    }

    __string_params__(): string[] {
        return [this._condition, this._then_statement, this._else_statement];
    }

    eval_(value: IfObject, context: any) {
        if (value.c) {
            return value.t;
        } else {
            return value.e;
        }
    };

    static init_from_object(obj: IfObject): If {
        return new If(obj.c, obj.t, obj.e);
    };

}