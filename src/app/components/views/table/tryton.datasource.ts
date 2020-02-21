import { of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { Domain, Fields } from '../../../services/index';
// import { subscribeToPromise } from 'rxjs/internal/util';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';

const MAX_MODEL_LIMIT: number = 10000;

@Injectable({
	providedIn: 'root'
})
export class TrytonDatasource extends LocalDataSource {
	private model: string;
	private domain: Domain[];
	private fields: Fields;
	private offset: number;
	private limit: number;
	private order: string;

	constructor(public modelService: ModelService) {
		super();
	}

	getAll(): Promise<any> {
		return this.modelService.search(this.getFilter(), 0, MAX_MODEL_LIMIT, this.getSort()).pipe(
			map((res: TrytonResponse) => {
				return this.modelService.read(res.result, Object.keys(this.fields));
			}),
			catchError((res: TrytonResponse) => {
				return observableOf(res);
			})
		).toPromise();
	}

    getElements(): Promise<any> {
    	return this.modelService.search(this.getFilter(), this.getPaging()-1, this.count(), this.getSort()).pipe(
    		map((res: TrytonResponse) => {
    			return this.modelService.read(res.result, Object.keys(this.fields));
    		}),
    		catchError((res: TrytonResponse) => {
    			return observableOf(res);
    		})
    	).toPromise();
    }

    getSort(): any {
    	return this.order;
    }

    getFilter(): any {
    	var filter: string = '';
    	for(var i = 0; i < this.domain.length; i++) {
    		filter += this.domain[i].field + ',' + this.domain[i].op + ',' + this.domain[i].comp + '|';
    	}
    	return filter;
    }

    getPaging(): any {
    	return this.offset + 1;
    }

    count(): number {
    	return this.limit;
    }

    remove(id: number): Promise<any> {
    	return this.modelService.delete([id]).toPromise();
    }

    public setModel(m: string) {
    	this.model = m;
    	this.modelService.setModel(m);
    }

    public getModel(): string {
    	return this.modelService.getModel();
    }

    public setFields(f: Fields) {
    	this.fields = f;
    }

    public getFields(): Fields {
    	return this.fields;
    }

}