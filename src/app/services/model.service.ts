import { Injectable } from '@angular/core';
import { HttpOptions } from '../app.constants';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Locker, DRIVERS } from 'angular-safeguard';
import { Observable, of as observableOf } from 'rxjs';
import { TrytonResponse } from './admin.resources.service';
import { Access, Fields, Field, FieldType, KeyValidation } from './index';

// Methods
const MODEL_SEARCH: string = 'model.{}.search';
const MODEL_SEARCH_READ: string = 'model.{}.search_read';
const MODEL_SEARCH_NAME: string = 'model.{}.search_rec_name';
const MODEL_READ: string = 'model.{}.read';
const MODEL_BROWSE: string = 'model.{}.browse';
const MODEL_CREATE: string = 'model.{}.create';
const MODEL_WRITE: string = 'model.{}.write';
const MODEL_DELETE: string = 'model.{}.delete';
const MODEL_COUNT: string = 'model.{}.search_count';
const MODEL_FIELDS_VIEW: string = 'model.{}.fields_view_get';
const MODEL_DEFAULT_GET: string = 'model.{}.default_get';
const MODEL_FIELDS_GET: string = 'model.{}.fields_get';
const MODEL_ON_CHANGE: string = 'model.{}.on_change';
const MODEL_ON_CHANGE_WITH: string = 'model.{}.on_change_with';
const MODEL_VIEW_TOOLBAR_GET: string = 'model.{}.view_toolbar_get';
const MODEL_VIEW_ATTRIBUTES: string = 'model.{}.view_attributes';
const MODEL_VALIDATE: string = 'model.{}.validate';
const MODEL_PRE_VALIDATE: string = 'model.{}.pre_validate';
const MODEL_IMPORT: string = 'model.{}.import_data';
const MODEL_EXPORT: string = 'model.{}.export_data';
const MODEL_CHECK_XML: string = 'model.{}.check_xml_record';
const MODEL_RESOURCES: string = 'model.{}.resources';
const MODEL_REC_NAME: string = 'model.{}.get_rec_name';
const MODEL_ACTIONS: string = 'model.{}.action';
const WIZARD_CREATE: string = 'wizard.{}.create';
const WIZARD_EXECUTE: string = 'wizard.{}.execute';
const WIZARD_DELETE: string = 'wizard.{}.delete';


// Validation
const VALIDATION_TYPE_MESSAGE: string = 'Expected {1} for backend type {2}, found {3}!';
const VALIDATION_REQUIRED_MESSAGE: string = '';
const JS_TRYTON_TYPE_MAP: any = {
	'string': [FieldType.CHAR, FieldType.TEXT, FieldType.REFERENCE],
	'number': [FieldType.FLOAT, FieldType.INTEGER, FieldType.MANY2ONE, FieldType.ONE2ONE, FieldType.MANY2MANY],
	'boolean': [FieldType.BOOLEAN],
	'Array': [FieldType.ARRAY, FieldType.ONE2MANY, FieldType.MANY2MANY],
	'Object': [FieldType.DICT, FieldType.ONE2MANY, FieldType.MANY2ONE],
	'Date': [FieldType.DATE],
	'Moment': [FieldType.DATE, FieldType.DATETIME, FieldType.TIME],
	'Duration': [FieldType.TIMEDELTA],
	'ArrayBuffer': [FieldType.BINARY]
};
const TRYTON_JS_TYPE_MAP: any = {
	char: 'string',
	text: 'string',
	reference: 'string',
	float: 'number',
	integer: 'number',
	numeric: 'number',
	boolean: 'boolean',
	array: 'Array',
	dict: ['Object', 'Map'],
	date: ['Date', 'Moment'],
	datetime: ['Date', 'Moment'],
	time: ['Moment'],
	timedelta: ['Duration'],
	binary: 'ArrayBuffer',
	one2one: ['number', 'Object', 'Map'],
	many2one: ['number', 'Object'],
	one2many: ['Array', 'Object'],
	many2many: ['Array', 'number']
};

@Injectable({
	providedIn: 'root'
})
export class ModelService {
	user: any;
	model: string;
	fields: Fields;
	access: Access[];

	constructor(protected http: HttpClient, protected locker: Locker) {
		this.user = this.locker.get(DRIVERS.LOCAL, 'user');
	}

	// TODO: Check the required keys
	private validateData(data: any[]): KeyValidation[][] {
		let keys: KeyValidation[][] = [];

		for(var i = 0; i < data.length; i++) {
			keys.push(Object.keys(data[i]).map((k: string) => {
				if(this.fields[k]) {
					if(typeof data[i][k] in JS_TRYTON_TYPE_MAP[typeof data[i][k]] ) {
						return {
							key: k,
							message: VALIDATION_TYPE_MESSAGE.replace('{1}', TRYTON_JS_TYPE_MAP[this.fields[k].type]).replace('{2}', JS_TRYTON_TYPE_MAP[typeof data[i][k]]).replace('{3}', typeof data[i][k])
						};
					}
				}
			}));
		}

		return keys;
	}

	// TODO: Confirm search domain params 
	private parseDomain(str: string): string[][] {
		let arr: string[][] = str.split('|').map((arr: string) => {
			let arra = arr.split(',');
			if(arra.length == 3) {
				return arra;
			} else if(arra.length == 4) {
				return [arra[0], arra[1], arra[2] + ',' + arra[3]];
			}
		});
		return arr.length > 1 ? arr:[[]];
	}

	// TODO: 
	public search(domain: string | any[][], offset?: number, limit?: number, order?: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
        id: Math.floor(Math.random() * 100),
				method: MODEL_SEARCH.replace('{}', this.model),
				params: [
					typeof domain == 'array' ? domain:this.parseDomain(domain),
					// Object.keys(this.fields),
					offset,
					limit,
					order == '' ? null:order,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public search_read(domain: string | any[][], offset?: number, limit?: number, order?: string, fields?: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_SEARCH_READ.replace('{}', this.model),
				params: [
					typeof domain == 'array' ? domain:this.parseDomain(domain),
					offset,
					limit,
					order == '' || order == null ? null:order,
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public search_name(name: string, clause: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_SEARCH_NAME.replace('{}', this.model),
				params: [
					name,
					clause,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public read(ids: number[], fields: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_READ.replace('{}', this.model),
				params: [
					ids,
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public browse(ids: number[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_BROWSE.replace('{}', this.model),
				params: [
					ids,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public create(data: any[]): Observable<TrytonResponse> {
		let validated: boolean = true;
		let vKeys = this.validateData(data).map((stra: KeyValidation[]) => {
			validated = validated && (stra.length > 0);
			return stra;
		});

		if(validated) {
			return this.http.post<TrytonResponse>(
				'http://localhost:4200/tryton/' + this.user.database + '/',
				{
					id: Math.floor(Math.random() * 100),
					method: MODEL_CREATE.replace('{}', this.model),
					params: [
						data,
						this.user.context
					]
				},
				HttpOptions
			);
		};

		return <Observable<TrytonResponse>> observableOf({
			id: 0,
			error: {
				message: 'Could not validated object, refer to keys missing',
				keys: vKeys
			}
		});
	}

	public write(data: any[]): Observable<TrytonResponse> {
		let validated: boolean = true;
		let vKeys = this.validateData(data).map((stra: KeyValidation[]) => {
			validated = validated && (stra.length > 0);
			return stra;
		});

		if(validated) {
			return this.http.post<TrytonResponse>(
				'http://localhost:4200/tryton/' + this.user.database + '/',
				{
					id: Math.floor(Math.random() * 100),
					method: MODEL_WRITE.replace('{}', this.model),
					params: [
						data.map((d: any) => { return d.id }),
						data,
						this.user.context
					]
				},
				HttpOptions
			);
		};

		return <Observable<TrytonResponse>> observableOf({
			id: 0,
			error: {
				message: 'Could not validated object, refer to keys missing',
				keys: vKeys
			}
		});
	}

	public delete(ids: number[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_DELETE.replace('{}', this.model),
				params: [
					ids,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public count(domain: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_COUNT.replace('{}', this.model),
				params: [
					this.parseDomain(domain),
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public view(id: number | boolean, type: string): Observable<TrytonResponse> {
		
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_FIELDS_VIEW.replace('{}', this.model),
				params: [
					id,
					type,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public view_toolbar(): Observable<TrytonResponse> {
		
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_VIEW_TOOLBAR_GET.replace('{}', this.model),
				params: [
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public view_attributes(): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_VIEW_ATTRIBUTES.replace('{}', this.model),
				params: [
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public default_get(fields: string[], with_rec_name?: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_DEFAULT_GET.replace('{}', this.model),
				params: [
					fields,
					with_rec_name,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public fields_get(fields: string[], level: number): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_FIELDS_GET.replace('{}', this.model),
				params: [
					fields,
					level,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public on_change(fields: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_ON_CHANGE.replace('{}', this.model),
				params: [
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public on_change_with(fields: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_ON_CHANGE_WITH.replace('{}', this.model),
				params: [
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public validate(records: any[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_VALIDATE.replace('{}', this.model),
				params: [
					records,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public pre_validate(): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_PRE_VALIDATE.replace('{}', this.model),
				params: [
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public import(records: any[], fields: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_IMPORT.replace('{}', this.model),
				params: [
					records,
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public export(records: any[], fields: string[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_EXPORT.replace('{}', this.model),
				params: [
					records,
					fields,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public check_xml_record(records: any[], values: any[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_CHECK_XML.replace('{}', this.model),
				params: [
					records,
					values,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public resources(): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_RESOURCES.replace('{}', this.model),
				params: [

					this.user.context
				]
			},
			HttpOptions
		);
	}

	public rec_name(name: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_REC_NAME.replace('{}', this.model),
				params: [
					name,
					this.user.context
				]
			},
			HttpOptions
		);
	}

	public actions(): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: MODEL_ACTIONS.replace('{}', this.model),
				params: [

					this.user.context
				]
			},
			HttpOptions
		);
	}

	public wizard_create(): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: WIZARD_CREATE.replace('{}', this.model),
				params: [
					this.user.context
				]
			}
		)
	}

	public wizard_execute(id: number, obj: any, action: string): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: WIZARD_EXECUTE.replace('{}', this.model),
				params: [
					id,
					obj,
					action,
					this.user.context
				]
			}
		)
	}

	public wizard_delete(id: number): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: WIZARD_DELETE.replace('{}', this.model),
				params: [
					id,
					this.user.context
				]
			}
		)
	}

	public invoke(method: string, params: any[]): Observable<TrytonResponse> {
		return this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: 'model.' + this.model + '.' + method,
				params: params
			},
			HttpOptions
		);
	}

	public setModel(m: string): void {
		this.model = m;
	}

	public getModel(): string {
		return this.model;
	}

	public setFields(f: Fields): void {
		this.fields = f;
	}

	public getFields(): Fields {
		return this.fields;
	}

}