import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';

@Component({
	selector: 'selection',
	styleUrls: ['./selection.scss'],
	template: `
		<div class="form-control-group">
  		<label class="label" for="input-{{field.name}}">{{field.string}}</label>
			<nb-select
				[disabled]="field.selection.length == 1" 
				fullWidth
				[(ngModel)]="data"
				#model="ngModel"
				name="input-{{field.name}}"
				id="input-{{field.name}}"
				[placeholder]="field.string"
				autofocus
				[required]="field.required"
				[attr.aria-invalid]="model.invalid && model.touched ? true : null"
				[(selected)]="data">
				<nb-option *ngFor="let selection of field.selection" value="{{selection[0]}}">{{selection[1]}}</nb-option>
			</nb-select>
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
export class SelectionComponent {

	@Input() field: FormElement;
	@Input() data: string;

	constructor() {}

}