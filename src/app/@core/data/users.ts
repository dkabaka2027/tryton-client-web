import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpOptions } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { DRIVERS, Locker } from 'angular-safeguard';
import { TrytonResponse } from '../../services/admin.resources.service';

export interface User {
  name: string;
  picture: string;
}

export interface Contacts {
  user: User;
  type: string;
}

export interface RecentUsers extends Contacts {
  time: number;
}

@Injectable({
	providedIn: 'root'
})
export class UserData {

	user: any;

	constructor(protected http: HttpClient, protected locker: Locker) {
		this.user = this.locker.get(DRIVERS.LOCAL, 'user');
	}

  getPreferences(): Observable<TrytonResponse> {
  	return this.http.post<TrytonResponse>(
  		'http://localhost:4200/tryton/' + this.user.database + '/',
  		{
  			id: this.user.id,
  			method: 'model.res.user.get_preferences',
  			params: [
  				false,
  				this.user.context
  			]
  		},
  		HttpOptions
  	);
  }

  getUser(): Observable<TrytonResponse> {
  	return this.http.post<TrytonResponse>(
  		'http://localhost:4200/tryton/' + this.user.database + '/',
  		{
  			id: this.user.id,
  			method: 'model.res.user.read',
  			params: [
  				[this.user.id],
  				[
  					'name',
  					'login',
  					'signature',
  					'active',
  					'menu',
  					'pyson_menu',
  					'actions',
  					'groups',
  					'applications',
  					'language',
  					'language_direction',
  					'email',
  					'status_bar',
  					'warnings',
  					'dashboard_layout'
  				],
  				this.user.context
  			]
  		},
  		HttpOptions
  	);
  }

  // abstract getRecentUsers(): Observable<RecentUsers[]>;
}
