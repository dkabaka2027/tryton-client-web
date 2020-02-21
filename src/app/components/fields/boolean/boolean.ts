import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'boolean',
	styleUrls: ['./boolean.scss'],
	template: `
		<div class="form-control-group">
			<nb-checkbox
				name="input-{{field.name}}"
				[(ngModel)]="data"
				#model="ngModel"
				(checkedChange)="toggle($event)"><label class="label" for="input-{{field.name}}">{{field.string}}</label></nb-checkbox>
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
export class BooleanComponent {

	@Input() field: FormElement;
	@Input() data: boolean;

	constructor() {}

	toggle(ev: boolean) {
		this.data = ev;
	}

}