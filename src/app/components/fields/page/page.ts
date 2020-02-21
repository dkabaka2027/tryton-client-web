import { FormElement } from '../../../services/index';;
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'page',
	styleUrls: ['./page.scss'],
	template: `
		<nb-tab tabTitle="title">
			<ng-content></ng-content>
		</nb-tab>
	`
})
export class PageComponent {

	@Input() title: string;
	@Input() field: FormElement;

	constructor() {}

}