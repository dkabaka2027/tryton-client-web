import { FormElement } from '../../../services/index';;
import { Component, Input, Output } from '@angular/core';

// TODO: Search field or New Button Form
@Component({
	selector: 'one2one',
	styleUrls: ['./one2one.scss'],
	template: `
		<div class="form-control-group">
  		<label class="label" for="input-{{field.name}}">{{field.string}}</label>
  		<ng-container *ngFor="let key of keys">
    		<label class="label" for="input-{{field.schema[key].name}}">{{field.schema[key].string}}</label>
				<input
					nbInput
					fullWidth
					[(ngModel)]="data"
					#model="ngModel"
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
export class One2OneComponent {

	@Input() field: FormElement;
	@Input() data: any;

	keys: string[];

	constructor() {
		this.keys = Object.keys(this.field.schema)
	}

}