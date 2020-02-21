import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Locker, DRIVERS } from 'angular-safeguard';
import { of as observableOf, Observable } from 'rxjs';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TrytonInterceptor implements HttpInterceptor {

	constructor(protected locker: Locker, protected toastrService: NbToastrService, protected router: Router) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authToken: any = this.locker.get(DRIVERS.LOCAL, 'token') || null;
		var authReq: HttpRequest<any> = null;

		if(authToken != null) {
			authReq = req.clone({
				headers: req.headers.set('Authorization', 'Session ' + authToken.token)
			});
		}

		return authReq != null ? next.handle(authReq).pipe(
			map((event: any) => {
				var message: string;
				var title: string;
				var status: NbComponentStatus;
				if(event instanceof HttpResponse) {
					if(event.status >= 200 && event.status < 300) {
						message = 'Successfully called Fabric API!';
				  	title = 'OK';
				  	status = 'success';
				  	this.toastrService.show(message, title, {
				    	duration: 5000,
				    	status: status
				    });
					}
				}
				return event;
			}), catchError((err: any) => {
				var message: string;
				var title: string;
				var status: NbComponentStatus;
			  if(err instanceof HttpErrorResponse) {
			  	if(err.status == 401) {
			    	message = 'Session expired, kindly login and try again!';
			    	title = err.statusText;
			    	status = 'danger';
			    	this.toastrService.show(message, title, {
				    	duration: 5000,
				    	status: status
				    });
			      this.router.navigate(['/auth']);
			  	} else if(err.status > 401 && err.status < 500) {
			  		message = 'Unable to call API, kindly try again!';
			  		title = err.statusText;
			  		status = 'danger';
			    	this.toastrService.show(message, title, {
				    	duration: 5000,
				    	status: status
				    });
			    	this.router.navigate(['/auth']);
			  	} else if(err.status == 500) {
			  		message = 'Something went wrong with the Fabric server, kindly contact system admin!';
			  		title = err.statusText;
			  		status = 'danger';
			    	this.toastrService.show(message, title, {
				    	duration: 5000,
				    	status: status
				    });
			  	}	          
			  }
			  return observableOf(err);
		})):next.handle(req).pipe(map((event: any) => {
			var message: string;
			var title: string;
			var status: NbComponentStatus;
			if(event instanceof HttpResponse) {
				if(event.status >= 200 && event.status < 300) {
					message = 'Successfully called Fabric API!';
			  	title = 'OK';
			  	status = 'success';
			  	this.toastrService.show(message, title, {
			    	duration: 5000,
			    	status: status
			    });
				}
			}
			return event;
		}), catchError((err: any) => {
			var message: string;
			var title: string;
			var status: NbComponentStatus;
		  if(err instanceof HttpErrorResponse) {
		  	if(err.status == 401) {
		    	message = 'Session expired, kindly login and try again!';
		    	title = err.statusText;
		    	status = 'danger';
		    	this.toastrService.show(message, title, {
			    	duration: 5000,
			    	status: status
			    });
		      this.router.navigate(['/auth']);
		  	} else if(err.status > 401 && err.status < 500) {
		  		message = 'Unable to call API, kindly try again!';
		  		title = err.statusText;
		  		status = 'danger';
		    	this.toastrService.show(message, title, {
			    	duration: 5000,
			    	status: status
			    });
		    	this.router.navigate(['/auth']);
		  	} else if(err.status == 500) {
		  		message = 'Something went wrong with the Fabric server, kindly contact system admin!';
		  		title = err.statusText;
		  		status = 'danger';
		    	this.toastrService.show(message, title, {
			    	duration: 5000,
			    	status: status
			    });
		  	}	          
		  }
		  return observableOf(err);
		}));
	}

}