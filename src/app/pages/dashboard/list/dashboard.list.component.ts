import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { DRIVERS, Locker } from 'angular-safeguard';
import { ModelService } from '../../../services/model.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { TrytonResponse } from '../../../services/admin.resources.service';
import { Component, OnInit, OnDestroy, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
	selector: 'dashboard-list',
	styleUrls: ['./dashboard.list.component.scss'],
	templateUrl: './dashboard.list.component.html'
})
export class DashboardListComponent implements OnInit, OnDestroy {

	@ViewChild('grid', { static: true }) grid: ViewContainerRef;

	user: any;
	options: GridsterConfig = {
		minCols: 12,
	    maxCols: 24,
	    minRows: 12,
	    maxRows: 24,
	};
	widgets: any[] = [];
	items: GridsterItem[] = [];

	constructor(protected http: HttpClient, protected modelService: ModelService, protected locker: Locker, protected dialogService: NbDialogService) {
		this.user = this.locker.get(DRIVERS.LOCAL, 'user');
	}


	ngOnInit() {
		this.loadWidgets();
		return;
	}

	ngOnDestroy() {
		return;
	}

	processWidgets(widgets: any[]): GridsterItem[] {
		return widgets.map((widget: any) => {
			return {
				x: <number> widget.x,
				y: <number> widget.y,
				rows: <number> widget.height,
				cols: <number> widget.width,
				dragEnabled: true,
				resizeEnabled: true,
				dsl: widget.dsl,
				data: widget.data
			};
		});
	}

	loadWidgets(): void {
		this.http.post<TrytonResponse>(
			'http://localhost:4200/tryton/' + this.user.database + '/',
			{
				method: 'model.fabric.dashboard.widget.search',
				params: [
					[
						['user', '=', this.user.id]
					],
					0,
					1000,
					this.user.context
				]
			}
		).subscribe((res: TrytonResponse) => {
			this.http.post<TrytonResponse>(
				'http://localhost:4200/tryton/' + this.user.database + '/',
				{
					method: 'model.fabric.dashboard.widget.read',
					params: [
						res.result,
						this.user.context
					]
				}
			).subscribe((res: TrytonResponse) => {
				this.widgets = res.result;
				this.items = this.processWidgets(res.result);
			});
		})
	}

	openConfiguration(ev: any) {
		return;
	}

}