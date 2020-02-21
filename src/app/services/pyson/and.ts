import _ from 'underscore';
import { Pyson, PysonObject } from './interfaces';

type AndObject = {
	s: any[];
};

export class And extends Pyson<AndObject> {
	_statements: string[];

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
            __class__: 'And',
            s: this._statements
        }
    }

    types(): string[] {
        return ['boolean'];
    }

    __string_params__(): string[] {
        return this._statements;
    }

    eval_(value: AndObject, context: any): boolean {
        var result = true;
        for (var i = 0, len = value.s.length; i < len; i++) {
            var statement = value.s[i];
            result = result && statement;
        }
        return result;
    };

    static init_from_object(obj: AndObject): And {
        return new And(obj.s);
    };

} 