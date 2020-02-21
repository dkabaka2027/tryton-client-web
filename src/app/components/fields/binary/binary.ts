import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'binary',
	styleUrls: ['./binary.scss'],
	template: `
		<div class="form-control-group">
  		<label class="label" *ngIf="field.label" for="input-{{field.name}}">{{field.string}}</label>
			<input type="file"
				nbInput
				fullWidth
				[(ngModel)]="data"
				#model="ngModel"
				status="basic"
				[placeholder]="name" />
			<p>{{field.help}}</p>
			<ng-container *ngIf="model.invalid && model.touched">
		      <p class="error-message" *ngIf="model.errors?.required">
		        {{field.string}} is required!
		      </p>
		      <p class="error-message" *ngIf="model.errors?.pattern">
		        {{field.string}} should be selected!
		      </p>
		    </ng-container>
		</div>
	`
})
// TODO: Extend nebular input to work with form input
export class BinaryComponent {

	@Input() field: FormElement;
	@Input() data: ArrayBuffer;

	constructor() {}

}