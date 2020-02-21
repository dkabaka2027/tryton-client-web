export type PysonObject = {
	__class__: string;
	[k: string]: any;
}

export abstract class Pyson<T> {

	abstract pyson(): PysonObject;
    
    abstract types(): string[];
    
    toString(): string {
        var klass = this.pyson().__class__;
        var args = this.__string_params__().map((p: any) => {
            if (p instanceof Pyson) {
                return p.toString();
            } else {
                return JSON.stringify(p);
            }
        });
        return klass + '(' + args.join(', ') + ')';
    }

    abstract __string_params__(): string[];

	abstract eval_(value: any, context: any): any;

	abstract static init_from_object(obj: any): Pyson<any>;

} 