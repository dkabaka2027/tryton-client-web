import { NbDialogRef } from '@nebular/theme';
import { FormElement } from '../../../services/index';
import { ModelService } from '../../../services/model.service';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
	selector: 'relation-dialog',
	styleUrls: ['./relation.dialog.component.scss'],
	templateUrl: './relation.dialog.component.html'
})
export class RelationDialogComponent implements OnInit, OnDestroy {

	@Input() id: number;
	@Input() data: any[];
	@Input() field: FormElement;
	@Input() buttons: boolean = false;
	@Input() isView: boolean;

	errors: any[];

	constructor(protected dialogRef: NbDialogRef<RelationDialogComponent>, protected modelService: ModelService) {
		this.modelService.setModel(this.field.relation);
	}

	ngOnInit() {
		this.fetchData();
		return;
	}

	ngOnDestroy() {
		return
	}

	getFields(): string[] {
		let keys: string[] = Object.keys(this.field.views);
		return Object.keys(this.field.views[keys[0]].fields);
	}

	fetchData() {
		this.modelService.read([this.id], this.getFields())
			.subscribe((res: TrytonResponse) => {
				this.data = res.result
			});
	}

	submit(ev: any): void {
		this.modelService.create(this.data).subscribe((res: TrytonResponse) => {
			if(res.error) {
				this.errors = res.error.map((e, i) => {
					this.errors.push(e);
				});
			} else {
				this.dialogRef.close(res.result.id);
			}
		});
	}

	cancel(ev: any): void {
		this.dialogRef.close();
	}

	onClose(ev: any) {

	}

}