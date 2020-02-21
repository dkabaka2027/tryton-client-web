import { FormElement } from '../../services/index';
import { Component, Input, Output } from '@angular/core'

@Component({
	selector: 'field',
	templateUrl: './field.Component.html'
})
export class FieldComponent {

	@Input() field: FormElement;
	@Input() data: any;

	constructor() {}

}