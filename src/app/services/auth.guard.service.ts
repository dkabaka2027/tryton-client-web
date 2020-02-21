import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Locker, DRIVERS } from 'angular-safeguard';
import { INACTIVE_TIMEOUT, TIMEOUT } from '../app.constants';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(protected locker: Locker, protected router: Router) {}

	canActivate() {
		// Get Session Token
		const token: any = this.locker.get(DRIVERS.LOCAL, 'token');

		// Check if token is valid (RPC call to backend or compute duration from last login timestamp)
		if(token != null) {
			const now = moment.now();
			const timestamp = moment(token['timestamp']);
			const diff = timestamp.diff(now);

			if (INACTIVE_TIMEOUT > diff || TIMEOUT > diff) {
				return true;
			} else {
				this.router.navigate(['auth']);
				return false;
			}
		}
	}
}