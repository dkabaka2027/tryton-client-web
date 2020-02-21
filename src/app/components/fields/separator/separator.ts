import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'separator',
	styleUrls: ['./separator.scss'],
	template: `
		<h5>{{field.string}}</h5>
		<hr />
	`
})
export class SeparatorComponent {

	@Input() field: FormElement;

	constructor() {}

}