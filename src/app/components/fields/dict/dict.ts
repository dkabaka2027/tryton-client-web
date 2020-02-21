import { Field } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'dict',
	styleUrls: ['./dict.scss'],
	template: `
		<div class="form-control-group">
  		<label *ngIf="field.label" class="label" for="input-{{field.name}}">{{field.string}}</label>
  		<ng-container *ngFor="let key of keys">
    		<label class="label" for="input-{{field.schema[key].name}}">{{field.schema[key].string}}</label>
				<input
					nbInput
					fullWidth
					[(ngModel)]="data"
					#model="ngModel"
					name="input-{{field.name}}"
					id="input-{{field.name}}"
					[placeholder]="field.schema[key].string">
			<p>{{field.schema[key].help}}</p>
  		</ng-container>
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
export class DictComponent {

	@Input() field: Field;
	@Input() data: any;

	keys: string[];

	constructor() {
		this.keys = Object.keys(this.field.schema);
	}

}