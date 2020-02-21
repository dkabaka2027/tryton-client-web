import { HttpHeaders } from '@angular/common/http';

export const INACTIVE_TIMEOUT: number = 300000;
export const TIMEOUT: number = 2592000000;

export const HttpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	})
};