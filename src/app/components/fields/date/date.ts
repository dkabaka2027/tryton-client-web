import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'date',
	styleUrls: ['./date.scss'],
	template: `
		<div class="form-control-group">
  		<label *ngIf="field.label" class="label" for="input-{{field.name}}">{{field.string}}</label>
			<input
				nbInput
				fullWidth
				[(ngModel)]="data"
				#model="ngModel"
				name="input-{{field.name}}"
				id="input-{{field.name}}"
				[placeholder]="field.string"
				[nbDatepicker]="formpicker">
    	<nb-datepicker #formpicker></nb-datepicker>
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
export class DateComponent {

	@Input() field: FormElement;
	@Input() data: string;

	constructor() {}

}