import { Configuration } from './index';
import { of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Locker, DRIVERS } from 'angular-safeguard';

const KEY: string = 'config';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationService {
	config: Configuration;

	constructor(protected locker: Locker, protected http: HttpClient) {
		this.readConfig();
	}

	readConfig(): void {
		this.http.get<string>(
			'http://localhost:4200/config.json', 
		)
		.pipe(
			map((res: string) => {
				this.config = <Configuration> JSON.parse(res);
				this.setConfig(this.config);
			}),
			catchError((e: any) => {
				return observableOf(e.error);
			})
		)
		.subscribe()
	}

	public setConfig(c: Configuration): void {
		this.locker.set(DRIVERS.LOCAL, KEY, this.config);
	}

	public getConfig(): Configuration {
		return <Configuration> this.locker.get(DRIVERS.LOCAL, KEY);
	}

}