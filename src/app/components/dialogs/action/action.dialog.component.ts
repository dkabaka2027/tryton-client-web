import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { DRIVERS, Locker } from 'angular-safeguard';
import { Decoder } from '../../../services/pyson/index';
import { Form, FormElement } from '../../../services/index';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'action-dialog',
	styleUrls: ['./action.dialog.component.scss'],
	templateUrl: './action.dialog.component.html'
})
export class ActionDialogComponent implements OnInit, OnDestroy {

	@Input() id: number;
	@Input() action: string;
	@Input() action_id: number;
	@Input() active_ids: number[];
	@Input() active_model: string;
	@Input() title: string;
	@Input() buttons: any[];
	@Input() defaults: any;
	@Input() fields: any;
	@Input() state: string;
	@Input() window: boolean;

	model: string;

	data: any;

	user: any;

	decoder: Decoder;
	
	form: Form;

	constructor(protected http: HttpClient, protected dialogRef: NbDialogRef<ActionDialogComponent>, protected locker: Locker) {
		this.user = this.locker.get(DRIVERS.LOCAL, 'user');
		this.decoder = new Decoder(this.user.context, false);
	}

	ngOnInit() {
    const packs: string = '[tryton|gnuhealth|icon|health]+';
		this.buttons = this.buttons.map((x: any, i: number) => {
			let pack: string = x.icon.match(packs)[0];
			let icon = x.icon.replace('.', '-').replace(pack + '-', '');
			x.icon = {
				icon: icon,
				pack: pack
			};
			return x; 
		});

		this.model = this.fields.model;

		return;
	}

	ngOnDestroy() {
		return;
	}

	parse(): Form {
		return;
	}

	parseNode(node: Node): FormElement {
			return
	}

	getFields() {
			return;
	}

	cancel() {
		// TODO: call call wizard.{model}.delete with id
		this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: 'wizard.' + this.model + '.delete',
				params: [
					this.id,
					this.user.context
				]
			}
		).subscribe((res: TrytonResponse) => {
			if(res.result == null) {
				this.dialogRef.close();
			// } else {
				// TODO: Create a toaster if not null or error
			}
		});
	}

	submit(ev: string) {
		this.user.context.action_id = this.action_id;
		this.user.context.active_ids = [this.active_ids];
		this.user.context.active_model = this.active_model;

		let keys: string[] = Object.keys(this.fields.view.defaults);
		let param: any = {};
		param[this.state] = {
			id: -2
		};
		param[this.state][keys[0]] = this.fields.view.defaults[keys[0]];

		// TODO: Execute action or submit form
		this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				id: Math.floor(Math.random() * 100),
				method: 'wizard.' + this.model + '.execute',
				params: [
					this.id,
					param,
					'',
					this.user.context
				]
			}
		).subscribe((res: TrytonResponse) => {
			this.dialogRef.close(this.data);
		});
	}

}