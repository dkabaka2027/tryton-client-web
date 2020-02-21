import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { PointDialogComponent } from '../../../components/dialogs/point/point.dialog.component';

// TODO: New dialog that opens up map for selecting point
@Component({
	selector: 'point',
	styleUrls: ['./point.scss'],
	template: `
		<div class="form-control-group">
  		<label *ngIf="field.label" class="label" for="input-{{field.name}}">{{field.string}}</label>
  		<button nbButton (click)="open($event)">Click to set {{field.string}}</button>
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
export class PointComponent {

	@Input() field: FormElement; 
	@Input() data: any;

	dialog: NbDialogRef<PointDialogComponent>;

	constructor(protected dialogService: NbDialogService) {}

	open(ev: Event) {
		this.dialogService.open(PointDialogComponent, {
			closeOnEsc: true,
		}).onClose.subscribe((point: any) => {
			this.data = point;
		});
	}

}