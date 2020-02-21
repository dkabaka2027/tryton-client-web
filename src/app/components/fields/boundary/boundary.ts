import { FormElement } from '../../../services/index';
import { Component, Input, Output } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { BoundaryDialogComponent } from '../../../components/dialogs/boundary/boundary.dialog.component';

// TODO: New dialog that opens up map for selecting boundary
@Component({
	selector: 'boundary',
	styleUrls: ['./boundary.scss'],
	template: `
		<div class="form-control-group">
    		<label class="label" for="input-{{field.name}}">{{field.string}}</label>
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
export class BoundaryComponent {

	@Input() field: FormElement;
	@Input() data: any[];

	dialog: NbDialogRef<BoundaryDialogComponent>;

	constructor(protected dialogService: NbDialogService) {}

	open(ev: Event) {
		this.dialog = this.dialogService.open(BoundaryDialogComponent, {
			closeOnEsc: true,
		});

		this.dialog.onClose.subscribe((boundaries: any[]) => {
			this.data = boundaries;
		});
	}
}