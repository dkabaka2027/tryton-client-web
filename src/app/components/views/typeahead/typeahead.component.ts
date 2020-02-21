import { DRIVERS, Locker } from 'angular-safeguard';
import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'typeahead',
	styleUrls: ['./typeahead.component.scss'],
	templateUrl: './typeahead.component.html'
})
export class TypeaheadComponent implements OnInit, OnDestroy {

	@Input() model: string;

	user: any;

	url: string = 'http://localhost:4200/tryton/'
	params: any = {
		method: 'model.' + this.model + '.search',
		params: [
			,
			this.user.context
		]
	};

	data: string;

	constructor(protected locker: Locker) {
		this.user = this.locker.get(DRIVERS.LOCAL, 'user');
	}


	ngOnInit() {
		return;
	}

	ngOnDestroy() {
		return;
	}

	// TODO: Refactor to value to model
	select(result: any) {
		this.data = result;
	}

}