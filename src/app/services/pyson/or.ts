import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type OrObject = {
	s: any[];
};

export class Or extends Pyson<OrObject> {
    _statements: any[];

    constructor(statements: any[]) {
        super();
        if (statements === undefined) {
            statements = [];
        }
        for (var i = 0, len = statements.length; i < len; i++) {
            var statement = statements[i];
            if (statement instanceof Pyson) {
                if (_.difference(statement.types(), ['boolean']).length > 0 || _.difference(['boolean'], statement.types()).length > 0) {
                    throw 'statement must be boolean';
                    }
            } else {
                if (typeof statement != 'boolean') {
                    throw 'statement must be boolean';
                }
            }
        }
        if (statements.length < 2) {
            throw 'must have at least 2 statements';
        }
        this._statements = statements;
    }

    pyson(): PysonObject {
        return {
            __class__: 'Or',
            s: this._statements
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return this._statements;
    }

    eval_(value: OrObject, context: any): boolean {
        var result = false;
        for (var i = 0, len = value.s.length; i < len; i++) {
            var statement = value.s[i];
            result = result || statement;
        }
        return result;
    };

    static init_from_object(obj: OrObject): Or {
        return new Or(obj.s);
    };

}