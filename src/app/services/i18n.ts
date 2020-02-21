import i18n from 'gettext.js';
import * as moment from 'moment';
import { Locker } from 'angular-safeguard';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class I18n {

	data: any;

	constructor(protected http: HttpClient, protected locker: Locker) {}

	setlang(lang?: string) {
        if (!lang) {
            lang = (navigator.language || navigator['browserLanguage'] || navigator['userLanguage'] || 'en').replace('-', '_');
        }

        this.setLocale(lang);
        moment.locale(lang.slice(0, 2));
        return this.http.get('http://localhost:4200/tryton/locale/' + lang + '.json')
    		.subscribe((data: any) => {
	            if (!data[''].language) {
	                data[''].language = lang;
	            }
	            if (!data['']['plural-forms']) {
	                data['']['plural-forms'] = 'nplurals=2; plural=(n!=1);';
	            }
	            // gettext.js requires to dump untranslated keys
	            for (var key in data) {
	                if ('' === key) {
	                    continue;
	                }
	                data[key] = 2 == data[key].length ? data[key][1] : data[key].slice(1);
	            }
	            this.loadJSON(data);
	        });
    };

    getlang(): string {
        return i18n.getLocale();
    };

    setLocale(lang: string): void {
    	i18n.setLocale(lang);
    }

    getLocale(): string {
    	return i18n.getLocale();
    }

    loadJSON(json: string): void {
    	this.data = i18n.loadJSON(json);
    }

    getText(msgid: string, ...args: string[]): string {
        console.log(i18n);
        let formatted = msgid
       // put space after double % to prevent placeholder replacement of such matches
       .replace(/%%/g, '%% ')
       // replace placeholders
       .replace(/%(\d+)/g, function (str, p1) {
         return args[p1];
       })
       // replace double % and space with single %
       .replace(/%% /g, '%');

    	return i18n.gettext(formatted);
    }

}