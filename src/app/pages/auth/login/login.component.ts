import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NbLoginComponent } from '@nebular/auth';
import { Locker, DRIVERS } from 'angular-safeguard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { HttpOptions, INACTIVE_TIMEOUT, TIMEOUT } from '../../../app.constants';
import { NbAuthService, NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends NbLoginComponent {
	databases: string[] = [];
	user: any = {};
	session: any = {};
  token: any = {}

	constructor(protected http: HttpClient, protected locker: Locker, protected service: NbAuthService, @Inject(NB_AUTH_OPTIONS) protected options = {}, protected cd: ChangeDetectorRef, protected router: Router) {
    super(service, options, cd, router);

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');

    this.fetchDatabases();
  }

  loadAllFromStorage() {
  	this.session = this.locker.get(DRIVERS.LOCAL, 'user');
    this.token = this.locker.get(DRIVERS.LOCAL, 'token');
  }

  setSession(user: any) {
  	this.locker.set(DRIVERS.LOCAL, 'user', user || null);
  	// TODO: Compute Base64 of {username}:{id}:{token}
  	const token: string = window.btoa(unescape(encodeURIComponent(user.username + ':' + user.id + ':' + user.token)));
    this.session = {
      token,
      timestamp: user.timestamp
    };
  	this.locker.set(DRIVERS.LOCAL, 'token', this.session);

  	this.loadAllFromStorage();
  }

	login(): void {
		this.errors = [];
    this.messages = [];
    this.session = {};
    this.submitted = true;

    this.http.post(
    	"http://localhost:4200/tryton/" + this.user.database + "/",
    	{
    		id: 0,
    		method: 'common.db.login',
    		params: [this.user.username, {password: this.user.password}]
    	},
    	HttpOptions
    ).subscribe((res: any) => {
    	this.submitted = false;

    	console.log(res);

      this.user = {
      	database: this.user.database,
      	username: this.user.username,
      	id: res['result'][0],
      	token: res['result'][1],
        timestamp: new Date()
      };

      this.setSession(this.user);


      this.http.post(
        'http://localhost:4200/tryton/' + this.user.database + '/',
        {
          id: 0,
          method: 'model.res.user.get_preferences',
          params: [
            true,
            {}
          ]
        },
        HttpOptions
      ).subscribe((r: any) => {
        this.user.context = r.result;
        this.setSession(this.user);
        
        this.messages.push("Successfully logged in!");

  	    this.http.post<TrytonResponse>(
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
        ).pipe(
          map((response: TrytonResponse) => {
              this.locker.set(DRIVERS.LOCAL, 'preferences', response.result);

              const redirect = '/admin';
              if (redirect) {
                setTimeout(() => {
                  return this.router.navigateByUrl(redirect);
                }, this.redirectDelay);
              }

        	    this.cd.detectChanges();

              return res;
            },
            catchError((res: TrytonResponse) => {
              return observableOf(res);
            })
          )
        ).subscribe();
      });

    },
    (error) => {
    	this.errors = error['error'][0];
    });
	}

	fetchDatabases(): void {
		this.http.post(
    	"http://localhost:4200/tryton/",
    	{
    		id: 0,
    		method: 'common.db.list',
    		params: []
    	},
    	HttpOptions
    ).subscribe((res: any) => {
    	this.submitted = false;

      this.databases = res['result'];

      if(this.databases.length == 1) {
      	this.user.database = this.databases[0];
      }

      // console.log(this.user.database);

      this.messages.push("Fetched databases from backend!");

	    this.cd.detectChanges();
    },
    (error) => {
    	this.errors = error['error'][0];
    });
	}

}