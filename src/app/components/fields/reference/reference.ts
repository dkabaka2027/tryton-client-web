import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'reference',
	styleUrls: ['./reference.scss'],
	template: `
		<div class="form-control-group">
  		<label *ngIf="field.label" class="label" for="input-{{field.name}}">{{field.string}}</label>
  		<input nbInput
  			type="text"
           	fullWidth
           	[(ngModel)]="data"
           	#model="ngModel"
           	name="input-{{field.name}}"
           	id="input-{{field.name}}"
           	pattern=".\w+"
           	[placeholder]="field.string"
           	autofocus
           	[status]="model.dirty ? (model.invalid  ? 'danger' : 'success') : ''"
           	[required]="field.required"
           	[attr.aria-invalid]="model.invalid && model.touched ? true : null">
			<p>{{field.help}}</p>
	    <ng-container *ngIf="model.invalid && model.touched">
	      <p class="error-message" *ngIf="model.errors?.required">
	        {{field.string}} is required!
	      </p>
	      <p class="error-message" *ngIf="model.errors?.pattern">
	        {{field.string}} should be the real one!
	      </p>
	    </ng-container>
		</div>
	`
})
export class ReferenceComponent {

	@Input() field: FormElement;
	@Input() data: string;

	constructor() {}

}