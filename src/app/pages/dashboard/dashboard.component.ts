import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'dashboard',
	styleUrls: ['./dashboard.component.scss'],
	template: `
		<router-outlet></router-outlet>
	`
})
export class DashboardComponent implements OnInit, OnDestroy {

	constructor() {}

	ngOnInit() {
		return;
	}

	ngOnDestroy() {
		return;
	}

	

}